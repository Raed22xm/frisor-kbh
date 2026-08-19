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

export function Logo({ className, width = 84, height = 88 }: LogoProps) {
  return (
    <Link href="/" className={cn("block leading-none", className)} aria-label={`${siteConfig.businessName} Forside`}>
      <div className="relative" style={{ width, height }}>
        <Image
          src="/brand/logo-transparent.png"
          alt={siteConfig.businessName}
          fill
          sizes={`${width}px`}
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
