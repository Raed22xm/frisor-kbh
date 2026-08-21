"use server";

import { getDb } from "@/lib/db/client";
import { treatments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTreatment(data: {
  id: string;
  categoryId: string;
  name: string;
  durationMinutes: number;
  price: string;
}) {
  try {
    const db = getDb();
    
    await db.insert(treatments).values({
      id: data.id,
      categoryId: data.categoryId,
      name: data.name,
      durationMinutes: data.durationMinutes,
      price: data.price,
      active: true,
    });
    
    revalidatePath("/admin/services");
    revalidatePath("/booking");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add treatment:", error);
    return { success: false, error: error.message || "Failed to add treatment" };
  }
}

export async function toggleTreatmentStatus(id: string, currentStatus: boolean) {
  try {
    const db = getDb();
    
    await db.update(treatments)
      .set({ active: !currentStatus })
      .where(eq(treatments.id, id));
    
    revalidatePath("/admin/services");
    revalidatePath("/booking");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle treatment:", error);
    return { success: false, error: error.message || "Failed to toggle treatment status" };
  }
}

export async function deleteTreatment(id: string) {
  try {
    const db = getDb();
    
    await db.delete(treatments).where(eq(treatments.id, id));
    
    revalidatePath("/admin/services");
    revalidatePath("/booking");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete treatment:", error);
    return { success: false, error: error.message || "Failed to delete treatment" };
  }
}
