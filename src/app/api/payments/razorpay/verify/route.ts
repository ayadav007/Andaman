import { getRazorpayConfig } from "@/lib/integrations";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  bookingId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: Request) {
  const { keySecret } = await getRazorpayConfig();
  if (!keySecret) {
    return NextResponse.json(
      { ok: false, error: "Razorpay not configured" },
      { status: 503 },
    );
  }

  try {
    const body = schema.parse(await req.json());
    const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;
    const expected = createHmac("sha256", keySecret).update(payload).digest("hex");
    if (expected !== body.razorpay_signature) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({ where: { id: body.bookingId } });
    if (!existing) return NextResponse.json({ ok: false }, { status: 404 });

    const booking = await prisma.booking.update({
      where: { id: body.bookingId },
      data: {
        razorpayPaymentId: body.razorpay_payment_id,
        razorpayOrderId: body.razorpay_order_id,
        paymentStatus: "paid",
        status: "confirmed",
        amountPaid: existing.amountDue,
      },
    });

    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    const count = await prisma.invoice.count();
    const invoice = await prisma.invoice.create({
      data: {
        bookingId: booking.id,
        number: `AE-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`,
        gstin: settings?.gstin,
        amount: booking.amountDue || 0,
        taxAmount: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      invoiceId: invoice.id,
      invoiceUrl: `/invoice/${invoice.id}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
