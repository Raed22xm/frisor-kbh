import React from "react";
import { ServiceItem } from "@/types/site";
import { Button } from "./Button";
import { Clock } from "lucide-react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceItem;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  const { name, price, description, duration, featured } = service;

  return (
    <div
      className={cn(
        "group relative flex flex-col p-7 rounded-xl glass-card transition-all duration-300 h-full",
        "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        featured
          ? "border-[var(--color-brand)]/40 hover:border-[var(--color-brand)]/70 hover:shadow-[0_8px_40px_var(--color-brand-glow)]"
          : "hover:border-white/[0.12]",
        className
      )}
    >
      {featured && (
        <span className="absolute -top-3 right-6 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-light)] text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wider rounded-full shadow-[0_4px_16px_var(--color-brand-glow)]">
          Populær
        </span>
      )}
      
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-heading text-white pr-4 group-hover:text-[var(--color-brand-light)] transition-colors duration-300">{name}</h3>
        <div className="text-[var(--color-brand-light)] font-bold text-xl whitespace-nowrap">
          {price}
        </div>
      </div>

      {description && (
        <p className="text-[var(--color-text-muted)] text-sm mb-6 flex-grow leading-relaxed">
          {description}
        </p>
      )}

      {!description && <div className="flex-grow" />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-6 border-t border-white/[0.06]">
        {duration ? (
          <div className="flex items-center text-[var(--color-text-muted)] text-sm">
            <Clock className="w-4 h-4 mr-2 text-[var(--color-brand)]/60" />
            {duration}
          </div>
        ) : (
          <div></div>
        )}
        
        <Button 
          href={service.bookingUrl || siteConfig.contact.bookingUrl}
          variant={featured ? "primary" : "outline"}
          size="sm"
          className="w-full sm:w-auto"
        >
          Book Tid
        </Button>
      </div>
    </div>
  );
}
