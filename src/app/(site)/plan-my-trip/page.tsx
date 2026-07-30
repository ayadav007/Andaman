"use client";

import { FormEvent, useState } from "react";

export default function PlanMyTripPage() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("company") || "")) {
      setOk(true);
      setLoading(false);
      return;
    }
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "plan_my_trip",
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        travelDates: fd.get("travelDates"),
        guests: fd.get("guests"),
        budget: fd.get("budget"),
        message: fd.get("message"),
      }),
    });
    setLoading(false);
    setOk(true);
  }

  return (
    <div className="section">
      <div className="section-inner max-w-xl">
        <h1 className="section-title">Plan my trip</h1>
        <p className="section-sub">Tell us your dates and preferences — we’ll craft an itinerary.</p>
        {ok ? (
          <div className="rounded-2xl bg-seafoam/50 p-6">
            <p className="font-display text-2xl text-ocean-deep">Thank you!</p>
            <p className="mt-2 text-sm">We’ll send options / itinerary shortly.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-white p-6 shadow ring-1 ring-ocean/10">
            <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
            <div>
              <label className="label">Name</label>
              <input className="input" name="name" required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Email</label>
                <input className="input" name="email" type="email" required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" name="phone" required />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Preferred dates</label>
                <input className="input" name="travelDates" placeholder="e.g. 10–16 Oct" />
              </div>
              <div>
                <label className="label">Guests</label>
                <input className="input" name="guests" type="number" min={1} defaultValue={2} />
              </div>
            </div>
            <div>
              <label className="label">Budget (optional)</label>
              <input className="input" name="budget" placeholder="e.g. ₹30,000 / person" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="textarea" name="message" placeholder="Honeymoon, scuba, family…" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
