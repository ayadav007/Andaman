import { getSmtpConfig } from "@/lib/integrations";

/**
 * Email alerts — prefers Admin → Integrations (encrypted DB),
 * falls back to SMTP_* env vars.
 */
export async function sendAlertEmail(opts: {
  subject: string;
  text: string;
  to?: string | null;
}) {
  const smtp = await getSmtpConfig();
  const to = opts.to || smtp.alertTo;
  if (!to) {
    console.log("[email:skip] No alert recipient configured:", opts.subject);
    return { sent: false as const, reason: "no_recipient" };
  }

  if (!smtp.configured || !smtp.host || !smtp.user || !smtp.pass) {
    console.log("[email:skip] SMTP not configured. Would send to", to, opts.subject);
    console.log(opts.text);
    return { sent: false as const, reason: "no_smtp" };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    await transporter.sendMail({
      from: smtp.from || smtp.user,
      to,
      subject: opts.subject,
      text: opts.text,
    });
    return { sent: true as const };
  } catch (e) {
    console.error("[email:error]", e);
    return { sent: false as const, reason: "error" };
  }
}
