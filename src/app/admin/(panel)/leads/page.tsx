import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function updateLead(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-3xl text-ocean-deep">Leads & enquiries</h1>
      <div className="mt-6 space-y-3">
        {leads.map((l) => (
          <div key={l.id} className="admin-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-sm text-ink/60">
                  {l.email} · {l.phone}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ocean">{l.source}</p>
                {l.message && <p className="mt-2 text-sm text-ink/70">{l.message}</p>}
                {(l.travelDates || l.budget) && (
                  <p className="mt-1 text-xs text-ink/50">
                    Dates: {l.travelDates || "—"} · Budget: {l.budget || "—"} · Guests: {l.guests ?? "—"}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <form action={updateLead} className="flex gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <select name="status" className="select !py-1 !text-xs" defaultValue={l.status}>
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="converted">converted</option>
                    <option value="closed">closed</option>
                  </select>
                  <button className="btn btn-primary !px-3 !py-1 text-xs" type="submit">
                    Save
                  </button>
                </form>
                <Link
                  href={`/admin/itineraries/new?leadId=${l.id}&name=${encodeURIComponent(l.name)}&email=${encodeURIComponent(l.email)}&phone=${encodeURIComponent(l.phone)}`}
                  className="text-xs font-semibold text-ocean"
                >
                  Create itinerary →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p className="text-sm text-ink/50">No leads yet.</p>}
      </div>
    </div>
  );
}
