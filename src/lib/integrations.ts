import { decryptSecret } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function getSmtpConfig() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const pass =
    decryptSecret(s?.smtpPassEnc) || process.env.SMTP_PASS || null;
  const host = s?.smtpHost || process.env.SMTP_HOST || null;
  const user = s?.smtpUser || process.env.SMTP_USER || null;
  const from = s?.smtpFrom || process.env.SMTP_FROM || user;
  const port = s?.smtpPort || Number(process.env.SMTP_PORT || 587);
  const secure = s?.smtpSecure ?? process.env.SMTP_SECURE === "true";
  const alertTo = s?.alertEmail || process.env.ALERT_TO || null;

  return {
    host,
    user,
    pass,
    from,
    port,
    secure,
    alertTo,
    configured: Boolean(host && user && pass),
  };
}

export async function getRazorpayConfig() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const keyId =
    s?.razorpayKeyId ||
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    null;
  const keySecret =
    decryptSecret(s?.razorpayKeySecretEnc) ||
    process.env.RAZORPAY_KEY_SECRET ||
    null;

  return {
    keyId,
    keySecret,
    configured: Boolean(keyId && keySecret),
  };
}
