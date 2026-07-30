import { BookingForm } from "@/components/site/BookingForm";
import { prisma } from "@/lib/prisma";
import { formatINR, parseJsonArray } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: { rooms: { orderBy: { sortOrder: "asc" } } },
  });
  if (!hotel || !hotel.published) notFound();
  const images = parseJsonArray(hotel.images);
  const amenities = parseJsonArray(hotel.amenities);

  return (
    <div className="section">
      <div className="section-inner grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-display text-4xl text-ocean-deep md:text-5xl">{hotel.nameEn}</h1>
          <p className="mt-1 text-ocean">{hotel.islandLabel}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {images[0] && <img src={images[0]} alt="" className="mt-6 h-64 w-full rounded-2xl object-cover" />}
          <p className="mt-6 leading-relaxed text-ink/75">{hotel.descriptionEn}</p>
          {amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((a) => (
                <span key={a} className="rounded-full bg-seafoam/60 px-3 py-1 text-xs font-semibold text-ocean-deep">
                  {a}
                </span>
              ))}
            </div>
          )}
          <h2 className="font-display mt-10 text-3xl text-ocean-deep">Rooms</h2>
          <div className="mt-4 space-y-4">
            {hotel.rooms.map((room) => {
              const rimg = parseJsonArray(room.images)[0];
              return (
                <div key={room.id} className="grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-ocean/10 sm:grid-cols-[140px_1fr]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {rimg && <img src={rimg} alt="" className="h-32 w-full rounded-xl object-cover" />}
                  <div>
                    <p className="font-semibold text-ocean-deep">{room.nameEn}</p>
                    <p className="text-sm text-ink/60">
                      {room.bed} · Sleeps {room.occupancy}
                      {room.priceHint ? ` · from ${formatINR(room.priceHint)}` : ""}
                    </p>
                    {room.descriptionEn && <p className="mt-1 text-sm text-ink/70">{room.descriptionEn}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <BookingForm hotelId={hotel.id} />
      </div>
    </div>
  );
}
