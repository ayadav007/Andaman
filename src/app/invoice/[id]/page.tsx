import { PrintButton } from "@/components/site/PrintButton";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: { booking: { include: { package: true } } },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-ink">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-ocean/20 pb-6">
          <div>
            <p className="font-display text-3xl text-ocean-deep">
              {settings?.brandName || "Andaman Ecstasy Pvt Ltd"}
            </p>
            <p className="text-sm text-ink/60">{settings?.companyAddress}</p>
            {settings?.gstin && <p className="text-sm">GSTIN: {settings.gstin}</p>}
          </div>
          <PrintButton />
        </div>
        <h1 className="font-display mt-8 text-3xl text-ocean-deep">Tax Invoice / Receipt</h1>
        <p className="mt-2 text-sm">Invoice No: <strong>{invoice.number}</strong></p>
        <p className="text-sm">Date: {invoice.issuedAt.toLocaleDateString("en-IN")}</p>

        <div className="mt-6 rounded-xl border border-ocean/15 p-4 text-sm">
          <p className="font-semibold">Bill to</p>
          <p>{invoice.booking.guestName}</p>
          <p>{invoice.booking.email}</p>
          <p>{invoice.booking.phone}</p>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ocean/15 text-left">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ocean/10">
              <td className="py-3">
                {invoice.booking.package?.titleEn || "Andaman booking"}
                <br />
                <span className="text-xs text-ink/50">Booking ref {invoice.booking.id.slice(0, 8)}</span>
              </td>
              <td className="py-3 text-right">{formatINR(invoice.amount)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 font-bold">Total paid</td>
              <td className="py-3 text-right font-bold">{formatINR(invoice.amount)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-8 text-xs text-ink/50">
          Payment status: {invoice.booking.paymentStatus}
          {invoice.booking.razorpayPaymentId
            ? ` · Razorpay ${invoice.booking.razorpayPaymentId}`
            : ""}
        </p>
      </div>
    </div>
  );
}
