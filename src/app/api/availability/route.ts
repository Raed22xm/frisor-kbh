import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking/availability";
import { BookingError } from "@/lib/booking/errors";
import { availabilityQuerySchema } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = availabilityQuerySchema.safeParse({
      date: searchParams.get("date") ?? "",
      employeeId: searchParams.get("employeeId") ?? "",
      treatmentId: searchParams.get("treatmentId") ?? "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ugyldige parametre." },
        { status: 400 }
      );
    }

    const result = await getAvailability(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API /availability] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente ledige tider." },
      { status: 500 }
    );
  }
}
