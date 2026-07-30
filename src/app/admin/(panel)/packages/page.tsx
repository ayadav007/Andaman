import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ocean-deep">Packages</h1>
        <Link href="/admin/packages/new" className="btn btn-primary !py-2 text-sm">
          + New package
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {packages.map((p) => (
          <div key={p.id} className="admin-card flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-semibold">{p.titleEn}</p>
              <p className="text-sm text-ink/60">
                {p.durationNights}N/{p.durationDays}D · {formatINR(p.priceFrom)} ·{" "}
                {p.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/packages/${p.id}`} className="text-ocean font-semibold">
                Edit
              </Link>
              <Link href={`/packages/${p.slug}`} className="text-ink/50" target="_blank">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
