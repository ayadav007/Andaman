import { BookingForm } from "@/components/site/BookingForm";
import { prisma } from "@/lib/prisma";
import { formatINR, parseJsonArray } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Day = { day: number; title: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  if (!pkg) return {};
  return {
    title: pkg.metaTitle || pkg.titleEn,
    description: pkg.metaDescription || pkg.summaryEn,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      stays: {
        orderBy: { sortOrder: "asc" },
        include: { hotel: true, room: true },
      },
    },
  });
  if (!pkg || !pkg.published) notFound();

  const covers = parseJsonArray(pkg.coverImages);
  let days: Day[] = [];
  try {
    days = JSON.parse(pkg.itineraryJson) as Day[];
  } catch {
    days = [];
  }
  const inclusions = pkg.inclusionsEn.split("\n").filter(Boolean);
  const exclusions = pkg.exclusionsEn.split("\n").filter(Boolean);

  return (
    <div className="section">
      <div className="section-inner grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold text-ocean">
            {pkg.durationNights}N / {pkg.durationDays}D · From {formatINR(pkg.priceFrom)}
          </p>
          <h1 className="font-display mt-2 text-4xl text-ocean-deep md:text-5xl">{pkg.titleEn}</h1>
          <p className="mt-3 text-ink/70">{pkg.summaryEn}</p>

          {covers[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={covers[0]} alt="" className="mt-6 h-64 w-full rounded-2xl object-cover md:h-80" />
          )}
          {covers.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {covers.slice(1).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="h-24 w-36 rounded-xl object-cover" />
              ))}
            </div>
          )}

          <p className="mt-6 leading-relaxed text-ink/80">{pkg.descriptionEn}</p>

          {days.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-3xl text-ocean-deep">Itinerary</h2>
              <ol className="mt-4 space-y-3">
                {days.map((d) => (
                  <li key={d.day} className="rounded-xl bg-white p-4 ring-1 ring-ocean/10">
                    <p className="font-semibold text-ocean">Day {d.day}: {d.title}</p>
                    <p className="mt-1 text-sm text-ink/70">{d.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl text-ocean-deep">Inclusions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75">
                {inclusions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-2xl text-ocean-deep">Exclusions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75">
                {exclusions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          {pkg.stays.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-3xl text-ocean-deep">Included stays</h2>
              <div className="mt-4 space-y-4">
                {pkg.stays.map((stay) => {
                  const hotelImages = parseJsonArray(stay.hotel.images);
                  const roomImages = parseJsonArray(stay.room?.images);
                  return (
                    <div key={stay.id} className="grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-ocean/10 sm:grid-cols-[180px_1fr]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hotelImages[0] || roomImages[0] || ""}
                        alt=""
                        className="h-40 w-full rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-display text-xl text-ocean-deep">{stay.hotel.nameEn}</p>
                        <p className="text-sm text-ocean">
                          Nights {stay.nightsFrom}
                          {stay.nightsTo !== stay.nightsFrom ? `–${stay.nightsTo}` : ""}
                          {stay.hotel.islandLabel ? ` · ${stay.hotel.islandLabel}` : ""}
                        </p>
                        {stay.room && (
                          <p className="mt-2 text-sm font-semibold">Room: {stay.room.nameEn}</p>
                        )}
                        <p className="mt-1 line-clamp-3 text-sm text-ink/65">{stay.hotel.descriptionEn}</p>
                        {roomImages[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={roomImages[0]} alt="" className="mt-3 h-24 w-36 rounded-lg object-cover" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm packageId={pkg.id} />
        </div>
      </div>
    </div>
  );
}
