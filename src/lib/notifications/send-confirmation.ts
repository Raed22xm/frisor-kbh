import type { BookingResult } from "@/lib/booking/create-booking";
import { siteConfig } from "@/data/site";
import { sendEmail } from "./provider";

function formatDateDanish(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildConfirmationHtml(booking: BookingResult): string {
  return `
<!DOCTYPE html>
<html lang="da">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f8f6f3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2da;">
    <div style="padding:32px 28px 24px;background:#1a1a2e;color:#ffffff;text-align:center;">
      <h1 style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;">FRISØR KBH</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:0.7;">Vesterbrogade 171, 1800 Frederiksberg</p>
    </div>

    <div style="padding:28px;">
      <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e;">Booking bekræftet ✂️</h2>
      <p style="margin:0 0 20px;font-size:15px;color:#666;">
        Hej ${booking.customerName}, din tid hos FRISØR KBH er bekræftet.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#999;width:120px;">Behandling</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#1a1a2e;font-weight:500;">${booking.treatmentName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#999;">Pris</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#1a1a2e;font-weight:500;">${booking.priceLabel ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#999;">Frisør</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#1a1a2e;font-weight:500;">${booking.employeeName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#999;">Dato</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece6;color:#1a1a2e;font-weight:500;">${formatDateDanish(booking.date)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#999;">Tid</td>
          <td style="padding:10px 0;color:#1a1a2e;font-weight:500;">${booking.time}</td>
        </tr>
      </table>

      <p style="margin:24px 0 0;font-size:13px;color:#999;line-height:1.6;">
        Booking ID: ${booking.id}<br/>
        Har du brug for at ændre din tid? Ring til os på <strong>${siteConfig.contact.phone}</strong>.
      </p>
    </div>

    <div style="padding:16px 28px;background:#f8f6f3;text-align:center;font-size:12px;color:#999;">
      FRISØR KBH · Vesterbrogade 171 · 1800 Frederiksberg
    </div>
  </div>
</body>
</html>`;
}

/** Send a booking confirmation email to the customer. */
export async function sendBookingConfirmation(
  booking: BookingResult
): Promise<void> {
  await sendEmail({
    to: booking.customerEmail,
    subject: `Booking bekræftet — ${booking.treatmentName} ${booking.date} kl. ${booking.time}`,
    html: buildConfirmationHtml(booking),
    text: `Hej ${booking.customerName}, din booking hos FRISØR KBH er bekræftet.\n\nBehandling: ${booking.treatmentName}\nDato: ${formatDateDanish(booking.date)}\nTid: ${booking.time}\nFrisør: ${booking.employeeName}\n\nBooking ID: ${booking.id}\n\nHar du spørgsmål? Ring til os på ${siteConfig.contact.phone}.`,
  });
}
