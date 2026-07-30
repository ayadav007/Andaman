import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const SLUGS = ["about", "privacy", "terms", "cancellation", "travel-tips"] as const;

export default async function LegalPage({
  params,
}: {
  params: Promise<{ legal: string }>;
}) {
  const { legal } = await params;
  if (!SLUGS.includes(legal as (typeof SLUGS)[number])) notFound();
  const page = await prisma.legalPage.findUnique({ where: { slug: legal } });
  if (!page) notFound();
  return (
    <div className="section">
      <div className="section-inner max-w-3xl">
        <h1 className="section-title">{page.titleEn}</h1>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-ink/80">{page.bodyEn}</div>
      </div>
    </div>
  );
}
