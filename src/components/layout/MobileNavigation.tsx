import React, { useEffect, useRef } from "react";
import { navigation, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={navRef}
      className={cn(
        "absolute inset-x-0 top-full h-[calc(100dvh-100%)] z-40 overflow-y-auto md:hidden",
        "flex flex-col transition-all duration-500",
        "bg-black/90 backdrop-blur-2xl",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[var(--color-brand)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 px-4 py-12 flex flex-col items-center justify-center space-y-8 relative z-10">
        <nav className="flex flex-col items-center space-y-6">
          {navigation.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "text-2xl text-white/90 hover:text-[var(--color-brand-light)] uppercase font-heading tracking-wider transition-all duration-300",
                "hover:tracking-[0.15em]",
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: isOpen ? `${150 + index * 60}ms` : "0ms",
              }}
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          className={cn(
            "mt-10 w-full max-w-xs transition-all duration-500",
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: isOpen ? `${150 + navigation.length * 60 + 80}ms` : "0ms",
          }}
        >
          <Button
            href={siteConfig.contact.bookingUrl}
            variant="primary"
            size="lg"
            className="w-full text-lg shadow-[0_0_30px_var(--color-brand-glow)]"
            onClick={onClose}
          >
            Book Tid Nu
          </Button>
        </div>
      </div>
    </div>
  );
}
