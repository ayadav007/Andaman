import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminItinerariesPage() {
  const items = await prisma.itinerary.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ocean-deep">Itineraries & quotes</h1>
        <Link href="/admin/itineraries/new" className="btn btn-primary !py-2 text-sm">
          + New itinerary
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((it) => {
          const share = `/itinerary/${it.shareToken}`;
          return (
            <div key={it.id} className="admin-card">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-semibold">{it.guestName}</p>
                  <p className="text-sm text-ink/60">
                    {it.email} {it.phone ? `· ${it.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ocean">
                    {it.status} · {it.travelStart || "?"} → {it.travelEnd || "?"}
                    {it.quoteTotal != null ? ` · Quote ₹${it.quoteTotal}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 text-sm">
                  <Link href={share} className="text-ocean" target="_blank">
                    View / print PDF →
                  </Link>
                  {it.phone && (
                    <a
                      href={waLink(
                        it.phone.startsWith("91") || it.phone.startsWith("+")
                          ? it.phone
                          : `91${it.phone.replace(/\D/g, "")}`,
                        `Hi ${it.guestName}, your Andaman itinerary: please open ${share} (ask us if you need the PDF emailed).`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#128C7E]"
                    >
                      Share on WhatsApp
                    </a>
                  )}
                  <a href={`mailto:${it.email}?subject=Your Andaman itinerary&body=View your itinerary: ${share}`} className="text-ink/60">
                    Email link
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-ink/50">No itineraries yet.</p>}
      </div>
    </div>
  );
}
