export interface SiteConfig {
  businessName: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    bookingUrl: string;
    directionsUrl?: string;
  };
  social: {
    instagram?: string;
    facebook?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  /** Numeric price in DKK for structured data & sorting. null = price on request */
  price: number | null;
  /** Override the display string, e.g. "Fra 240 kr." — auto-generated when omitted */
  priceDisplay?: string;
  description?: string;
  duration?: string;
  durationMinutes?: number;
  bookingUrl?: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
}

export interface OpeningHoursItem {
  day: string;
  /** ISO 8601 time, e.g. "09:00" */
  openTime?: string;
  /** ISO 8601 time, e.g. "18:00" */
  closeTime?: string;
  /** Display string — auto-generated from openTime/closeTime when isClosed is false */
  hours: string;
  isClosed?: boolean;
  /** Schema.org day-of-week string for JSON-LD */
  schemaDay?: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  iconName: string; // Represents a lucide-react icon
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  /** Optional caption shown in lightbox */
  caption?: string;
}
