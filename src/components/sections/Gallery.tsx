"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { galleryItems } from "@/data/site";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const isOpen = lightboxIndex !== null;
  const total = galleryItems.length;

  // ---------------------------------------------------------------------------
  // Keyboard navigation for lightbox
  // ---------------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + total) % total : total - 1
        );
    },
    [isOpen, total]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const currentItem =
    lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-28 bg-[var(--color-background)]">
      <Container>
        <ScrollReveal>
          <SectionHeading
            subtitle="Vores Arbejde"
            title="Galleri"
            centered
          />
        </ScrollReveal>

        <ScrollReveal
          stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12"
        >
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Vis stort: ${item.alt}`}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]",
                "bg-[var(--color-surface)] cursor-pointer transition-all duration-300",
                "hover:border-white/[0.18] hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              )}
            >
              {/* Image — graceful fallback if file doesn't exist yet */}
              {!imgErrors[item.id] ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                  }
                />
              ) : (
                // Placeholder shown when image file isn't placed yet
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)] opacity-25 gap-2 p-4">
                  <ZoomIn className="w-8 h-8" />
                  <span className="text-xs text-center">{item.alt}</span>
                  <span className="text-[10px] opacity-60">{item.src}</span>
                </div>
              )}

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl">
                <span className="flex items-center gap-2 text-white border border-white/30 px-5 py-2.5 text-sm uppercase tracking-widest font-medium rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75 bg-white/5 backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4" />
                  Vis stort
                </span>
              </div>
            </button>
          ))}
        </ScrollReveal>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* Lightbox — native <dialog>-style overlay                            */}
      {/* ------------------------------------------------------------------ */}
      {isOpen && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galleri: ${currentItem.alt}`}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Luk galleri"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white hover:text-[var(--color-brand-light)] hover:shadow-[0_0_20px_var(--color-brand-glow)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + total) % total : total - 1
              );
            }}
            aria-label="Forrige billede"
            className="absolute left-4 z-10 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white hover:text-[var(--color-brand-light)] hover:shadow-[0_0_20px_var(--color-brand-glow)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % total : 0
              );
            }}
            aria-label="Næste billede"
            className="absolute right-4 z-10 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white hover:text-[var(--color-brand-light)] hover:shadow-[0_0_20px_var(--color-brand-glow)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image container */}
          <div
            className="relative z-10 max-w-4xl max-h-[85vh] w-full mx-16 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square md:aspect-video">
              {!imgErrors[currentItem.id] ? (
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 900px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--color-surface)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)]">
                  <ZoomIn className="w-12 h-12 opacity-30" />
                  <p className="text-sm opacity-50">{currentItem.alt}</p>
                </div>
              )}
            </div>

            {/* Caption + counter */}
            {currentItem.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-between items-end">
                <p className="text-white font-medium text-lg">
                  {currentItem.caption}
                </p>
                <span className="text-white/50 text-sm tabular-nums">
                  {lightboxIndex! + 1} / {total}
                </span>
              </div>
            )}
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {galleryItems.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                aria-label={`Gå til billede ${i + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  i === lightboxIndex
                    ? "bg-[var(--color-brand-light)] w-5"
                    : "bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
