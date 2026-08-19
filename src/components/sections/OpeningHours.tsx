import React from "react";
import { openingHours } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

export function OpeningHours() {
  // Try to find the current day in Danish
  const todayIndex = new Date().getDay();
  // JS getDay(): 0 = Sunday, 1 = Monday, etc.
  const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  const currentDay = days[todayIndex];

  return (
    <section className="py-28 bg-[var(--color-surface-light)] relative overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <Container>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionHeading 
              subtitle="Planlæg dit besøg" 
              title="Åbningstider" 
              centered 
            />
          </ScrollReveal>
          
          <ScrollReveal direction="scale">
            <div className="glass-elevated rounded-2xl p-8 md:p-10 mt-12 shadow-2xl">
              <ul className="divide-y divide-white/[0.06]">
                {openingHours.map((item) => {
                  const isToday = item.day === currentDay;
                  
                  return (
                    <li 
                      key={item.day} 
                      className={cn(
                        "flex justify-between items-center py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200",
                        isToday ? "bg-[var(--color-brand)]/10 text-white border-l-[3px] border-l-[var(--color-brand)] -ml-1 pl-5 sm:pl-7" : "text-[var(--color-text-muted)]",
                        item.isClosed && !isToday && "opacity-50"
                      )}
                    >
                      <span className={cn("font-medium", isToday && "font-bold text-white")}>
                        {item.day}
                        {isToday && <span className="ml-2 text-xs uppercase tracking-wider text-[var(--color-brand-light)] font-bold">(I dag)</span>}
                      </span>
                      <span className={cn(
                        item.isClosed ? "text-[var(--color-error)] uppercase text-sm font-bold tracking-wider" : "",
                        isToday && !item.isClosed ? "font-bold text-white" : ""
                      )}>
                        {item.hours}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
