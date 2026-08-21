"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { addGalleryImage } from "@/app/admin/gallery/actions";

export default function GalleryUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 2. Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}. Make sure you created a 'gallery' bucket in Supabase and set it to public.`);
      }

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 4. Save to Database using Server Action
      const result = await addGalleryImage(publicUrlData.publicUrl, file.name);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to save to database");
      }

      // Clear the input
      e.target.value = '';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center transition-colors hover:bg-gray-50">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
        <svg className="mb-4 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-500">
          <span>{isUploading ? "Uploader..." : "Upload et billede"}</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF op til 5MB</p>
        
        {error && (
          <p className="mt-4 rounded bg-red-50 p-2 text-xs font-medium text-red-600 border border-red-200 w-full">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
