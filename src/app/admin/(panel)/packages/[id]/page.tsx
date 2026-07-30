import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function savePackage(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const cover = String(formData.get("coverImage") || "");
  const existing = await prisma.package.findUnique({ where: { id } });
  const covers = cover
    ? [cover, ...parseJsonArray(existing?.coverImages).filter((u) => u !== cover)]
    : parseJsonArray(existing?.coverImages);

  await prisma.package.update({
    where: { id },
    data: {
      titleEn: String(formData.get("titleEn") || ""),
      summaryEn: String(formData.get("summaryEn") || ""),
      descriptionEn: String(formData.get("descriptionEn") || ""),
      durationNights: Number(formData.get("durationNights") || 4),
      durationDays: Number(formData.get("durationDays") || 5),
      priceFrom: Number(formData.get("priceFrom") || 0),
      coverImages: JSON.stringify(covers),
      inclusionsEn: String(formData.get("inclusionsEn") || ""),
      exclusionsEn: String(formData.get("exclusionsEn") || ""),
      itineraryJson: String(formData.get("itineraryJson") || "[]"),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/packages");
  revalidatePath(`/admin/packages/${id}`);
  redirect(`/admin/packages/${id}`);
}

async function addStay(formData: FormData) {
  "use server";
  const packageId = String(formData.get("packageId"));
  await prisma.packageStay.create({
    data: {
      packageId,
      hotelId: String(formData.get("hotelId")),
      roomId: String(formData.get("roomId") || "") || null,
      nightsFrom: Number(formData.get("nightsFrom") || 1),
      nightsTo: Number(formData.get("nightsTo") || 1),
    },
  });
  revalidatePath(`/admin/packages/${packageId}`);
}

async function deleteStay(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const packageId = String(formData.get("packageId"));
  await prisma.packageStay.delete({ where: { id } });
  revalidatePath(`/admin/packages/${packageId}`);
}

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pkg, hotels] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: {
        stays: {
          orderBy: { sortOrder: "asc" },
          include: { hotel: true, room: true },
        },
      },
    }),
    prisma.hotel.findMany({
      include: { rooms: true },
      orderBy: { nameEn: "asc" },
    }),
  ]);
  if (!pkg) notFound();
  const cover = parseJsonArray(pkg.coverImages)[0] || "";

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-display text-3xl text-ocean-deep">Edit package</h1>

      <form action={savePackage} className="admin-card space-y-3">
        <input type="hidden" name="id" value={pkg.id} />
        <Field name="titleEn" label="Title" defaultValue={pkg.titleEn} />
        <Field name="summaryEn" label="Summary" defaultValue={pkg.summaryEn} />
        <div>
          <label className="label">Description</label>
          <textarea className="textarea" name="descriptionEn" defaultValue={pkg.descriptionEn} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field name="durationNights" label="Nights" defaultValue={String(pkg.durationNights)} />
          <Field name="durationDays" label="Days" defaultValue={String(pkg.durationDays)} />
          <Field name="priceFrom" label="Price from (₹)" defaultValue={String(pkg.priceFrom)} />
        </div>
        <ImageUpload name="coverImage" label="Cover image" defaultValue={cover} />
        <div>
          <label className="label">Inclusions</label>
          <textarea className="textarea" name="inclusionsEn" defaultValue={pkg.inclusionsEn} />
        </div>
        <div>
          <label className="label">Exclusions</label>
          <textarea className="textarea" name="exclusionsEn" defaultValue={pkg.exclusionsEn} />
        </div>
        <div>
          <label className="label">Itinerary JSON</label>
          <textarea className="textarea font-mono text-xs" name="itineraryJson" defaultValue={pkg.itineraryJson} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={pkg.featured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={pkg.published} /> Published
        </label>
        <button type="submit" className="btn btn-primary">Save package</button>
      </form>

      <section className="admin-card">
        <h2 className="font-display text-2xl text-ocean-deep">Included hotel stays</h2>
        <ul className="mt-4 space-y-2">
          {pkg.stays.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand/60 px-3 py-2 text-sm">
              <span>
                Nights {s.nightsFrom}–{s.nightsTo}: <strong>{s.hotel.nameEn}</strong>
                {s.room ? ` · ${s.room.nameEn}` : ""}
              </span>
              <form action={deleteStay}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="packageId" value={pkg.id} />
                <button type="submit" className="text-red-600">Remove</button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addStay} className="mt-6 grid gap-3 border-t border-ocean/10 pt-4 sm:grid-cols-2">
          <input type="hidden" name="packageId" value={pkg.id} />
          <div className="sm:col-span-2">
            <label className="label">Hotel + room</label>
            <select name="hotelId" className="select" required>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Room (optional)</label>
            <select name="roomId" className="select">
              <option value="">—</option>
              {hotels.flatMap((h) =>
                h.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {h.nameEn} — {r.nameEn}
                  </option>
                )),
              )}
            </select>
          </div>
          <Field name="nightsFrom" label="Night from" defaultValue="1" />
          <Field name="nightsTo" label="Night to" defaultValue="2" />
          <button type="submit" className="btn btn-primary sm:col-span-2">Add stay</button>
        </form>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" name={name} defaultValue={defaultValue} />
    </div>
  );
}
