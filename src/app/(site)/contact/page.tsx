import { prisma } from "@/lib/prisma";
import { waLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return (
    <div className="section">
      <div className="section-inner grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="section-title">Contact us</h1>
          <p className="section-sub">Speak with Andaman Ecstasy — call, WhatsApp, or visit.</p>
          <ul className="space-y-3 text-ink/80">
            <li>
              <strong>Phone:</strong>{" "}
              <a className="text-ocean" href={`tel:${s?.callNumber}`}>{s?.callNumber}</a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a
                className="text-ocean"
                href={waLink(s?.whatsappNumber || "", s?.whatsappPrefill || "")}
                target="_blank"
                rel="noreferrer"
              >
                Chat now
              </a>
            </li>
            {s?.companyAddress && (
              <li>
                <strong>Address:</strong> {s.companyAddress}
              </li>
            )}
          </ul>
        </div>
        {s?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-2xl ring-1 ring-ocean/10">
            <iframe src={s.mapEmbedUrl} title="Map" className="h-80 w-full border-0" loading="lazy" />
          </div>
        )}
      </div>
    </div>
  );
}
