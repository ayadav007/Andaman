import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const hotels = await prisma.hotel.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { rooms: true },
  });
  return (
    <div className="section">
      <div className="section-inner">
        <h1 className="section-title">Hotels</h1>
        <p className="section-sub">Curated stays across the islands.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {hotels.map((h) => {
            const img = parseJsonArray(h.images)[0];
            return (
              <Link key={h.id} href={`/hotels/${h.slug}`} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ocean/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img && <img src={img} alt="" className="h-48 w-full object-cover" />}
                <div className="p-5">
                  <h2 className="font-display text-2xl text-ocean-deep">{h.nameEn}</h2>
                  <p className="text-sm text-ocean">{h.islandLabel}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/65">{h.descriptionEn}</p>
                  <p className="mt-2 text-xs text-ink/50">{h.rooms.length} room types</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
