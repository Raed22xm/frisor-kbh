"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { navigation, siteConfig } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileNavigation } from "./MobileNavigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer, #floating-booking-button")
    );
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    backgroundElements.forEach((element) => {
      element.inert = isMobileMenuOpen;
    });
    return () => {
      document.body.style.overflow = "";
      backgroundElements.forEach((element) => {
        element.inert = false;
      });
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,padding,box-shadow,border-color] duration-300",
        isScrolled
          ? "glass-elevated py-2 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-black/20 backdrop-blur-sm py-2"
      )}
    >
      {/* Subtle top glow line when scrolled */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/40 to-transparent transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo width={72} height={76} className={cn("transition-transform duration-300", isScrolled && "scale-[0.94]")} />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Hovednavigation" className="hidden space-x-8 md:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-white/80 hover:text-white uppercase tracking-wider text-sm font-medium transition-colors group py-1"
              >
                {item.label}
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-light)] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex flex-shrink-0">
            <Button
              href={siteConfig.contact.bookingUrl}
              variant="primary"
              size="sm"
              className="shadow-[0_0_20px_var(--color-brand-glow)]"
            >
              Book tid
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              ref={menuButtonRef}
              type="button"
              className="relative min-h-11 min-w-11 cursor-pointer rounded-lg p-2 text-white transition-[color,background-color] duration-200 hover:bg-white/5 hover:text-[var(--color-brand-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-light)]"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Luk menu" : "Åbn menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? "Luk menu" : "Åbn menu"}
              </span>
              <div className="relative w-7 h-7">
                <Menu
                  className={cn(
                    "absolute inset-0 h-7 w-7 transition-[opacity,transform] duration-300",
                    isMobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  )}
                  aria-hidden="true"
                />
                <X
                  className={cn(
                    "absolute inset-0 h-7 w-7 transition-[opacity,transform] duration-300",
                    isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  )}
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Modal */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </header>
  );
}
