import { ImageUpload } from "@/components/admin/ImageUpload";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function saveSettings(formData: FormData) {
  "use server";
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {
      brandName: String(formData.get("brandName") || ""),
      tagline: String(formData.get("tagline") || ""),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      faviconUrl: String(formData.get("faviconUrl") || "") || null,
      heroHeadline: String(formData.get("heroHeadline") || ""),
      heroSupport: String(formData.get("heroSupport") || ""),
      heroImageUrl: String(formData.get("heroImageUrl") || "") || null,
      whatsappNumber: String(formData.get("whatsappNumber") || ""),
      callNumber: String(formData.get("callNumber") || ""),
      whatsappPrefill: String(formData.get("whatsappPrefill") || ""),
      showWhatsappFab: formData.get("showWhatsappFab") === "on",
      showCallFab: formData.get("showCallFab") === "on",
      companyAddress: String(formData.get("companyAddress") || "") || null,
      gstin: String(formData.get("gstin") || "") || null,
      mapEmbedUrl: String(formData.get("mapEmbedUrl") || "") || null,
      googleAnalyticsId: String(formData.get("googleAnalyticsId") || "") || null,
      metaPixelId: String(formData.get("metaPixelId") || "") || null,
      tripadvisorEmbed: String(formData.get("tripadvisorEmbed") || "") || null,
      alertEmail: String(formData.get("alertEmail") || "") || null,
      leadPopupEnabled: formData.get("leadPopupEnabled") === "on",
      leadPopupDelaySec: Number(formData.get("leadPopupDelaySec") || 12),
      leadPopupHeading: String(formData.get("leadPopupHeading") || ""),
      metaTitle: String(formData.get("metaTitle") || "") || null,
      metaDescription: String(formData.get("metaDescription") || "") || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ocean-deep">Site settings</h1>
      <p className="mt-1 text-sm text-ink/60">
        Brand, logo, hero, FABs, SEO, analytics. For SMTP / Razorpay go to{" "}
        <a href="/admin/integrations" className="text-ocean font-semibold">Integrations</a>.
      </p>
      <form action={saveSettings} className="mt-6 space-y-4 admin-card">
        <Field name="brandName" label="Brand name" defaultValue={s?.brandName} />
        <Field name="tagline" label="Tagline" defaultValue={s?.tagline} />
        <ImageUpload name="logoUrl" label="Logo" defaultValue={s?.logoUrl} />
        <ImageUpload name="faviconUrl" label="Favicon" defaultValue={s?.faviconUrl} />
        <Field name="heroHeadline" label="Hero headline" defaultValue={s?.heroHeadline} />
        <Field name="heroSupport" label="Hero support" defaultValue={s?.heroSupport} />
        <ImageUpload name="heroImageUrl" label="Hero background image" defaultValue={s?.heroImageUrl} />
        <Field name="whatsappNumber" label="WhatsApp number (with country code)" defaultValue={s?.whatsappNumber} />
        <Field name="callNumber" label="Call number" defaultValue={s?.callNumber} />
        <Field name="whatsappPrefill" label="WhatsApp prefill message" defaultValue={s?.whatsappPrefill} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="showWhatsappFab" defaultChecked={s?.showWhatsappFab ?? true} /> Show WhatsApp button
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="showCallFab" defaultChecked={s?.showCallFab ?? true} /> Show Call button
        </label>
        <Field name="companyAddress" label="Company address" defaultValue={s?.companyAddress || ""} />
        <Field name="gstin" label="GSTIN" defaultValue={s?.gstin || ""} />
        <Field name="alertEmail" label="Alert email (leads/bookings)" defaultValue={s?.alertEmail || ""} />
        <Field name="mapEmbedUrl" label="Google Maps embed URL (Contact page)" defaultValue={s?.mapEmbedUrl || ""} />
        <Field name="googleAnalyticsId" label="Google Analytics ID" defaultValue={s?.googleAnalyticsId || ""} />
        <Field name="metaPixelId" label="Meta Pixel ID" defaultValue={s?.metaPixelId || ""} />
        <div>
          <label className="label">Tripadvisor embed HTML</label>
          <textarea className="textarea" name="tripadvisorEmbed" defaultValue={s?.tripadvisorEmbed || ""} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="leadPopupEnabled" defaultChecked={s?.leadPopupEnabled ?? true} /> Lead popup enabled
        </label>
        <Field name="leadPopupDelaySec" label="Popup delay (seconds)" defaultValue={String(s?.leadPopupDelaySec ?? 12)} />
        <Field name="leadPopupHeading" label="Popup heading" defaultValue={s?.leadPopupHeading} />
        <Field name="metaTitle" label="SEO title" defaultValue={s?.metaTitle || ""} />
        <Field name="metaDescription" label="SEO description" defaultValue={s?.metaDescription || ""} />
        <button type="submit" className="btn btn-primary">Save settings</button>
      </form>
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
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" name={name} defaultValue={defaultValue || ""} />
    </div>
  );
}
