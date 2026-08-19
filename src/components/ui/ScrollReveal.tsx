"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Direction of the reveal animation */
  direction?: "up" | "left" | "right" | "scale";
  /** Whether to stagger children individually */
  stagger?: boolean;
  /** Additional delay in ms before the element starts revealing */
  delay?: number;
  /** Intersection Observer threshold (0-1) */
  threshold?: number;
  /** Additional class names */
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  stagger = false,
  delay = 0,
  threshold = 0.15,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                el.classList.add("revealed");
              }, delay);
            } else {
              el.classList.add("revealed");
            }
            observer.unobserve(el);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [delay, threshold]);

  if (stagger) {
    return (
      <div ref={ref} data-reveal-stagger className={cn(className)}>
        {children}
      </div>
    );
  }

  const directionValue =
    direction === "up" ? undefined : direction;

  return (
    <div
      ref={ref}
      data-reveal={directionValue ?? ""}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
