import { SiteConfig, NavigationItem, ServiceItem, OpeningHoursItem, BenefitItem } from "@/types/site";

export const siteConfig: SiteConfig = {
  businessName: "FRISØR KBH",
  tagline: "Med og uden tidsbestilling",
  description:
    "Professionel herrefrisør i København med fokus på klipning, fades og skægpleje.",
  url: "https://frisor-kbh.dk", // Placeholder domain
  contact: {
    phone: "[PHONE]",
    email: "[EMAIL]",
    address: "[ADDRESS]",
    postalCode: "[POSTCODE]",
    city: "København",
    bookingUrl: "[BOOKING URL]",
    directionsUrl: "https://maps.google.com/?q=[ADDRESS],[POSTCODE]+København",
  },
  social: {
    instagram: "[INSTAGRAM URL]",
    facebook: "[FACEBOOK URL]",
  },
  seo: {
    defaultTitle: "FRISØR KBH | Herrefrisør i København",
    defaultDescription:
      "FRISØR KBH tilbyder professionelle herreklipninger, fades og skægpleje i København. Book din tid online eller kom forbi salonen.",
  },
};

export const navigation: NavigationItem[] = [
  { label: "Forside", href: "#hero" },
  { label: "Om os", href: "#about" },
  { label: "Priser", href: "#services" },
  { label: "Galleri", href: "#gallery" },
  { label: "Kontakt", href: "#contact" },
];

export const services: ServiceItem[] = [
  {
    id: "herreklip",
    name: "Herreklip",
    price: "240 kr.",
    description: "Klassisk klipning med saks og maskine. Inkl. vask og styling.",
    duration: "30 min",
    featured: true,
  },
  {
    id: "herreklip-skaeg",
    name: "Herreklip og skæg",
    price: "320 kr.",
    description: "Herreklip inkl. retning af skæg og varme håndklæder.",
    duration: "45 min",
    featured: true,
  },
  {
    id: "pensionistklip",
    name: "Pensionistklip",
    price: "150 kr.",
    duration: "30 min",
  },
  {
    id: "skin-fade",
    name: "Skin fade",
    price: "[PRICE]",
    description: "Helt kort i siderne, fadet op til toppen.",
    duration: "45 min",
  },
  {
    id: "skaegtrimning",
    name: "Skægtrimning",
    price: "[PRICE]",
    description: "Trimning og retning af skæg.",
    duration: "15 min",
  },
];

export const benefits: BenefitItem[] = [
  {
    title: "Erfarne frisører",
    description: "Vi har mange års erfaring inden for herreklip og grooming.",
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
    title: "Nem online booking",
    description: "Book din tid når det passer dig, eller kom ind fra gaden.",
    iconName: "Calendar",
  },
];

export const openingHours: OpeningHoursItem[] = [
  { day: "Mandag", hours: "[HOURS]" },
  { day: "Tirsdag", hours: "[HOURS]" },
  { day: "Onsdag", hours: "[HOURS]" },
  { day: "Torsdag", hours: "[HOURS]" },
  { day: "Fredag", hours: "[HOURS]" },
  { day: "Lørdag", hours: "[HOURS]" },
  { day: "Søndag", hours: "Lukket", isClosed: true },
];
