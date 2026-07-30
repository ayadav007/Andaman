"use client";

import { FormEvent, useEffect, useState } from "react";

export function LeadPopup({
  enabled,
  delaySec,
  heading,
  privacy,
  buttonLabel,
}: {
  enabled: boolean;
  delaySec: number;
  heading: string;
  privacy: string;
  buttonLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ae_lead_dismissed")) return;
    const t = window.setTimeout(() => setOpen(true), Math.max(3, delaySec) * 1000);
    return () => window.clearTimeout(t);
  }, [enabled, delaySec]);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem("ae_lead_dismissed", "1");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("company") || "")) {
      dismiss();
      return;
    }
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "popup",
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Something went wrong. Please try WhatsApp or call.");
      return;
    }
    setDone(true);
    sessionStorage.setItem("ae_lead_dismissed", "1");
  }

  if (!open) return null;

  return (
    <div data-fixed-ui className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#7ec8e3] to-[#3a9bc7] p-6 text-ink shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-lg"
          aria-label="Close"
        >
          ×
        </button>
        {done ? (
          <div className="py-8 text-center">
            <p className="font-display text-2xl">Thank you!</p>
            <p className="mt-2 text-sm">Our team will contact you shortly.</p>
            <button type="button" className="btn btn-primary mt-6" onClick={dismiss}>
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <h2 className="pr-8 font-display text-2xl leading-snug">{heading}</h2>
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
              <input className="input" name="name" placeholder="Name" required />
              <input className="input" name="email" type="email" placeholder="Email" required />
              <input className="input" name="phone" placeholder="Phone No" required />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button type="submit" className="btn w-full !bg-coral !text-white" disabled={loading}>
                {loading ? "Sending…" : buttonLabel}
              </button>
            </form>
            <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/80">{privacy}</p>
          </>
        )}
      </div>
    </div>
  );
}
