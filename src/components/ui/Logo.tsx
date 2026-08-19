import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 180, height = 50 }: LogoProps) {
  // We use a fallback text if the image fails to load,
  // but next/image doesn't have a built-in fallback UI out of the box
  // The alt text will be displayed if the image is missing.
  return (
    <Link href="/" className={cn("inline-block", className)} aria-label={`${siteConfig.businessName} Forside`}>
      <div className="relative" style={{ width, height }}>
        {/* Placeholder for the official logo - user to supply the actual file at this path */}
        <Image
          src="/brand/logo.png"
          alt={siteConfig.businessName}
          fill
          className="object-contain object-left"
          priority
        />
        {/* If the image is missing, the alt text shows up, but we can also use a CSS fallback if needed */}
      </div>
    </Link>
  );
}
