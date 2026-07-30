import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createItinerary(formData: FormData) {
  "use server";
  const guestName = String(formData.get("guestName") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const travelStart = String(formData.get("travelStart") || "");
  const travelEnd = String(formData.get("travelEnd") || "");
  const guests = Number(formData.get("guests") || 2);
  const leadId = String(formData.get("leadId") || "") || undefined;
  const daysRaw = String(formData.get("days") || "");
  const quoteRaw = String(formData.get("quote") || "");
  const quoteTotal = Number(formData.get("quoteTotal") || 0) || null;
  const validUntil = String(formData.get("validUntil") || "") || null;

  const days = daysRaw
    .split("\n\n")
    .map((block, i) => {
      const [title, ...rest] = block.trim().split("\n");
      if (!title) return null;
      return {
        day: i + 1,
        title: title.replace(/^Day\s*\d+:?\s*/i, ""),
        body: rest.join("\n").trim(),
      };
    })
    .filter(Boolean);

  const quoteLines = quoteRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [item, amount] = line.split("|").map((s) => s.trim());
      return { item, amount: Number(amount) || 0 };
    });

  const it = await prisma.itinerary.create({
    data: {
      guestName,
      email,
      phone: phone || null,
      travelStart: travelStart || null,
      travelEnd: travelEnd || null,
      guests,
      leadId,
      daysJson: JSON.stringify(days),
      quoteLinesJson: JSON.stringify(quoteLines),
      quoteTotal,
      validUntil,
      status: "draft",
    },
  });
  redirect(`/itinerary/${it.shareToken}`);
}

export default async function NewItineraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ocean-deep">New itinerary / quote</h1>
      <p className="mt-1 text-sm text-ink/60">
        After save you’ll open a print-friendly page — use browser Print → Save as PDF.
      </p>
      <form action={createItinerary} className="mt-6 space-y-3 admin-card">
        {sp.leadId && <input type="hidden" name="leadId" value={sp.leadId} />}
        <div>
          <label className="label">Guest name</label>
          <input className="input" name="guestName" required defaultValue={sp.name || ""} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" required defaultValue={sp.email || ""} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" name="phone" defaultValue={sp.phone || ""} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Start</label>
            <input className="input" name="travelStart" type="date" />
          </div>
          <div>
            <label className="label">End</label>
            <input className="input" name="travelEnd" type="date" />
          </div>
          <div>
            <label className="label">Guests</label>
            <input className="input" name="guests" type="number" defaultValue={2} />
          </div>
        </div>
        <div>
          <label className="label">Days (separate days with a blank line)</label>
          <textarea
            className="textarea min-h-[200px]"
            name="days"
            placeholder={`Day 1: Arrive Port Blair\nAirport pickup, Cellular Jail\n\nDay 2: Havelock\nFerry + Radhanagar sunset`}
            required
          />
        </div>
        <div>
          <label className="label">Quote lines (Item | Amount)</label>
          <textarea
            className="textarea"
            name="quote"
            placeholder={`Hotel stay | 18000\nFerries | 4000\nTransfers | 2500`}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Quote total (₹)</label>
            <input className="input" name="quoteTotal" type="number" />
          </div>
          <div>
            <label className="label">Valid until</label>
            <input className="input" name="validUntil" type="date" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Save & open printable PDF view
        </button>
      </form>
    </div>
  );
}
