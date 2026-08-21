import { getDb } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import GalleryUploader from "@/components/admin/GalleryUploader";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const db = getDb();
  
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(desc(galleryImages.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gallery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload and manage photos for your portfolio.
        </p>
      </div>
      
      {/* Upload Section */}
      <GalleryUploader />

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Dine Billeder ({images.length})</h2>
        
        {images.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-gray-500">Du har ikke uploadet nogen billeder endnu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.altText || "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  unoptimized // Supabase URLs don't need Next.js optimization locally
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="absolute bottom-3 left-3 opacity-0 transition-opacity group-hover:opacity-100">
                  {image.active ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-400 bg-emerald-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-gray-400 bg-gray-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      Skjult
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
