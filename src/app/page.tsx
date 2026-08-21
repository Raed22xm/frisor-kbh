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

export default function Home() {
  return (
    <>
      <Header />
      {/* REC-04: id="main-content" enables skip-to-content link target */}
      <main id="main-content" className="flex min-h-screen flex-col">
        <Hero />
        <Services />
        <Benefits />
        <OpeningHours />
        <Gallery />
        <About />
        <Contact />
        <BookingCTA />
      </main>
      <Footer />

      <FloatingBookingButton />
    </>
  );
}
