import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <div className="section">
      <div className="section-inner">
        <h1 className="section-title">Travel guide</h1>
        <p className="section-sub">Tips, seasons, and island stories.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ocean/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.coverUrl && <img src={p.coverUrl} alt="" className="h-44 w-full object-cover" />}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase text-ocean">{p.category}</p>
                <h2 className="font-display mt-1 text-2xl text-ocean-deep">{p.titleEn}</h2>
                <p className="mt-2 text-sm text-ink/65">{p.excerptEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
