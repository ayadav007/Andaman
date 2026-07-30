import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addFaq(formData: FormData) {
  "use server";
  const count = await prisma.faqItem.count();
  await prisma.faqItem.create({
    data: {
      questionEn: String(formData.get("questionEn") || ""),
      answerEn: String(formData.get("answerEn") || ""),
      sortOrder: count,
      published: true,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function deleteFaq(formData: FormData) {
  "use server";
  await prisma.faqItem.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function addTestimonial(formData: FormData) {
  "use server";
  const count = await prisma.testimonial.count();
  await prisma.testimonial.create({
    data: {
      name: String(formData.get("name") || ""),
      location: String(formData.get("location") || "") || null,
      quoteEn: String(formData.get("quoteEn") || ""),
      rating: Number(formData.get("rating") || 5),
      photoUrl: String(formData.get("photoUrl") || "") || null,
      sortOrder: count,
      published: true,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function deleteTestimonial(formData: FormData) {
  "use server";
  await prisma.testimonial.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function addBlog(formData: FormData) {
  "use server";
  const titleEn = String(formData.get("titleEn") || "");
  await prisma.blogPost.create({
    data: {
      titleEn,
      slug: slugify(String(formData.get("slug") || titleEn)),
      excerptEn: String(formData.get("excerptEn") || ""),
      bodyEn: String(formData.get("bodyEn") || ""),
      coverUrl: String(formData.get("coverUrl") || "") || null,
      category: String(formData.get("category") || "") || null,
      published: formData.get("published") === "on",
      publishedAt: new Date(),
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/content");
}

async function deleteBlog(formData: FormData) {
  "use server";
  await prisma.blogPost.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/blog");
  revalidatePath("/admin/content");
}

async function addStat(formData: FormData) {
  "use server";
  const count = await prisma.statItem.count();
  await prisma.statItem.create({
    data: {
      value: Number(formData.get("value") || 0),
      suffix: String(formData.get("suffix") || ""),
      labelEn: String(formData.get("labelEn") || ""),
      sortOrder: count,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function deleteStat(formData: FormData) {
  "use server";
  await prisma.statItem.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export default async function AdminContentPage() {
  const [faqs, testimonials, posts, stats] = await Promise.all([
    prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.statItem.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl text-ocean-deep">FAQ / Reviews / Blog / Stats</h1>

      <section className="admin-card">
        <h2 className="font-display text-2xl">Stats</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {stats.map((s) => (
            <li key={s.id} className="flex justify-between gap-2">
              <span>
                {s.value}
                {s.suffix} {s.labelEn}
              </span>
              <form action={deleteStat}>
                <input type="hidden" name="id" value={s.id} />
                <button className="text-red-600" type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addStat} className="mt-4 grid gap-2 sm:grid-cols-3">
          <input className="input" name="value" type="number" placeholder="2500" required />
          <input className="input" name="suffix" placeholder="+" />
          <input className="input" name="labelEn" placeholder="Happy clients" required />
          <button className="btn btn-primary sm:col-span-3" type="submit">Add stat</button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="font-display text-2xl">FAQ</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {faqs.map((f) => (
            <li key={f.id} className="flex justify-between gap-2">
              <span>{f.questionEn}</span>
              <form action={deleteFaq}>
                <input type="hidden" name="id" value={f.id} />
                <button className="text-red-600" type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addFaq} className="mt-4 space-y-2">
          <input className="input" name="questionEn" placeholder="Question" required />
          <textarea className="textarea" name="answerEn" placeholder="Answer" required />
          <button className="btn btn-primary" type="submit">Add FAQ</button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="font-display text-2xl">Testimonials</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {testimonials.map((t) => (
            <li key={t.id} className="flex justify-between gap-2">
              <span>
                {t.name}: “{t.quoteEn.slice(0, 60)}…”
              </span>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <button className="text-red-600" type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addTestimonial} className="mt-4 space-y-2">
          <input className="input" name="name" placeholder="Name" required />
          <input className="input" name="location" placeholder="Location" />
          <textarea className="textarea" name="quoteEn" placeholder="Quote" required />
          <input className="input" name="rating" type="number" min={1} max={5} defaultValue={5} />
          <ImageUpload name="photoUrl" label="Photo (optional)" />
          <button className="btn btn-primary" type="submit">Add testimonial</button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="font-display text-2xl">Blog / Travel guide</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {posts.map((p) => (
            <li key={p.id} className="flex justify-between gap-2">
              <span>
                {p.titleEn} {p.published ? "" : "(draft)"}
              </span>
              <form action={deleteBlog}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-red-600" type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addBlog} className="mt-4 space-y-2">
          <input className="input" name="titleEn" placeholder="Title" required />
          <input className="input" name="slug" placeholder="Slug (optional)" />
          <input className="input" name="category" placeholder="Category" />
          <input className="input" name="excerptEn" placeholder="Excerpt" required />
          <textarea className="textarea" name="bodyEn" placeholder="Body" required />
          <ImageUpload name="coverUrl" label="Cover image" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button className="btn btn-primary" type="submit">Add post</button>
        </form>
      </section>
    </div>
  );
}
