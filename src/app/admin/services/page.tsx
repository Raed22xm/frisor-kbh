import { getDb } from "@/lib/db/client";
import { categories, treatments } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import ServicesManager from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const db = getDb();
  
  const allCategories = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const allTreatments = await db.select().from(treatments).orderBy(asc(treatments.sortOrder));
  
  const categoriesWithTreatments = allCategories.map((category) => {
    return {
      ...category,
      treatments: allTreatments.filter((t) => t.categoryId === category.id)
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Behandlinger</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administrér behandlinger, priser, varighed, billeder og synlighed.
        </p>
      </div>
      
      <ServicesManager 
        key={allTreatments.map((treatment) => `${treatment.id}:${treatment.categoryId}:${treatment.sortOrder}:${treatment.active}:${treatment.name}:${treatment.price}:${treatment.image}`).join("|")}
        categoriesWithTreatments={categoriesWithTreatments} 
        allCategories={allCategories} 
      />
    </div>
  );
}
