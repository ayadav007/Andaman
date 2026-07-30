import { getRazorpayConfig } from "@/lib/integrations";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingId: z.string(),
});

export async function POST(req: Request) {
  const { keyId, keySecret, configured } = await getRazorpayConfig();
  if (!configured || !keyId || !keySecret) {
    return NextResponse.json(
      { ok: false, error: "Razorpay not configured. Set keys in Admin → Integrations." },
      { status: 503 },
    );
  }

  try {
    const { bookingId } = schema.parse(await req.json());
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: true },
    });
    if (!booking) return NextResponse.json({ ok: false }, { status: 404 });

    const amount = booking.amountDue || booking.package?.priceFrom || 0;
    if (amount <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
    }

    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: booking.id.slice(0, 40),
      notes: {
        bookingId: booking.id,
        guest: booking.guestName,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        razorpayOrderId: order.id,
        paymentStatus: "pending_payment",
        amountDue: amount,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      bookingId: booking.id,
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Order failed" }, { status: 400 });
  }
}
