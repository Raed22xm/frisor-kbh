import { SiteConfig, NavigationItem, ServiceItem, OpeningHoursItem, BenefitItem, GalleryItem } from "@/types/site";

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
    phone: "+45 52 61 00 78",
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
    price: 240,
    description: "Klassisk herreklip med saks og maskine, afsluttet med styling.",
    duration: "30 min",
    durationMinutes: 30,
    featured: true,
    image: "/images/services/herreklip-customer.webp",
    imageAlt: "Kunde med færdig klassisk herreklip",
  },
  {
    id: "herreklip-skaeg",
    name: "Herreklip og skæg",
    price: 320,
    description: "Komplet behandling med klipning, skægtrimning og skarpe kanter.",
    duration: "45 min",
    durationMinutes: 45,
    featured: true,
    image: "/images/services/herreklip-og-skaeg-customer.webp",
    imageAlt: "Kunde med frisk herreklip og formet skæg",
  },
  {
    id: "pensionistklip",
    name: "Pensionistklip",
    price: 150,
    description: "Rolig og grundig klipning til pensionister med fokus på et pænt, naturligt resultat.",
    duration: "30 min",
    durationMinutes: 30,
    image: "/images/services/pensionistklip-customer.webp",
    imageAlt: "Ældre kunde med færdig klassisk klipning og sølvgråt hår",
  },
  {
    id: "skin-fade",
    name: "Skin fade",
    price: 280,
    description: "Præcis fade med rene overgange og moderne finish.",
    duration: "45 min",
    durationMinutes: 45,
    image: "/images/services/skin-fade-customer.webp",
    imageAlt: "Kunde med færdig skin fade",
  },
  {
    id: "skaegtrimning",
    name: "Skægtrimning",
    price: 100,
    description: "Trimning og formning af skæg, så linjerne står skarpt.",
    duration: "15 min",
    durationMinutes: 15,
    image: "/images/services/skaegtrimning-customer.webp",
    imageAlt: "Kunde med færdigtrimmet og formet fuldskæg",
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
  { day: "Mandag",  openTime: "09:00", closeTime: "18:00", hours: "09:00 – 18:00", schemaDay: "Monday" },
  { day: "Tirsdag", openTime: "09:00", closeTime: "18:00", hours: "09:00 – 18:00", schemaDay: "Tuesday" },
  { day: "Onsdag",  openTime: "09:00", closeTime: "18:00", hours: "09:00 – 18:00", schemaDay: "Wednesday" },
  { day: "Torsdag", openTime: "09:00", closeTime: "18:00", hours: "09:00 – 18:00", schemaDay: "Thursday" },
  { day: "Fredag",  openTime: "09:00", closeTime: "18:00", hours: "09:00 – 18:00", schemaDay: "Friday" },
  { day: "Lørdag",  openTime: "09:00", closeTime: "15:00", hours: "09:00 – 15:00", schemaDay: "Saturday" },
  { day: "Søndag",  hours: "Lukket", isClosed: true, schemaDay: "Sunday" },
];

// ---------------------------------------------------------------------------
// Gallery  (REC-06: data-driven from site.ts; images placed in /public/images/gallery/)
// ---------------------------------------------------------------------------
export const galleryItems: GalleryItem[] = [
  { id: "g1", src: "/images/gallery/1.webp", alt: "Klassisk herreklip — siden", caption: "Klassisk herreklip" },
  { id: "g2", src: "/images/gallery/2.webp", alt: "Skin fade — frontvisning", caption: "Skin fade" },
  { id: "g3", src: "/images/gallery/3.webp", alt: "Skægtrimning", caption: "Skægtrimning" },
  { id: "g4", src: "/images/gallery/4.webp", alt: "Herreklip og skæg", caption: "Herreklip & skæg" },
  { id: "g5", src: "/images/gallery/5.webp", alt: "Frisørsalon interiør", caption: "Salonen" },
  { id: "g6", src: "/images/gallery/6.webp", alt: "Moderne fade klipning", caption: "Moderne fade" },
];

// ---------------------------------------------------------------------------
// Price formatter utility
// ---------------------------------------------------------------------------
export function formatPrice(price: number | null, priceDisplay?: string): string {
  if (priceDisplay) return priceDisplay;
  if (price === null) return "Kontakt os";
  return kr(price);
}
