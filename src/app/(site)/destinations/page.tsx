import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className="section">
      <div className="section-inner">
        <h1 className="section-title">Destinations</h1>
        <p className="section-sub">Islands and shores across Andaman & Nicobar.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link key={d.id} href={`/destinations/${d.slug}`} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ocean/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.imageUrl || ""} alt="" className="h-48 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-display text-xl text-ocean-deep">{d.nameEn}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink/65">{d.descriptionEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
