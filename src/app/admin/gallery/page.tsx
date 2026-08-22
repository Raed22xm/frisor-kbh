import { asc } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getDb()
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galleri</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Tilføj, redigér, sortér, skjul og slet billeder og videoer. Ændringer vises direkte på forsiden.
        </p>
      </div>

      <GalleryUploader />

      <section className="space-y-4" aria-labelledby="gallery-manager-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="gallery-manager-title" className="text-lg font-semibold text-gray-900">
              Dine medier ({images.length})
            </h2>
            <p className="mt-1 text-xs text-gray-500">Brug pilene til at ændre rækkefølgen på forsiden.</p>
          </div>
        </div>
        <GalleryManager
          key={images.map((image) => `${image.id}:${image.sortOrder}:${image.active}:${image.altText}:${image.caption}`).join("|")}
          images={images}
        />
      </section>
    </div>
  );
}
