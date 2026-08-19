import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-28 bg-[var(--color-background)]">
      <Container>
        <ScrollReveal>
          <SectionHeading 
            subtitle="Find os" 
            title="Kontakt & Lokation" 
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          {/* Contact Details */}
          <ScrollReveal direction="left">
            <div>
              <p className="text-[var(--color-text-muted)] text-lg mb-10 leading-relaxed">
                Har du spørgsmål, eller ønsker du at booke en tid telefonisk? 
                Du er altid velkommen til at kontakte os, eller blot møde op i salonen.
              </p>

              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mr-6 flex-shrink-0 group-hover:shadow-[0_0_20px_var(--color-brand-glow)] group-hover:border-[var(--color-brand)]/30 transition-all duration-300">
                    <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading text-lg mb-2 uppercase tracking-wide">Adresse</h3>
                    <p className="text-[var(--color-text-muted)]">
                      {siteConfig.businessName}<br />
                      {siteConfig.contact.address}<br />
                      {siteConfig.contact.postalCode} {siteConfig.contact.city}
                    </p>
                    {siteConfig.contact.directionsUrl && (
                      <a 
                        href={siteConfig.contact.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-[var(--color-brand-light)] hover:text-white text-sm font-medium uppercase tracking-wider transition-colors"
                      >
                        Find vej &rarr;
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mr-6 flex-shrink-0 group-hover:shadow-[0_0_20px_var(--color-brand-glow)] group-hover:border-[var(--color-brand)]/30 transition-all duration-300">
                    <Phone className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading text-lg mb-2 uppercase tracking-wide">Telefon</h3>
                    <a 
                      href={`tel:${siteConfig.contact.phone.replace(/\\s/g, '')}`} 
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-light)] transition-colors text-xl font-medium"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mr-6 flex-shrink-0 group-hover:shadow-[0_0_20px_var(--color-brand-glow)] group-hover:border-[var(--color-brand)]/30 transition-all duration-300">
                    <Mail className="w-5 h-5 text-[var(--color-brand)]" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading text-lg mb-2 uppercase tracking-wide">Email</h3>
                    <a 
                      href={`mailto:${siteConfig.contact.email}`} 
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-light)] transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Map Placeholder */}
          <ScrollReveal direction="right">
            <div className="glass-elevated rounded-2xl min-h-[400px] flex flex-col items-center justify-center relative p-8 text-center group overflow-hidden">
              {/* Styled background */}
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Copenhagen&zoom=14&size=800x800&sensor=false&style=feature:all|element:labels.text.fill|color:0xffffff&style=feature:all|element:labels.text.stroke|visibility:on|color:0x000000|weight:2&style=feature:all|element:labels.icon|visibility:off&style=feature:landscape|element:geometry|color:0x171a1a&style=feature:poi|element:geometry|color:0x292c2c&style=feature:road|element:geometry.fill|color:0x353333&style=feature:road|element:geometry.stroke|color:0x0b0d0d&style=feature:transit|element:geometry|color:0x174e4d&style=feature:water|element:geometry|color:0x0b0d0d')] bg-cover bg-center opacity-20 grayscale rounded-2xl"></div>
              
              <MapPin className="w-14 h-14 text-[var(--color-brand)] mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl text-white font-heading mb-6 relative z-10">Find Os</h3>
              <Button 
                href={siteConfig.contact.directionsUrl} 
                variant="primary" 
                className="relative z-10"
              >
                Åbn Google Maps
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
