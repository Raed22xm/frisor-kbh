import React from "react";
import { benefits } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Scissors, User, Coffee, Calendar } from "lucide-react";

// Helper to map icon names to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  Scissors,
  User,
  Coffee,
  Calendar,
};

export function Benefits() {
  return (
    <section className="py-24 bg-[var(--color-surface)] relative overflow-hidden">
      {/* Subtle top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container>
        <ScrollReveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((benefit, index) => {
            const Icon = IconMap[benefit.iconName] || Scissors; // Fallback to Scissors
            
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_24px_var(--color-brand-glow)] group-hover:border-[var(--color-brand)]/30 transition-all duration-300">
                  <Icon className="w-7 h-7 text-[var(--color-brand)] group-hover:text-[var(--color-brand-light)] transition-colors duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-white font-heading text-xl mb-3 tracking-wide">{benefit.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </ScrollReveal>
      </Container>
    </section>
  );
}
