import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/booking/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getCatalog();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("[API /services] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente behandlinger." },
      { status: 500 }
    );
  }
}
