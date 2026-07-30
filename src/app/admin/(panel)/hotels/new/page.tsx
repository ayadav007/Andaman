import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createHotel(formData: FormData) {
  "use server";
  const nameEn = String(formData.get("nameEn") || "");
  const image = String(formData.get("image") || "");
  const hotel = await prisma.hotel.create({
    data: {
      nameEn,
      slug: slugify(String(formData.get("slug") || nameEn)),
      descriptionEn: String(formData.get("descriptionEn") || ""),
      islandLabel: String(formData.get("islandLabel") || "") || null,
      amenities: JSON.stringify(
        String(formData.get("amenities") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
      images: JSON.stringify(image ? [image] : []),
      published: formData.get("published") === "on",
    },
  });
  redirect(`/admin/hotels/${hotel.id}`);
}

export default function NewHotelPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ocean-deep">New hotel</h1>
      <form action={createHotel} className="admin-card mt-6 space-y-3">
        <div>
          <label className="label">Name</label>
          <input className="input" name="nameEn" required />
        </div>
        <div>
          <label className="label">Slug (optional)</label>
          <input className="input" name="slug" />
        </div>
        <div>
          <label className="label">Island label</label>
          <input className="input" name="islandLabel" placeholder="Havelock" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="textarea" name="descriptionEn" required />
        </div>
        <div>
          <label className="label">Amenities (comma separated)</label>
          <input className="input" name="amenities" placeholder="Breakfast, Wi-Fi, Pool" />
        </div>
        <ImageUpload name="image" label="Hotel image" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <button type="submit" className="btn btn-primary">Create hotel</button>
      </form>
    </div>
  );
}
