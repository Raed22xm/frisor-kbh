import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";


export function About() {
  const highlights = [
    "Professionel betjening i salonen",
    "Skin fade, klassisk herreklip og skæg",
    "Online booking og drop-in",
    "Tydelige priser og rolig atmosfære",
  ];

  return (
    <section id="about" className="bg-[var(--color-surface)] py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <SectionHeading
                subtitle="Om FRISØR KBH"
                title="Din lokale herrefrisør på Frederiksberg"
              />

              <div className="space-y-6 text-[var(--color-text-muted)] text-lg leading-relaxed mb-10">
                <p>
                  Velkommen til FRISØR KBH på Vesterbrogade. Her får du en rolig og professionel behandling, uanset om du skal have en skarp skin fade, en klassisk herreklip eller rettet skægget.
                </p>
                <p>
                  Vi går op i detaljerne, tydelige priser og en afslappet stemning, så du kan føle dig tryg fra du kommer ind, til du går ud med et resultat, der passer til dig.
                </p>
              </div>

              <ScrollReveal stagger className="space-y-4">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center text-white">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-brand-light)] mr-4 flex-shrink-0" aria-hidden="true" />
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
                <Image
                  src="/images/about.webp"
                  alt="FRISØR KBH salon og herreklip"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
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
