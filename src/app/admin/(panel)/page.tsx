import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [leadsToday, leadsTotal, bookingsPending, bookingsPaid, itineraries] =
    await Promise.all([
      prisma.lead.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.lead.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count({ where: { paymentStatus: "paid" } }),
      prisma.itinerary.count(),
    ]);

  const cards = [
    { label: "Leads today", value: leadsToday, href: "/admin/leads" },
    { label: "Total leads", value: leadsTotal, href: "/admin/leads" },
    { label: "Pending bookings", value: bookingsPending, href: "/admin/bookings" },
    { label: "Paid bookings", value: bookingsPaid, href: "/admin/bookings" },
    { label: "Itineraries", value: itineraries, href: "/admin/itineraries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean-deep">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Andaman Ecstasy operations overview</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-card hover:ring-2 hover:ring-ocean/20">
            <p className="text-sm text-ink/60">{c.label}</p>
            <p className="font-display mt-2 text-4xl text-ocean-deep">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
