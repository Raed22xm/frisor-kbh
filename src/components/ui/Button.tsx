import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex touch-manipulation items-center justify-center font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider transition-[color,background-color,border-color,box-shadow,transform,filter,opacity] duration-200 ease-out active:scale-[0.97]";

  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--color-brand-dark)] to-[var(--color-brand)] text-white border border-[var(--color-brand)] hover:brightness-110 hover:shadow-[0_0_30px_var(--color-brand-glow)] hover:scale-[1.02] hover:border-[var(--color-brand-light)]",
    secondary:
      "bg-[var(--color-surface-light)] text-white hover:bg-[var(--color-charcoal)] border border-white/[0.08] hover:border-white/[0.15] hover:shadow-[var(--shadow-md)]",
    outline:
      "bg-transparent text-[var(--color-brand-light)] border border-[var(--color-brand)] hover:bg-[var(--color-brand)]/10 hover:shadow-[0_0_24px_var(--color-brand-glow)] hover:border-[var(--color-brand-light)]",
  };

  const sizes = {
    sm: "h-9 px-5 text-xs rounded-lg",
    md: "h-11 px-8 text-sm rounded-lg",
    lg: "h-14 px-10 text-base rounded-xl",
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
