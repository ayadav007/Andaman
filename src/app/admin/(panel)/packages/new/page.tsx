import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createPackage(formData: FormData) {
  "use server";
  const titleEn = String(formData.get("titleEn") || "");
  const slug = slugify(String(formData.get("slug") || titleEn));
  const cover = String(formData.get("coverImage") || "");
  const pkg = await prisma.package.create({
    data: {
      titleEn,
      slug,
      summaryEn: String(formData.get("summaryEn") || ""),
      descriptionEn: String(formData.get("descriptionEn") || ""),
      durationNights: Number(formData.get("durationNights") || 4),
      durationDays: Number(formData.get("durationDays") || 5),
      priceFrom: Number(formData.get("priceFrom") || 0),
      coverImages: JSON.stringify(cover ? [cover] : []),
      inclusionsEn: String(formData.get("inclusionsEn") || ""),
      exclusionsEn: String(formData.get("exclusionsEn") || ""),
      itineraryJson: String(formData.get("itineraryJson") || "[]"),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    },
  });
  redirect(`/admin/packages/${pkg.id}`);
}

export default function NewPackagePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ocean-deep">New package</h1>
      <form action={createPackage} className="admin-card mt-6 space-y-3">
        <Field name="titleEn" label="Title" required />
        <Field name="slug" label="Slug (optional)" />
        <Field name="summaryEn" label="Short summary" required />
        <div>
          <label className="label">Description</label>
          <textarea className="textarea" name="descriptionEn" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="durationNights" label="Nights" defaultValue="4" />
          <Field name="durationDays" label="Days" defaultValue="5" />
          <Field name="priceFrom" label="Price from (₹)" defaultValue="24999" />
        </div>
        <ImageUpload name="coverImage" label="Cover image" />
        <div>
          <label className="label">Inclusions (one per line)</label>
          <textarea className="textarea" name="inclusionsEn" />
        </div>
        <div>
          <label className="label">Exclusions (one per line)</label>
          <textarea className="textarea" name="exclusionsEn" />
        </div>
        <div>
          <label className="label">Itinerary JSON (optional advanced)</label>
          <textarea
            className="textarea font-mono text-xs"
            name="itineraryJson"
            defaultValue={`[\n  {"day":1,"title":"Arrive","body":"Airport pickup"}\n]`}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked /> Featured on home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <button type="submit" className="btn btn-primary">Create package</button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" name={name} defaultValue={defaultValue} required={required} />
    </div>
  );
}
