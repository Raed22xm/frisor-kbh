import { getDb } from "./client";
import { categories, treatments, employees } from "./schema";

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
        price: "240 kr.",
      },
      {
        id: "herreklip-skaeg",
        categoryId: "klip",
        name: "Herreklip og skæg",
        durationMinutes: 45,
        price: "320 kr.",
      },
      {
        id: "pensionistklip",
        categoryId: "klip",
        name: "Pensionistklip",
        durationMinutes: 30,
        price: "150 kr.",
      },
      {
        id: "skin-fade",
        categoryId: "klip",
        name: "Skin fade",
        durationMinutes: 45,
        price: "280 kr.",
      },
      {
        id: "skaegtrimning",
        categoryId: "skaeg",
        name: "Skægtrimning",
        durationMinutes: 15,
        price: "100 kr.",
      },
    ])
    .onConflictDoNothing();

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
