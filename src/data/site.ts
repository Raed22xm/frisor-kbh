import { SiteConfig, NavigationItem, ServiceItem, OpeningHoursItem, BenefitItem } from "@/types/site";

// ---------------------------------------------------------------------------
// Helper — formats a numeric price as a Danish display string
// ---------------------------------------------------------------------------
function kr(amount: number): string {
  return `${amount} kr.`;
}

// ---------------------------------------------------------------------------
// Site Configuration
// ---------------------------------------------------------------------------
export const siteConfig: SiteConfig = {
  businessName: "FRISØR KBH",
  tagline: "Online booking, drop-in og skarp herreklip på Frederiksberg",
  description:
    "FRISØR KBH er en lokal herrefrisør på Vesterbrogade med fokus på herreklip, skin fade og skægtrimning i en rolig og professionel salon.",
  // REC-13: reads from environment so staging/production use the correct domain
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://frisor-kbh.dk",
  contact: {
    phone: "+45 42 20 24 29",
    // REC-01: real email — update when confirmed
    email: "booking@frisor-kbh.dk",
    address: "Vesterbrogade 171",
    postalCode: "1800",
    city: "Frederiksberg",
    bookingUrl: "/booking",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Vesterbrogade%20171%2C%201800%20Frederiksberg",
  },
  // REC-02: set to "" or undefined to hide social icons until real URLs are ready
  social: {
    instagram: "",
    facebook: "",
  },
  seo: {
    defaultTitle: "FRISØR KBH | Herrefrisør på Frederiksberg",
    defaultDescription:
      "Book tid hos FRISØR KBH på Vesterbrogade 171. Herreklip, skin fade og skægtrimning med online booking, drop-in og tydelige priser.",
  },
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export const navigation: NavigationItem[] = [
  { label: "Forside", href: "/#hero" },
  { label: "Om os", href: "/#about" },
  { label: "Priser", href: "/#services" },
  { label: "Galleri", href: "/#gallery" },
  { label: "Kontakt", href: "/#contact" },
];

// ---------------------------------------------------------------------------
// Services  (REC-01 + REC-14: price is now number | null)
// ---------------------------------------------------------------------------
export const services: ServiceItem[] = [
  {
    id: "herreklip",
    name: "Herreklip",
    price: 200,
    description: "Klassisk herreklip med saks og maskine, afsluttet med styling.",
    duration: "30 min",
    durationMinutes: 30,
    featured: true,
    image: "/images/services/herreklip-customer.webp",
    imageAlt: "Kunde med færdig klassisk herreklip",
  },
  {
    id: "skaeg",
    name: "Skæg",
    price: 125,
    description: "Trimning og formning af skæg, så linjerne står skarpt.",
    duration: "15 min",
    durationMinutes: 15,
    featured: true,
    image: "/images/services/skaegtrimning-customer.webp",
    imageAlt: "Kunde med færdigtrimmet og formet skæg",
  },
  {
    id: "haar-og-skaeg",
    name: "Hår og skæg",
    price: 300,
    description: "Komplet behandling med klipning, skægtrimning og skarpe kanter.",
    duration: "45 min",
    durationMinutes: 45,
    featured: true,
    image: "/images/services/herreklip-og-skaeg-customer.webp",
    imageAlt: "Kunde med frisk herreklip og formet skæg",
  },
  {
    id: "pensionist",
    name: "Pensionist",
    price: 180,
    description: "Rolig og grundig klipning til pensionister med fokus på et pænt, naturligt resultat.",
    duration: "30 min",
    durationMinutes: 30,
    image: "/images/services/pensionistklip-customer.webp",
    imageAlt: "Ældre kunde med færdig klassisk klipning og sølvgråt hår",
  },
  {
    id: "pensionist-med-saks",
    name: "Pensionist (med saks)",
    price: 200,
    description: "Klassisk pensionistklip udført med saks for et naturligt resultat.",
    duration: "30 min",
    durationMinutes: 30,
    image: "/images/services/pensionist-saks-customer-v2.jpg",
    imageAlt: "Pensionist med klassisk sakseklip",
  },
  {
    id: "maskineklip",
    name: "Maskineklip",
    price: 100,
    description: "Ensartet, kort klipning med maskine.",
    duration: "15 min",
    durationMinutes: 15,
    image: "/images/services/maskineklip-customer-v2.jpg",
    imageAlt: "Kunde med kort maskineklip",
  },
  {
    id: "boerneklip-under-10",
    name: "Børneklip (under 10 år)",
    price: 180,
    description: "Tryg og rolig klipning for børn under 10 år.",
    duration: "30 min",
    durationMinutes: 30,
    image: "/images/services/boerneklip-customer-v2.jpg",
    imageAlt: "Barn med færdig børneklipning",
  },
  {
    id: "haarfjerning-voks-traad",
    name: "Hårfjerning med voks og tråd",
    price: 50,
    description: "Præcis hårfjerning med voks og tråd.",
    duration: "15 min",
    durationMinutes: 15,
    image: "/images/services/haarfjerning-voks-traad-customer-v2.jpg",
    imageAlt: "Hårfjerning med tråd",
  },
];

// ---------------------------------------------------------------------------
// Benefits
// ---------------------------------------------------------------------------
export const benefits: BenefitItem[] = [
  {
    title: "Professionel betjening",
    description: "Du bliver mødt i en rolig salon med fokus på detaljerne.",
    iconName: "Scissors",
  },
  {
    title: "Moderne & klassiske styles",
    description: "Vi mestrer alt fra klassisk klip til moderne skin fades.",
    iconName: "User",
  },
  {
    title: "Afslappet atmosfære",
    description: "Nyd en god kop kaffe og en uformel stemning i salonen.",
    iconName: "Coffee",
  },
  {
    title: "Booking og drop-in",
    description: "Book online på få minutter, ring til os, eller kom forbi når der er plads.",
    iconName: "Calendar",
  },
];

// ---------------------------------------------------------------------------
// Opening Hours  (REC-01 + REC-15: structured openTime/closeTime for JSON-LD)
// ---------------------------------------------------------------------------
export const openingHours: OpeningHoursItem[] = [
  { day: "Mandag",  openTime: "10:00", closeTime: "18:00", hours: "10:00 – 18:00", schemaDay: "Monday" },
  { day: "Tirsdag", openTime: "10:00", closeTime: "18:00", hours: "10:00 – 18:00", schemaDay: "Tuesday" },
  { day: "Onsdag",  openTime: "10:00", closeTime: "18:00", hours: "10:00 – 18:00", schemaDay: "Wednesday" },
  { day: "Torsdag", openTime: "10:00", closeTime: "18:00", hours: "10:00 – 18:00", schemaDay: "Thursday" },
  { day: "Fredag",  openTime: "10:00", closeTime: "18:00", hours: "10:00 – 18:00", schemaDay: "Friday" },
  { day: "Lørdag",  openTime: "09:00", closeTime: "16:00", hours: "09:00 – 16:00", schemaDay: "Saturday" },
  { day: "Søndag",  hours: "Lukket", isClosed: true, schemaDay: "Sunday" },
];

// ---------------------------------------------------------------------------
// Price formatter utility
// ---------------------------------------------------------------------------
export function formatPrice(price: number | null, priceDisplay?: string): string {
  if (priceDisplay) return priceDisplay;
  if (price === null) return "Kontakt os";
  return kr(price);
}
