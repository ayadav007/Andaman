import { encryptSecret, isSecretConfigured } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function saveIntegrations(formData: FormData) {
  "use server";
  const existing = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const smtpPassRaw = String(formData.get("smtpPass") || "").trim();
  const rzpSecretRaw = String(formData.get("razorpayKeySecret") || "").trim();

  let smtpPassEnc = existing?.smtpPassEnc ?? null;
  if (smtpPassRaw) {
    smtpPassEnc = encryptSecret(smtpPassRaw);
  }
  if (formData.get("clearSmtpPass") === "on") {
    smtpPassEnc = null;
  }

  let razorpayKeySecretEnc = existing?.razorpayKeySecretEnc ?? null;
  if (rzpSecretRaw) {
    razorpayKeySecretEnc = encryptSecret(rzpSecretRaw);
  }
  if (formData.get("clearRazorpaySecret") === "on") {
    razorpayKeySecretEnc = null;
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {
      alertEmail: String(formData.get("alertEmail") || "") || null,
      smtpHost: String(formData.get("smtpHost") || "") || null,
      smtpPort: Number(formData.get("smtpPort") || 587),
      smtpUser: String(formData.get("smtpUser") || "") || null,
      smtpFrom: String(formData.get("smtpFrom") || "") || null,
      smtpSecure: formData.get("smtpSecure") === "on",
      smtpPassEnc,
      razorpayKeyId: String(formData.get("razorpayKeyId") || "") || null,
      razorpayKeySecretEnc,
    },
  });

  revalidatePath("/admin/integrations");
}

export default async function AdminIntegrationsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const smtpSet = isSecretConfigured(s?.smtpPassEnc);
  const rzpSet = isSecretConfigured(s?.razorpayKeySecretEnc);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ocean-deep">Integrations</h1>
      <p className="mt-1 text-sm text-ink/60">
        SMTP and Razorpay secrets are stored <strong>encrypted</strong> in the database.
        A master key <code className="text-xs">ENCRYPTION_KEY</code> in <code className="text-xs">.env</code> is
        required to encrypt/decrypt (never share that file).
      </p>

      <form action={saveIntegrations} className="admin-card mt-6 space-y-5">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-ocean-deep">Email alerts (SMTP)</h2>
          <Field name="alertEmail" label="Alert recipient email" defaultValue={s?.alertEmail || ""} placeholder="owner@andamanecstasy.com" />
          <Field name="smtpHost" label="SMTP host" defaultValue={s?.smtpHost || ""} placeholder="smtp.hostinger.com" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="smtpPort" label="Port" defaultValue={String(s?.smtpPort ?? 587)} />
            <Field name="smtpUser" label="SMTP username" defaultValue={s?.smtpUser || ""} />
          </div>
          <Field name="smtpFrom" label="From address" defaultValue={s?.smtpFrom || ""} placeholder="noreply@andamanecstasy.com" />
          <div>
            <label className="label">
              SMTP password {smtpSet ? <span className="font-normal text-ocean">(saved — leave blank to keep)</span> : null}
            </label>
            <input
              className="input"
              name="smtpPass"
              type="password"
              autoComplete="new-password"
              placeholder={smtpSet ? "••••••••" : "Enter SMTP password"}
            />
          </div>
          {smtpSet && (
            <label className="flex items-center gap-2 text-sm text-red-700">
              <input type="checkbox" name="clearSmtpPass" /> Clear saved SMTP password
            </label>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="smtpSecure" defaultChecked={s?.smtpSecure ?? false} />
            Use TLS/SSL (port 465)
          </label>
        </section>

        <hr className="border-ocean/10" />

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-ocean-deep">Razorpay</h2>
          <p className="text-xs text-ink/50">
            Use test keys from Razorpay Dashboard while developing. Key secret is encrypted at rest.
          </p>
          <Field
            name="razorpayKeyId"
            label="Key ID"
            defaultValue={s?.razorpayKeyId || ""}
            placeholder="rzp_test_..."
          />
          <div>
            <label className="label">
              Key secret {rzpSet ? <span className="font-normal text-ocean">(saved — leave blank to keep)</span> : null}
            </label>
            <input
              className="input"
              name="razorpayKeySecret"
              type="password"
              autoComplete="new-password"
              placeholder={rzpSet ? "••••••••" : "Enter key secret"}
            />
          </div>
          {rzpSet && (
            <label className="flex items-center gap-2 text-sm text-red-700">
              <input type="checkbox" name="clearRazorpaySecret" /> Clear saved Razorpay secret
            </label>
          )}
        </section>

        <button type="submit" className="btn btn-primary">
          Save integrations
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
