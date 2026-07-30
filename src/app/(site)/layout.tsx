import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { StickyContactBar } from "@/components/site/StickyContactBar";
import { LeadPopup } from "@/components/site/LeadPopup";
import { Analytics } from "@/components/site/Analytics";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const fromCookie = jar.get("ae_lang")?.value;
  if (fromCookie === "hi" || fromCookie === "en") return fromCookie;
  return "en";
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, nav, locale] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.navItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: {
        columns: {
          orderBy: { sortOrder: "asc" },
          include: { links: { orderBy: { sortOrder: "asc" } } },
        },
      },
    }),
    getLocale(),
  ]);

  const brand = settings?.brandName || "Andaman Ecstasy Pvt Ltd";

  return (
    <>
      <Analytics gaId={settings?.googleAnalyticsId} pixelId={settings?.metaPixelId} />
      <Header
        brandName={brand}
        logoUrl={settings?.logoUrl || null}
        nav={nav}
        locale={locale}
      />
      <main className="flex-1">{children}</main>
      <div className="pb-20">
        <Footer
          brandName={brand}
          tagline={settings?.tagline || ""}
          logoUrl={settings?.logoUrl || null}
          address={settings?.companyAddress || null}
        />
      </div>
      {settings && (
        <>
          <StickyContactBar callNumber={settings.callNumber} />
          <FloatingActions
            whatsappNumber={settings.whatsappNumber}
            callNumber={settings.callNumber}
            whatsappPrefill={settings.whatsappPrefill}
            showWhatsapp={settings.showWhatsappFab}
            showCall={false}
          />
          <LeadPopup
            enabled={settings.leadPopupEnabled}
            delaySec={settings.leadPopupDelaySec}
            heading={settings.leadPopupHeading}
            privacy={settings.leadPopupPrivacy}
            buttonLabel={settings.leadPopupButtonLabel}
          />
        </>
      )}
    </>
  );
}
