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
        description: "Klassisk herreklip med saks og maskine, afsluttet med styling.",
        durationMinutes: 30,
        price: "200 kr.",
        image: "/images/services/herreklip-customer.webp",
        imageAlt: "Kunde med færdig klassisk herreklip",
        featured: true,
        sortOrder: 0,
      },
      {
        id: "skaeg",
        categoryId: "skaeg",
        name: "Skæg",
        description: "Trimning og formning af skæg, så linjerne står skarpt.",
        durationMinutes: 15,
        price: "125 kr.",
        image: "/images/services/skaegtrimning-customer.webp",
        imageAlt: "Kunde med færdigtrimmet og formet skæg",
        featured: true,
        sortOrder: 0,
      },
      {
        id: "haar-og-skaeg",
        categoryId: "klip",
        name: "Hår og skæg",
        description: "Komplet behandling med klipning, skægtrimning og skarpe kanter.",
        durationMinutes: 45,
        price: "300 kr.",
        image: "/images/services/herreklip-og-skaeg-customer.webp",
        imageAlt: "Kunde med frisk herreklip og formet skæg",
        featured: true,
        sortOrder: 1,
      },
      {
        id: "pensionist",
        categoryId: "klip",
        name: "Pensionist",
        description: "Rolig og grundig klipning til pensionister med fokus på et pænt, naturligt resultat.",
        durationMinutes: 30,
        price: "180 kr.",
        image: "/images/services/pensionistklip-customer.webp",
        imageAlt: "Ældre kunde med færdig klassisk klipning og sølvgråt hår",
        sortOrder: 2,
      },
      {
        id: "pensionist-med-saks",
        categoryId: "klip",
        name: "Pensionist (med saks)",
        description: "Klassisk pensionistklip udført med saks for et naturligt resultat.",
        durationMinutes: 30,
        price: "200 kr.",
        image: "/images/services/pensionist-saks-customer-v2.jpg",
        imageAlt: "Pensionist med klassisk sakseklip",
        sortOrder: 3,
      },
      {
        id: "maskineklip",
        categoryId: "klip",
        name: "Maskineklip",
        description: "Ensartet, kort klipning med maskine.",
        durationMinutes: 15,
        price: "100 kr.",
        image: "/images/services/maskineklip-customer-v2.jpg",
        imageAlt: "Kunde med kort maskineklip",
        sortOrder: 4,
      },
      {
        id: "boerneklip-under-10",
        categoryId: "klip",
        name: "Børneklip (under 10 år)",
        description: "Tryg og rolig klipning for børn under 10 år.",
        durationMinutes: 30,
        price: "180 kr.",
        image: "/images/services/boerneklip-customer-v2.jpg",
        imageAlt: "Barn med færdig børneklipning",
        sortOrder: 5,
      },
      {
        id: "haarfjerning-voks-traad",
        categoryId: "pleje",
        name: "Hårfjerning med voks og tråd",
        description: "Præcis hårfjerning med voks og tråd.",
        durationMinutes: 15,
        price: "50 kr.",
        image: "/images/services/haarfjerning-voks-traad-customer-v2.jpg",
        imageAlt: "Hårfjerning med tråd",
        sortOrder: 0,
      },
    ])
    .onConflictDoUpdate({
      target: treatments.id,
      set: {
        categoryId: sql`excluded.category_id`,
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        durationMinutes: sql`excluded.duration_minutes`,
        price: sql`excluded.price`,
        image: sql`excluded.image`,
        imageAlt: sql`excluded.image_alt`,
        featured: sql`excluded.featured`,
        sortOrder: sql`excluded.sort_order`,
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
