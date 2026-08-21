import React, { useEffect, useRef } from "react";
import { navigation, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector)
    );
    focusableElements[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      ref={dialogRef}
      className="fixed inset-x-0 bottom-0 top-[calc(92px+env(safe-area-inset-top))] z-40 flex flex-col overflow-y-auto overscroll-contain bg-black/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Hovedmenu"
      tabIndex={-1}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--color-brand)]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center space-y-8 px-4 py-10">
        <nav aria-label="Mobil hovednavigation" className="flex flex-col items-center space-y-5">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="min-h-11 px-4 py-2 font-heading text-2xl uppercase tracking-wider text-white transition-[color,letter-spacing] hover:text-[var(--color-brand-light)] hover:tracking-[0.15em]"
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 w-full max-w-xs">
          <Button
            href={siteConfig.contact.bookingUrl}
            variant="primary"
            size="lg"
            className="w-full text-lg shadow-[0_0_30px_var(--color-brand-glow)]"
            onClick={onClose}
          >
            Book tid
          </Button>
        </div>
      </div>
    </div>
  );
}
