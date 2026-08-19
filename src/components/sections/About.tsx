import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CheckCircle2 } from "lucide-react";


export function About() {
  const highlights = [
    "Erfarne frisører",
    "Moderne og klassiske klipninger",
    "Med og uden tidsbestilling",
    "Nem online booking",
  ];

  return (
    <section id="about" className="py-28 bg-[var(--color-surface)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <SectionHeading 
                subtitle="Om FRISØR KBH" 
                title="Din lokale herrefrisør i København" 
              />
              
              <div className="space-y-6 text-[var(--color-text-muted)] text-lg leading-relaxed mb-10">
                <p>
                  Velkommen til FRISØR KBH. Vi er mere end bare en barbershop – vi er dit frirum i hverdagen. Hos os får du en professionel behandling, uanset om du skal have en skarp skin fade, en klassisk herreklip, eller blot have rettet skægget.
                </p>
                <p>
                  Vi går op i detaljerne og sørger for, at du altid forlader salonen med et resultat, du er tilfreds med. Vores døre er åbne for alle, og vi byder altid på en afslappet atmosfære.
                </p>
              </div>

              <ScrollReveal stagger className="space-y-4">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center text-white">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-brand)] mr-4 flex-shrink-0" />
                    <span className="font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl z-10 border border-white/[0.08]">
                <div className="absolute inset-0 bg-[var(--color-charcoal)]" /> {/* Fallback color */}
                {/* <Image 
                  src="/images/about.webp" 
                  alt="FRISØR KBH Salonen" 
                  fill 
                  className="object-cover"
                /> */}
                {/* Placeholder text if image is missing */}
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] opacity-50 flex-col">
                  <span>[Billede af salon/frisør]</span>
                  <span className="text-xs mt-2">Placeres i /public/images/about.webp</span>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div
                className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-[var(--color-brand-dark)] rounded-xl z-0 hidden md:block"
                style={{ opacity: 0.3, animation: "gentlePulse 4s ease-in-out infinite" }}
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[var(--color-brand)]/40 rounded-tl-xl z-20 hidden md:block" />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
