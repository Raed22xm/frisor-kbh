import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="bg-[var(--color-background)] py-20 md:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading 
            subtitle="Find os" 
            title="Kontakt & lokation" 
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          {/* Contact Details */}
          <ScrollReveal direction="left">
            <div>
              <p className="text-[var(--color-text-muted)] text-lg mb-10 leading-relaxed">
                Har du spørgsmål, eller ønsker du at booke en tid telefonisk? 
                Du er altid velkommen til at kontakte os, eller blot møde op i salonen på{" "}
                Vesterbrogade 171, 1800 Frederiksberg.
              </p>

              <div className="mb-10 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  variant="primary"
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Ring nu
                </Button>
                <Button
                  href={siteConfig.contact.directionsUrl}
                  variant="outline"
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Få rutevejledning
                </Button>
              </div>

              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="mr-6 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl glass-card transition-[border-color,box-shadow] duration-300 group-hover:border-[var(--color-brand)]/30 group-hover:shadow-[0_0_20px_var(--color-brand-glow)]">
                    <MapPin className="w-5 h-5 text-[var(--color-brand-light)]" aria-hidden="true" />
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
                  <div className="mr-6 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl glass-card transition-[border-color,box-shadow] duration-300 group-hover:border-[var(--color-brand)]/30 group-hover:shadow-[0_0_20px_var(--color-brand-glow)]">
                    <Phone className="w-5 h-5 text-[var(--color-brand-light)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading text-lg mb-2 uppercase tracking-wide">Telefon</h3>
                    <a 
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-light)] transition-colors text-xl font-medium"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="mr-6 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl glass-card transition-[border-color,box-shadow] duration-300 group-hover:border-[var(--color-brand)]/30 group-hover:shadow-[0_0_20px_var(--color-brand-glow)]">
                    <Mail className="w-5 h-5 text-[var(--color-brand-light)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading text-lg mb-2 uppercase tracking-wide">E-mail</h3>
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

          {/* Map Embed */}
          <ScrollReveal direction="right">
            <div className="glass-elevated rounded-2xl min-h-[400px] flex flex-col items-center justify-center relative p-8 text-center group overflow-hidden">
              {/* Free Google Maps embed — no API key required */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2250.9!2d12.5406!3d55.6689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4652530b97f2fd59%3A0x5b66d7c41fcf36f7!2sVesterbrogade%20171%2C%201800%20Frederiksberg%2C%20Denmark!5e0!3m2!1sda!2sdk!4v1692000000000!5m2!1sda!2sdk"
                className="absolute inset-0 w-full h-full rounded-2xl grayscale opacity-30 transition-opacity duration-500 group-hover:opacity-45"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FRISØR KBH lokation på kort"
                aria-label="Google Maps kort der viser FRISØR KBH på Vesterbrogade 171, Frederiksberg"
              />
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-2xl pointer-events-none" />

              <MapPin className="w-14 h-14 text-[var(--color-brand-light)] mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" aria-hidden="true" />
              <h3 className="text-2xl text-white font-heading mb-6 relative z-10">Find os</h3>
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
