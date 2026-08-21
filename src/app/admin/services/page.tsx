import { getDb } from "@/lib/db/client";
import { categories, treatments } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import ServicesManager from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const db = getDb();
  
  const allCategories = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const allTreatments = await db.select().from(treatments);
  
  const categoriesWithTreatments = allCategories.map((category) => {
    return {
      ...category,
      treatments: allTreatments.filter((t) => t.categoryId === category.id)
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Services</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your barbershop services, pricing, and durations.
        </p>
      </div>
      
      <ServicesManager 
        categoriesWithTreatments={categoriesWithTreatments} 
        allCategories={allCategories} 
      />
    </div>
  );
}
