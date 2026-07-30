import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin/bookings");
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean-deep">Bookings</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ocean/15 text-ink/50">
            <tr>
              <th className="py-2 pr-4">Guest</th>
              <th className="py-2 pr-4">Package</th>
              <th className="py-2 pr-4">Dates</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-ocean/10">
                <td className="py-3 pr-4">
                  <p className="font-semibold">{b.guestName}</p>
                  <p className="text-xs text-ink/50">{b.email} · {b.phone}</p>
                </td>
                <td className="py-3 pr-4">{b.package?.titleEn || "—"}</td>
                <td className="py-3 pr-4 text-xs">
                  {b.startDate || "—"} → {b.endDate || "—"}
                  <br />
                  {b.guests} guests
                </td>
                <td className="py-3 pr-4">
                  {b.amountDue ? formatINR(b.amountDue) : "—"}
                  <br />
                  <span className="text-xs text-ink/50">{b.paymentStatus}</span>
                </td>
                <td className="py-3 pr-4">{b.status}</td>
                <td className="py-3">
                  <form action={updateStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={b.id} />
                    <select name="status" className="select !py-1 !text-xs" defaultValue={b.status}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button type="submit" className="btn btn-primary !px-3 !py-1 text-xs">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="mt-6 text-sm text-ink/50">No bookings yet.</p>}
      </div>
    </div>
  );
}
