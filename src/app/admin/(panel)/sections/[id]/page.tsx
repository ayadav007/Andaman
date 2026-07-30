import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function saveSection(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await prisma.homeSection.update({
    where: { id },
    data: {
      titleEn: String(formData.get("titleEn") || "") || null,
      subtitleEn: String(formData.get("subtitleEn") || "") || null,
      theme: String(formData.get("theme") || "light"),
      visible: formData.get("visible") === "on",
    },
  });
  revalidatePath("/");
  redirect(`/admin/sections/${id}`);
}

async function addItem(formData: FormData) {
  "use server";
  const sectionId = String(formData.get("sectionId"));
  const count = await prisma.sectionItem.count({ where: { sectionId } });
  await prisma.sectionItem.create({
    data: {
      sectionId,
      titleEn: String(formData.get("titleEn") || "") || null,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      linkUrl: String(formData.get("linkUrl") || "") || null,
      priceLabel: String(formData.get("priceLabel") || "") || null,
      videoUrl: String(formData.get("videoUrl") || "") || null,
      sortOrder: count,
    },
  });
  revalidatePath("/");
  revalidatePath(`/admin/sections/${sectionId}`);
}

async function deleteItem(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const sectionId = String(formData.get("sectionId"));
  await prisma.sectionItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/admin/sections/${sectionId}`);
}

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const section = await prisma.homeSection.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!section) notFound();

  const needsItems = ["carousel", "coverflow", "card_carousel", "places_row", "youtube"].includes(
    section.type,
  );

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-3xl text-ocean-deep">Edit section · {section.type}</h1>
      <form action={saveSection} className="admin-card space-y-3">
        <input type="hidden" name="id" value={section.id} />
        <div>
          <label className="label">Title</label>
          <input className="input" name="titleEn" defaultValue={section.titleEn || ""} />
        </div>
        <div>
          <label className="label">Subtitle</label>
          <input className="input" name="subtitleEn" defaultValue={section.subtitleEn || ""} />
        </div>
        <div>
          <label className="label">Theme</label>
          <select name="theme" className="select" defaultValue={section.theme}>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visible" defaultChecked={section.visible} /> Visible
        </label>
        <button type="submit" className="btn btn-primary">Save section</button>
      </form>

      {needsItems && (
        <section className="admin-card">
          <h2 className="font-display text-2xl text-ocean-deep">Items</h2>
          <ul className="mt-4 space-y-2">
            {section.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-sand/50 px-3 py-2 text-sm">
                <span className="truncate">
                  {item.titleEn || item.videoUrl || "Image item"}
                </span>
                <form action={deleteItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <button type="submit" className="text-red-600">Delete</button>
                </form>
              </li>
            ))}
          </ul>
          <form action={addItem} className="mt-6 space-y-3 border-t border-ocean/10 pt-4">
            <input type="hidden" name="sectionId" value={section.id} />
            <div>
              <label className="label">Title</label>
              <input className="input" name="titleEn" />
            </div>
            <ImageUpload name="imageUrl" label="Image" />
            <div>
              <label className="label">Link URL</label>
              <input className="input" name="linkUrl" placeholder="/destinations/havelock" />
            </div>
            <div>
              <label className="label">Price label (coverflow)</label>
              <input className="input" name="priceLabel" placeholder="Starting at ₹3500" />
            </div>
            <div>
              <label className="label">YouTube URL</label>
              <input className="input" name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <button type="submit" className="btn btn-primary">Add item</button>
          </form>
        </section>
      )}

      {!needsItems && (
        <p className="text-sm text-ink/60">
          This section type pulls content automatically (destinations, packages, FAQ, testimonials, stats, blog, tripadvisor).
        </p>
      )}
    </div>
  );
}
