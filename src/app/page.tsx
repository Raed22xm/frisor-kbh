import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Benefits } from "@/components/sections/Benefits";
import { OpeningHours } from "@/components/sections/OpeningHours";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { FloatingBookingButton } from "@/components/ui/FloatingBookingButton";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { galleryImages } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  const managedGalleryImages = await getDb()
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.active, true))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));

  const galleryItems = managedGalleryImages.map((image) => ({
    id: image.id,
    src: image.url,
    alt: image.altText || "Billede fra FRISØR KBH",
    caption: image.caption || undefined,
  }));

  return (
    <>
      <Header />
      {/* REC-04: id="main-content" enables skip-to-content link target */}
      <main id="main-content" className="flex min-h-screen flex-col">
        <Hero />
        <Services />
        <Benefits />
        <OpeningHours />
        <Gallery items={galleryItems} />
        <About />
        <Contact />
        <BookingCTA />
      </main>
      <Footer />

      <FloatingBookingButton />
    </>
  );
}
