import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function moveSection(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const dir = String(formData.get("dir"));
  const sections = await prisma.homeSection.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = sections.findIndex((s) => s.id === id);
  if (idx < 0) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= sections.length) return;
  const a = sections[idx];
  const b = sections[swapWith];
  await prisma.$transaction([
    prisma.homeSection.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.homeSection.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

async function toggleSection(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const visible = formData.get("visible") === "true";
  await prisma.homeSection.update({ where: { id }, data: { visible: !visible } });
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

async function addSection(formData: FormData) {
  "use server";
  const type = String(formData.get("type"));
  const count = await prisma.homeSection.count();
  await prisma.homeSection.create({
    data: {
      type,
      titleEn: type.replace(/_/g, " "),
      sortOrder: count,
      visible: true,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export default async function AdminSectionsPage() {
  const sections = await prisma.homeSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean-deep">Home sections</h1>
      <p className="mt-1 text-sm text-ink/60">Reorder, hide/show, or add section types.</p>

      <form action={addSection} className="admin-card mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="label">Add section type</label>
          <select name="type" className="select">
            <option value="carousel">carousel</option>
            <option value="stats">stats</option>
            <option value="coverflow">coverflow</option>
            <option value="card_carousel">card_carousel</option>
            <option value="places_row">places_row</option>
            <option value="destinations">destinations</option>
            <option value="packages">packages</option>
            <option value="youtube">youtube</option>
            <option value="testimonials">testimonials</option>
            <option value="faq">faq</option>
            <option value="tripadvisor">tripadvisor</option>
            <option value="blog_teaser">blog_teaser</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary !py-2">Add</button>
      </form>

      <div className="mt-6 space-y-3">
        {sections.map((s) => (
          <div key={s.id} className="admin-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                {s.type} {s.visible ? "" : "(hidden)"}
              </p>
              <p className="text-sm text-ink/60">
                {s.titleEn || "Untitled"} · {s.items.length} items
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={moveSection}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="dir" value="up" />
                <button className="btn btn-ghost !py-1 !px-3 text-xs" type="submit">↑</button>
              </form>
              <form action={moveSection}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="dir" value="down" />
                <button className="btn btn-ghost !py-1 !px-3 text-xs" type="submit">↓</button>
              </form>
              <form action={toggleSection}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="visible" value={String(s.visible)} />
                <button className="btn btn-ghost !py-1 !px-3 text-xs" type="submit">
                  {s.visible ? "Hide" : "Show"}
                </button>
              </form>
              <Link href={`/admin/sections/${s.id}`} className="btn btn-primary !py-1 !px-3 text-xs">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
