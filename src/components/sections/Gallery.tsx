import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Gallery() {
  // We'll use 6 placeholder images for the gallery. 
  // In a real app, these could come from site.ts
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section id="gallery" className="py-28 bg-[var(--color-background)]">
      <Container>
        <ScrollReveal>
          <SectionHeading 
            subtitle="Vores Arbejde" 
            title="Galleri" 
          />
        </ScrollReveal>
        
        <ScrollReveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12">
          {items.map((item) => (
            <div 
              key={item} 
              className="group relative aspect-square overflow-hidden bg-[var(--color-surface)] rounded-xl border border-white/[0.06] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white/[0.12] hover:shadow-[var(--shadow-lg)]"
            >
              {/* <Image 
                src={`/images/gallery/${item}.webp`}
                alt={`Galleri billede ${item}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              /> */}
              
              <div className="text-[var(--color-text-muted)] opacity-30 text-center p-4">
                <span className="block mb-2">Billede {item}</span>
                <span className="text-xs">/public/images/gallery/{item}.webp</span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl">
                <span className="text-white border border-white/30 px-5 py-2.5 text-sm uppercase tracking-widest font-medium rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-white/10">
                  Vis stort
                </span>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
