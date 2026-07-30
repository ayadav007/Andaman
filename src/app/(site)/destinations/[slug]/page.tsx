import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await prisma.destination.findUnique({
    where: { slug },
    include: { hotels: { where: { published: true } } },
  });
  if (!d) notFound();

  return (
    <div className="section">
      <div className="section-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {d.imageUrl && <img src={d.imageUrl} alt="" className="mb-6 h-64 w-full rounded-2xl object-cover md:h-80" />}
        <h1 className="font-display text-4xl text-ocean-deep md:text-5xl">{d.nameEn}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink/75">{d.descriptionEn}</p>
        {d.mapEmbedUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-ocean/10">
            <iframe src={d.mapEmbedUrl} title="Map" className="h-72 w-full border-0" loading="lazy" />
          </div>
        )}
        {d.hotels.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-3xl text-ocean-deep">Hotels here</h2>
            <ul className="mt-4 space-y-2">
              {d.hotels.map((h) => (
                <li key={h.id}>
                  <a href={`/hotels/${h.slug}`} className="text-ocean hover:underline">
                    {h.nameEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
