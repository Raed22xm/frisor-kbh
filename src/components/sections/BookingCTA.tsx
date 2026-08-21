import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function BookingCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Background with overlay — bg-fixed removed: unsupported on iOS Safari */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/about.webp"), linear-gradient(to bottom, #0b0d0d, #174e4d)' }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, var(--color-brand-light) 0%, transparent 70%)",
            animation: "float 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--color-brand) 0%, transparent 70%)",
            animation: "float-reverse 22s ease-in-out infinite",
          }}
        />
      </div>

      <Container className="relative z-10 text-center max-w-3xl mx-auto">
        <ScrollReveal direction="scale">
          <h2
            className="font-heading text-white mb-8 uppercase tracking-wide bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
            }}
          >
            Klar til din næste klipning?
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={150}>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-14 max-w-2xl mx-auto leading-relaxed">
            Book din tid online, eller kom forbi salonen med eller uden tidsbestilling.
            Vi glæder os til at byde dig velkommen.
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={300}>
          <Button 
            href={siteConfig.contact.bookingUrl} 
            size="lg" 
            className="px-14 py-7 text-lg shadow-[0_0_40px_var(--color-brand-glow)] transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(85,160,157,0.35)]"
            style={{
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          >
            Book tid
          </Button>
        </ScrollReveal>
      </Container>
      
      {/* Decorative gradient lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/40 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/40 to-transparent z-10" />
    </section>
  );
}
