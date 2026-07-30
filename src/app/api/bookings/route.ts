import { sendAlertEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  guestName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  packageId: z.string().optional(),
  hotelId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  guests: z.coerce.number().default(2),
  notes: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    if (data.company) return NextResponse.json({ ok: true });
    const pkg = data.packageId
      ? await prisma.package.findUnique({ where: { id: data.packageId } })
      : null;
    const booking = await prisma.booking.create({
      data: {
        guestName: data.guestName,
        email: data.email,
        phone: data.phone,
        packageId: data.packageId,
        hotelId: data.hotelId,
        startDate: data.startDate,
        endDate: data.endDate,
        guests: data.guests,
        notes: data.notes,
        amountDue: pkg?.priceFrom,
        status: "pending",
        paymentStatus: "unpaid",
      },
    });
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    await sendAlertEmail({
      to: settings?.alertEmail,
      subject: `New booking: ${data.guestName}`,
      text: `${data.guestName}\n${data.email}\n${data.phone}\nPackage: ${pkg?.titleEn || "-"}\nGuests: ${data.guests}\n${data.notes || ""}`,
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
