import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getBookings, createBooking } from "@/lib/db";

const createBookingSchema = z.object({
  bookingReference: z.string().min(3),
  pnr: z.string().min(3),
  carrierCode: z.string().min(1),
  carrierName: z.string().min(1),
  flightNumber: z.string().min(1),
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  passengers: z.array(z.any()),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  totalAmount: z.number().int(),
  currency: z.string().default("INR"),
  status: z.string().default("confirmed"),
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "usr-demo-1";

  const list = await getBookings(userId);
  return NextResponse.json({ success: true, count: list.length, bookings: list });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || "usr-demo-1";

  try {
    const json = await request.json();
    const parsed = createBookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const created = await createBooking({
      ...parsed.data,
      userId,
    });

    return NextResponse.json({ success: true, booking: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: String(error) } },
      { status: 500 }
    );
  }
}
