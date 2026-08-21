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
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Header />
      {/* REC-04: id="main-content" enables skip-to-content link target */}
      <main id="main-content" className="flex min-h-screen flex-col">
        <Hero />
        <About />
        <Services />
        <Benefits />
        {/* REC-11: OpeningHours moved before Gallery — operational info before visual content */}
        <OpeningHours />
        <Gallery />
        <Contact />
        <BookingCTA />
      </main>
      <Footer />

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-10 duration-500 delay-1000">
        <Button
          href={siteConfig.contact.bookingUrl}
          variant="primary"
          className="rounded-full w-16 h-16 flex items-center justify-center p-0 shadow-[0_0_30px_var(--color-brand-glow)] hover:shadow-[0_0_50px_rgba(85,160,157,0.3)]"
          aria-label="Book Tid Nu"
          style={{
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        >
          <span className="font-bold text-xs uppercase">Book</span>
        </Button>
      </div>
    </>
  );
}
