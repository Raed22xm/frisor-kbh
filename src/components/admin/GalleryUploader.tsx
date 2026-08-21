"use client";

import { useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Upload } from "lucide-react";
import {
  addGalleryImage,
  prepareGalleryUpload,
} from "@/app/admin/gallery/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readableAltText(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function sha256(file: File) {
  const bytes = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function GalleryUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setMessage(null);
    let uploaded = 0;
    let duplicates = 0;

    try {
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error(`${file.name}: brug JPG, PNG eller WebP.`);
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`${file.name}: filen er større end 5 MB.`);
        }

        const fileHash = await sha256(file);
        const uploadRequest = await prepareGalleryUpload({
          fileName: file.name,
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
          fileSize: file.size,
          fileHash,
        });
        if (uploadRequest.duplicate) {
          duplicates += 1;
          continue;
        }
        if (!uploadRequest.success || !uploadRequest.storagePath || !uploadRequest.token) {
          throw new Error(uploadRequest.error || `${file.name}: upload kunne ikke forberedes.`);
        }

        const storagePath = uploadRequest.storagePath;
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .uploadToSignedUrl(storagePath, uploadRequest.token, file, {
            cacheControl: "31536000",
          });
        if (uploadError) throw new Error(`${file.name}: ${uploadError.message}`);

        const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
        const result = await addGalleryImage({
          url: data.publicUrl,
          storagePath,
          fileHash,
          altText: readableAltText(file.name),
        });

        if (!result.success) {
          await supabase.storage.from("gallery").remove([storagePath]);
          if (result.duplicate) {
            duplicates += 1;
            continue;
          }
          throw new Error(result.error || `${file.name}: billedet kunne ikke gemmes.`);
        }
        uploaded += 1;
      }

      const parts = [
        uploaded > 0 ? `${uploaded} ${uploaded === 1 ? "billede" : "billeder"} uploadet.` : "",
        duplicates > 0 ? `${duplicates} dublet${duplicates === 1 ? "" : "ter"} sprunget over.` : "",
      ].filter(Boolean);
      setMessage(parts.join(" ") || "Ingen nye billeder blev uploadet.");
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload mislykkedes.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center sm:p-12">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Tilføj billeder</h2>
        <p className="mt-1 text-sm text-gray-500">
          Du kan vælge flere billeder. Identiske filer bliver automatisk afvist.
        </p>
        <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2">
          {isUploading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          {isUploading ? "Uploader…" : "Vælg billeder"}
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
        <p className="mt-3 text-xs text-gray-500">JPG, PNG eller WebP · maks. 5 MB pr. billede</p>
        {message ? <p className="mt-4 text-sm font-medium text-emerald-700" role="status">{message}</p> : null}
        {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
