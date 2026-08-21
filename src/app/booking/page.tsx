import BookingWizard from "@/components/booking/BookingWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Bestil tid hos FRISØR KBH | Herrefrisør i København",
  description:
    "Bestil din næste frisørtid online hos FRISØR KBH på Vesterbrogade 171. Vi tilbyder herreklip, fades og skægtrimning.",
};

export default function BookingPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-6 md:px-8 pt-28"
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Breadcrumb back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-brand-light)] text-sm uppercase tracking-wider font-medium transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
          Tilbage til forsiden
        </Link>
        <BookingWizard />
      </div>
    </main>
  );
}
