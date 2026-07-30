import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, parseJsonArray } from "@/lib/utils";
import { cookies } from "next/headers";
import { pickLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const locale = (await cookies()).get("ae_lang")?.value === "hi" ? "hi" : "en";
  const packages = await prisma.package.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="section">
      <div className="section-inner">
        <h1 className="section-title">{locale === "hi" ? "टूर पैकेज" : "Tour packages"}</h1>
        <p className="section-sub">
          {locale === "hi"
            ? "होटल सहित तैयार अंडमान सर्किट।"
            : "Handcrafted Andaman circuits with hotels included."}
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {packages.map((p) => {
            const cover = parseJsonArray(p.coverImages)[0];
            return (
              <Link key={p.id} href={`/packages/${p.slug}`} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ocean/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cover && <img src={cover} alt="" className="h-48 w-full object-cover" />}
                <div className="p-5">
                  <h2 className="font-display text-2xl text-ocean-deep">
                    {pickLocale(locale, p.titleEn, p.titleHi)}
                  </h2>
                  <p className="mt-1 text-sm text-ink/65">
                    {pickLocale(locale, p.summaryEn, p.summaryHi)}
                  </p>
                  <p className="mt-3 font-semibold text-ocean">
                    {p.durationNights}N/{p.durationDays}D · From {formatINR(p.priceFrom)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
