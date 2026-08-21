"use server";

import { getDb } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function addGalleryImage(url: string, altText: string = "") {
  try {
    const db = getDb();
    
    await db.insert(galleryImages).values({
      url,
      altText,
    });
    
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to add gallery image:", error);
    return { success: false, error: "Failed to save image metadata" };
  }
}
