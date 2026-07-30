import { sendAlertEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  source: z.string().default("popup"),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  travelDates: z.string().optional(),
  guests: z.coerce.number().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const lead = await prisma.lead.create({ data });
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    await sendAlertEmail({
      to: settings?.alertEmail,
      subject: `New lead (${data.source}): ${data.name}`,
      text: `${data.name}\n${data.email}\n${data.phone}\n${data.message || ""}\nDates: ${data.travelDates || "-"}\nSource: ${data.source}`,
    });
    return NextResponse.json({ ok: true, id: lead.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
