import BookingWizard from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Bestil tid hos FRISØR KBH | Herrefrisør i København",
  description:
    "Bestil din næste frisørtid online hos FRISØR KBH på Vesterbrogade 171. Vi tilbyder herreklip, fades og skægtrimning.",
};

export default function BookingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background px-4 py-16 sm:px-6 md:px-8 pt-32">
      <div className="mx-auto max-w-[1180px]">
        <BookingWizard />
      </div>
    </main>
  );
}
