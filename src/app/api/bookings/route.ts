import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/booking/create-booking";
import { BookingError } from "@/lib/booking/errors";
import { createBookingSchema } from "@/lib/booking/validation";
import { sendBookingConfirmation } from "@/lib/notifications/send-confirmation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ugyldige data." },
        { status: 400 }
      );
    }

    const booking = await createBooking(parsed.data);

    console.log(
      `[Booking] Created ${booking.id} for ${booking.customerName} in ${Date.now() - startTime}ms`
    );

    // Send confirmation email (fire-and-forget — don't block the response)
    sendBookingConfirmation(booking).catch((emailError) => {
      console.error(
        `[Booking] Email failed for ${booking.id}:`,
        emailError
      );
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingError) {
      console.warn(
        `[Booking] Rejected: ${error.message} (${error.code}) in ${Date.now() - startTime}ms`
      );
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API /bookings] Error:", error);
    return NextResponse.json(
      { error: "Booking kunne ikke gennemføres." },
      { status: 500 }
    );
  }
}
