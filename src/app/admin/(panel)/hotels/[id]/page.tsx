import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function saveHotel(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const image = String(formData.get("image") || "");
  const existing = await prisma.hotel.findUnique({ where: { id } });
  const images = image
    ? [image, ...parseJsonArray(existing?.images).filter((u) => u !== image)]
    : parseJsonArray(existing?.images);

  await prisma.hotel.update({
    where: { id },
    data: {
      nameEn: String(formData.get("nameEn") || ""),
      descriptionEn: String(formData.get("descriptionEn") || ""),
      islandLabel: String(formData.get("islandLabel") || "") || null,
      amenities: JSON.stringify(
        String(formData.get("amenities") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
      images: JSON.stringify(images),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/hotels");
  redirect(`/admin/hotels/${id}`);
}

async function addRoom(formData: FormData) {
  "use server";
  const hotelId = String(formData.get("hotelId"));
  const image = String(formData.get("roomImage") || "");
  await prisma.room.create({
    data: {
      hotelId,
      nameEn: String(formData.get("nameEn") || ""),
      bed: String(formData.get("bed") || "") || null,
      occupancy: Number(formData.get("occupancy") || 2),
      priceHint: Number(formData.get("priceHint") || 0) || null,
      descriptionEn: String(formData.get("descriptionEn") || "") || null,
      images: JSON.stringify(image ? [image] : []),
    },
  });
  revalidatePath(`/admin/hotels/${hotelId}`);
}

async function deleteRoom(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const hotelId = String(formData.get("hotelId"));
  await prisma.room.delete({ where: { id } });
  revalidatePath(`/admin/hotels/${hotelId}`);
}

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { rooms: { orderBy: { sortOrder: "asc" } } },
  });
  if (!hotel) notFound();
  const image = parseJsonArray(hotel.images)[0] || "";
  const amenities = parseJsonArray(hotel.amenities).join(", ");

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-display text-3xl text-ocean-deep">Edit hotel</h1>
      <form action={saveHotel} className="admin-card space-y-3">
        <input type="hidden" name="id" value={hotel.id} />
        <div>
          <label className="label">Name</label>
          <input className="input" name="nameEn" defaultValue={hotel.nameEn} required />
        </div>
        <div>
          <label className="label">Island label</label>
          <input className="input" name="islandLabel" defaultValue={hotel.islandLabel || ""} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="textarea" name="descriptionEn" defaultValue={hotel.descriptionEn} />
        </div>
        <div>
          <label className="label">Amenities (comma separated)</label>
          <input className="input" name="amenities" defaultValue={amenities} />
        </div>
        <ImageUpload name="image" label="Hotel image" defaultValue={image} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={hotel.published} /> Published
        </label>
        <button type="submit" className="btn btn-primary">Save hotel</button>
      </form>

      <section className="admin-card">
        <h2 className="font-display text-2xl text-ocean-deep">Room types</h2>
        <ul className="mt-4 space-y-2">
          {hotel.rooms.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand/60 px-3 py-2 text-sm">
              <span>
                <strong>{r.nameEn}</strong>
                {r.bed ? ` · ${r.bed}` : ""} · sleeps {r.occupancy}
                {r.priceHint ? ` · from ₹${r.priceHint}` : ""}
              </span>
              <form action={deleteRoom}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="hotelId" value={hotel.id} />
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addRoom} className="mt-6 grid gap-3 border-t border-ocean/10 pt-4 sm:grid-cols-2">
          <input type="hidden" name="hotelId" value={hotel.id} />
          <div className="sm:col-span-2">
            <label className="label">Room name</label>
            <input className="input" name="nameEn" required />
          </div>
          <div>
            <label className="label">Bed</label>
            <input className="input" name="bed" placeholder="King" />
          </div>
          <div>
            <label className="label">Occupancy</label>
            <input className="input" name="occupancy" type="number" defaultValue={2} />
          </div>
          <div>
            <label className="label">Price hint (₹)</label>
            <input className="input" name="priceHint" type="number" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="textarea" name="descriptionEn" />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload name="roomImage" label="Room image" />
          </div>
          <button type="submit" className="btn btn-primary sm:col-span-2">Add room</button>
        </form>
      </section>
    </div>
  );
}
