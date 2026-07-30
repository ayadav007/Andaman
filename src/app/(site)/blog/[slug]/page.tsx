import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();
  return (
    <article className="section">
      <div className="section-inner max-w-3xl">
        <p className="text-xs font-semibold uppercase text-ocean">{post.category}</p>
        <h1 className="font-display mt-2 text-4xl text-ocean-deep md:text-5xl">{post.titleEn}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {post.coverUrl && <img src={post.coverUrl} alt="" className="mt-6 h-64 w-full rounded-2xl object-cover" />}
        <div className="prose mt-8 whitespace-pre-wrap leading-relaxed text-ink/80">{post.bodyEn}</div>
      </div>
    </article>
  );
}
