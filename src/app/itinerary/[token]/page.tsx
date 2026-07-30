import { PrintButton } from "@/components/site/PrintButton";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Day = { day: number; title: string; body: string };
type Line = { item: string; amount: number };

export default async function ItineraryPublicPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [it, settings] = await Promise.all([
    prisma.itinerary.findUnique({ where: { shareToken: token } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  if (!it) notFound();

  let days: Day[] = [];
  let lines: Line[] = [];
  try {
    days = JSON.parse(it.daysJson) as Day[];
  } catch {
    days = [];
  }
  try {
    lines = JSON.parse(it.quoteLinesJson) as Line[];
  } catch {
    lines = [];
  }

  return (
    <div className="min-h-screen bg-white text-ink print:bg-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4 border-b border-ocean/20 pb-6">
          <div>
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt="" className="h-12" />
            ) : (
              <p className="font-display text-3xl text-ocean-deep">
                {settings?.brandName || "Andaman Ecstasy Pvt Ltd"}
              </p>
            )}
            <p className="mt-1 text-sm text-ink/60">{settings?.tagline}</p>
          </div>
          <PrintButton />
        </div>

        <h1 className="font-display mt-8 text-3xl text-ocean-deep">Travel itinerary</h1>
        <p className="mt-2 text-sm">
          Prepared for <strong>{it.guestName}</strong> · {it.email}
          {it.phone ? ` · ${it.phone}` : ""}
        </p>
        <p className="text-sm text-ink/60">
          {it.travelStart || "TBD"} → {it.travelEnd || "TBD"} · {it.guests} guests
        </p>

        <ol className="mt-8 space-y-4">
          {days.map((d) => (
            <li key={d.day} className="rounded-xl border border-ocean/15 p-4">
              <p className="font-semibold text-ocean">
                Day {d.day}: {d.title}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink/75">{d.body}</p>
            </li>
          ))}
        </ol>

        {(lines.length > 0 || it.quoteTotal != null) && (
          <div className="mt-10">
            <h2 className="font-display text-2xl text-ocean-deep">Quotation</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-b border-ocean/10">
                    <td className="py-2">{l.item}</td>
                    <td className="py-2 text-right">{formatINR(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
              {it.quoteTotal != null && (
                <tfoot>
                  <tr>
                    <td className="py-3 font-bold">Total</td>
                    <td className="py-3 text-right font-bold">{formatINR(it.quoteTotal)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
            {it.validUntil && (
              <p className="mt-2 text-xs text-ink/50">Quote valid until {it.validUntil}</p>
            )}
          </div>
        )}

        <p className="mt-10 text-xs text-ink/50">
          {settings?.companyAddress}
          {settings?.gstin ? ` · GSTIN ${settings.gstin}` : ""}
          <br />
          Contact: {settings?.callNumber} · WhatsApp available on website
        </p>
      </div>
    </div>
  );
}
