import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-14", centered && "text-center", className)}>
      {subtitle && (
        <span className="text-[var(--color-brand-light)] font-semibold tracking-[0.2em] uppercase text-sm mb-4 block">
          {subtitle}
        </span>
      )}
      <h2
        className="font-heading text-[var(--color-text)] leading-tight"
        style={{
          fontSize: "clamp(1.875rem, 4vw, 3rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-[3px] w-0 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-light)] mt-6 rounded-full",
          centered ? "mx-auto" : "ml-0"
        )}
        style={{
          animation: "lineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards",
        }}
      />
    </div>
  );
}
