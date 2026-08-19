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
  price: number | string;
  description?: string;
  duration?: string;
  bookingUrl?: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
}

export interface OpeningHoursItem {
  day: string;
  hours: string; // e.g., "10:00 - 18:00" or "Lukket"
  isClosed?: boolean;
}

export interface BenefitItem {
  title: string;
  description: string;
  iconName: string; // Represents a lucide-react icon
}
