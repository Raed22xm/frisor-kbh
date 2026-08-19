import React from "react";
import { services } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Services() {
  return (
    <section id="services" className="py-28 bg-[var(--color-background)] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-brand)]/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <Container className="relative z-10">
        <ScrollReveal>
          <SectionHeading 
            subtitle="Vores Priser" 
            title="Klipning & Styling" 
            centered 
          />
        </ScrollReveal>
        
        <ScrollReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Bemærk: Priserne er vejledende og kan variere afhængigt af opgavens omfang. 
              Er du i tvivl, er du altid velkommen til at kontakte os eller spørge i salonen.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
