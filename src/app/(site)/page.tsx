import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function locale(): Promise<Locale> {
  const jar = await cookies();
  const v = jar.get("ae_lang")?.value;
  return v === "hi" ? "hi" : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: s?.metaTitle || s?.brandName || "Andaman Ecstasy",
    description: s?.metaDescription || s?.tagline || undefined,
  };
}

export default async function HomePage() {
  const lang = await locale();
  const [settings, sections, stats, destinations, packages, testimonials, faqs, posts] =
    await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.homeSection.findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
        include: { items: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.statItem.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.destination.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.package.findMany({
        where: { published: true, featured: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.faqItem.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  if (!settings) {
    return (
      <div className="section">
        <div className="section-inner">
          <p>Database not seeded. Run: npm run db:setup</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero
        brandName={settings.brandName}
        tagline={settings.tagline}
        headline={settings.heroHeadline}
        support={settings.heroSupport}
        imageUrl={settings.heroImageUrl}
        primaryLabel={settings.ctaPrimaryLabel}
        primaryUrl={settings.ctaPrimaryUrl}
        secondaryLabel={settings.ctaSecondaryLabel}
        secondaryUrl={settings.ctaSecondaryUrl}
      />
      <HomeSections
        sections={sections}
        stats={stats}
        destinations={destinations}
        packages={packages}
        testimonials={testimonials}
        faqs={faqs}
        posts={posts}
        tripadvisorEmbed={settings.tripadvisorEmbed}
        locale={lang}
      />
    </>
  );
}
