import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  metadataBase: new URL(siteConfig.url || "http://localhost:3000"),
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.url,
    siteName: siteConfig.businessName,
    locale: "da_DK",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": siteConfig.businessName,
    "image": `${siteConfig.url}/brand/frisor-kbh-logo.png`,
    "@id": siteConfig.url,
    "url": siteConfig.url,
    "telephone": siteConfig.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.contact.address,
      "addressLocality": siteConfig.contact.city,
      "postalCode": siteConfig.contact.postalCode,
      "addressCountry": "DK"
    },
    "priceRange": "$$"
  };

  return (
    <html lang="da" className={`${inter.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}
