import { getDb } from "./client";
import { categories, treatments, employees } from "./schema";
import { eq, sql } from "drizzle-orm";

/**
 * Seeds the database with FRISØR KBH's initial catalog data.
 * Run: npx tsx src/lib/db/seed.ts
 */
async function seed() {
  const db = getDb();

  console.log("🌱 Seeding categories...");
  await db
    .insert(categories)
    .values([
      {
        id: "klip",
        name: "Klipning",
        description: "Herreklip og styling",
        sortOrder: 0,
      },
      {
        id: "skaeg",
        name: "Skæg",
        description: "Skægtrimning og pleje",
        sortOrder: 1,
      },
      {
        id: "pleje",
        name: "Pleje",
        description: "Hårfjerning med voks og tråd",
        sortOrder: 2,
      },
    ])
    .onConflictDoNothing();

  console.log("🌱 Seeding treatments...");
  await db
    .insert(treatments)
    .values([
      {
        id: "herreklip",
        categoryId: "klip",
        name: "Herreklip",
        durationMinutes: 30,
        price: "200 kr.",
      },
      {
        id: "skaeg",
        categoryId: "skaeg",
        name: "Skæg",
        durationMinutes: 15,
        price: "125 kr.",
      },
      {
        id: "haar-og-skaeg",
        categoryId: "klip",
        name: "Hår og skæg",
        durationMinutes: 45,
        price: "300 kr.",
      },
      {
        id: "pensionist",
        categoryId: "klip",
        name: "Pensionist",
        durationMinutes: 30,
        price: "180 kr.",
      },
      {
        id: "pensionist-med-saks",
        categoryId: "klip",
        name: "Pensionist (med saks)",
        durationMinutes: 30,
        price: "200 kr.",
      },
      {
        id: "maskineklip",
        categoryId: "klip",
        name: "Maskineklip",
        durationMinutes: 15,
        price: "100 kr.",
      },
      {
        id: "boerneklip-under-10",
        categoryId: "klip",
        name: "Børneklip (under 10 år)",
        durationMinutes: 30,
        price: "180 kr.",
      },
      {
        id: "haarfjerning-voks-traad",
        categoryId: "pleje",
        name: "Hårfjerning med voks og tråd",
        durationMinutes: 15,
        price: "50 kr.",
      },
    ])
    .onConflictDoUpdate({
      target: treatments.id,
      set: {
        categoryId: sql`excluded.category_id`,
        name: sql`excluded.name`,
        durationMinutes: sql`excluded.duration_minutes`,
        price: sql`excluded.price`,
        active: true,
      },
    });

  // Keep old links/bookings valid while removing treatments not shown on the current price list.
  for (const retiredTreatmentId of [
    "herreklip-skaeg",
    "pensionistklip",
    "skin-fade",
    "skaegtrimning",
  ]) {
    await db
      .update(treatments)
      .set({ active: false })
      .where(eq(treatments.id, retiredTreatmentId));
  }

  console.log("🌱 Seeding employees...");
  await db
    .insert(employees)
    .values([
      { id: "frisor-kbh", name: "FRISØR KBH" },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
