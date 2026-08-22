"use server";

import { createClient } from "@supabase/supabase-js";
import { and, asc, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { categories, treatments } from "@/lib/db/schema";

const idSchema = z.string().trim().min(1).max(120);
const imagePathSchema = z.string().regex(/^services\/[0-9a-f-]+\.(?:jpg|png|webp)$/);
const treatmentSchema = z.object({
  categoryId: idSchema,
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).default(""),
  durationMinutes: z.number().int().min(5).max(480),
  price: z.number().min(0).max(100000),
  image: z.string().url().nullable().optional(),
  imageAlt: z.string().trim().max(180).default(""),
  imageStoragePath: imagePathSchema.nullable().optional(),
  featured: z.boolean().default(false),
});
const uploadSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().positive().max(5 * 1024 * 1024),
});

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function refreshTreatments() {
  revalidatePath("/");
  revalidatePath("/booking");
  revalidatePath("/admin/services");
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("da-DK", { maximumFractionDigits: 2 }).format(price)} kr.`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "behandling";
}

async function removeStoredImage(storagePath: string | null | undefined) {
  if (!storagePath) return undefined;
  const parsed = imagePathSchema.safeParse(storagePath);
  const supabase = getSupabaseAdmin();
  if (!parsed.success || !supabase) return "Billedfilen kunne ikke fjernes fra lageret.";
  const { error } = await supabase.storage.from("services").remove([parsed.data]);
  if (error) {
    console.error("Failed to remove treatment image:", error);
    return "Billedfilen kunne ikke fjernes fra lageret.";
  }
  return undefined;
}

export async function prepareTreatmentImageUpload(input: z.input<typeof uploadSchema>) {
  const parsed = uploadSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Billedet er ugyldigt." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: "Billedlageret er ikke konfigureret." };

  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[parsed.data.mimeType];
  const storagePath = `services/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from("services")
    .createSignedUploadUrl(storagePath);

  if (error || !data?.token) {
    console.error("Failed to create treatment image upload:", error);
    return { success: false, error: "Upload kunne ikke forberedes." };
  }
  return { success: true, storagePath, token: data.token };
}

export async function discardTreatmentImageUpload(storagePath: string) {
  const parsed = imagePathSchema.safeParse(storagePath);
  if (!parsed.success) return { success: false };
  const warning = await removeStoredImage(parsed.data);
  return { success: !warning };
}

export async function addTreatment(input: z.input<typeof treatmentSchema>) {
  const parsed = treatmentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Kontrollér behandlingens oplysninger." };

  try {
    const db = getDb();
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, parsed.data.categoryId))
      .limit(1);
    if (!category) return { success: false, error: "Den valgte kategori findes ikke." };

    const [lastPosition] = await db
      .select({ value: max(treatments.sortOrder) })
      .from(treatments)
      .where(eq(treatments.categoryId, parsed.data.categoryId));
    const id = `${slugify(parsed.data.name)}-${crypto.randomUUID().slice(0, 8)}`;

    await db.insert(treatments).values({
      ...parsed.data,
      id,
      price: formatPrice(parsed.data.price),
      image: parsed.data.image ?? null,
      imageStoragePath: parsed.data.imageStoragePath ?? null,
      sortOrder: (lastPosition?.value ?? -1) + 1,
      active: true,
    });
    refreshTreatments();
    return { success: true };
  } catch (error) {
    console.error("Failed to add treatment:", error);
    return { success: false, error: "Behandlingen kunne ikke oprettes." };
  }
}

export async function updateTreatment(id: string, input: z.input<typeof treatmentSchema>) {
  const parsedId = idSchema.safeParse(id);
  const parsed = treatmentSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Kontrollér behandlingens oplysninger." };
  }

  try {
    const db = getDb();
    const [current] = await db
      .select()
      .from(treatments)
      .where(eq(treatments.id, parsedId.data))
      .limit(1);
    if (!current) return { success: false, error: "Behandlingen blev ikke fundet." };

    await db
      .update(treatments)
      .set({
        ...parsed.data,
        price: formatPrice(parsed.data.price),
        image: parsed.data.image ?? null,
        imageStoragePath: parsed.data.imageStoragePath ?? null,
      })
      .where(eq(treatments.id, parsedId.data));

    let warning: string | undefined;
    if (
      current.imageStoragePath &&
      current.imageStoragePath !== parsed.data.imageStoragePath
    ) {
      warning = await removeStoredImage(current.imageStoragePath);
    }
    refreshTreatments();
    return { success: true, warning };
  } catch (error) {
    console.error("Failed to update treatment:", error);
    return { success: false, error: "Behandlingen kunne ikke gemmes." };
  }
}

export async function setTreatmentStatus(id: string, active: boolean) {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success || typeof active !== "boolean") {
    return { success: false, error: "Status kunne ikke ændres." };
  }
  await getDb().update(treatments).set({ active }).where(eq(treatments.id, parsedId.data));
  refreshTreatments();
  return { success: true };
}

export async function reorderTreatments(categoryId: string, ids: string[]) {
  const parsedCategoryId = idSchema.safeParse(categoryId);
  const parsedIds = z.array(idSchema).min(1).max(100).safeParse(ids);
  if (!parsedCategoryId.success || !parsedIds.success) {
    return { success: false, error: "Rækkefølgen er ugyldig." };
  }

  const db = getDb();
  const existing = await db
    .select({ id: treatments.id })
    .from(treatments)
    .where(eq(treatments.categoryId, parsedCategoryId.data))
    .orderBy(asc(treatments.sortOrder));
  const existingIds = new Set(existing.map((treatment) => treatment.id));
  if (
    existingIds.size !== parsedIds.data.length ||
    parsedIds.data.some((id) => !existingIds.has(id))
  ) {
    return { success: false, error: "Listen har ændret sig. Opdater siden og prøv igen." };
  }

  await db.transaction(async (transaction) => {
    for (const [sortOrder, treatmentId] of parsedIds.data.entries()) {
      await transaction
        .update(treatments)
        .set({ sortOrder })
        .where(and(eq(treatments.id, treatmentId), eq(treatments.categoryId, parsedCategoryId.data)));
    }
  });
  refreshTreatments();
  return { success: true };
}

export async function deleteTreatment(id: string) {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Behandlingen blev ikke fundet." };

  try {
    const db = getDb();
    const [treatment] = await db
      .select()
      .from(treatments)
      .where(eq(treatments.id, parsedId.data))
      .limit(1);
    if (!treatment) return { success: false, error: "Behandlingen blev ikke fundet." };

    await db.delete(treatments).where(eq(treatments.id, parsedId.data));
    const warning = await removeStoredImage(treatment.imageStoragePath);
    refreshTreatments();
    return { success: true, warning };
  } catch (error) {
    console.error("Failed to delete treatment:", error);
    return { success: false, error: "Behandlingen kunne ikke slettes." };
  }
}
