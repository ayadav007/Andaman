import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { sortOrder: "asc" },
    include: { rooms: true },
  });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ocean-deep">Hotels</h1>
        <Link href="/admin/hotels/new" className="btn btn-primary !py-2 text-sm">
          + New hotel
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {hotels.map((h) => (
          <div key={h.id} className="admin-card flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-semibold">{h.nameEn}</p>
              <p className="text-sm text-ink/60">
                {h.islandLabel} · {h.rooms.length} rooms
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/hotels/${h.id}`} className="font-semibold text-ocean">
                Edit
              </Link>
              <Link href={`/hotels/${h.slug}`} className="text-ink/50" target="_blank">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
