"use client";

import { FormEvent, useState } from "react";
import { PayButton } from "@/components/site/PayButton";

export function BookingForm({
  packageId,
  hotelId,
}: {
  packageId?: string;
  hotelId?: string;
}) {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: fd.get("guestName"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate"),
        guests: fd.get("guests"),
        notes: fd.get("notes"),
        company: fd.get("company"),
        packageId,
        hotelId,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError("Could not submit. Please try WhatsApp.");
      return;
    }
    setBookingId(data.id);
  }

  if (bookingId) {
    return (
      <div className="space-y-4 rounded-2xl bg-seafoam/50 p-6 text-ocean-deep">
        <p className="font-display text-2xl">Request received</p>
        <p className="text-sm">
          Our team will confirm soon. You can optionally pay online now (Razorpay test/live keys in .env).
        </p>
        <PayButton bookingId={bookingId} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow ring-1 ring-ocean/10">
      <h3 className="font-display text-2xl text-ocean-deep">Request booking</h3>
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="label">Name</label>
        <input className="input" name="guestName" required />
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
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Start date</label>
          <input className="input" name="startDate" type="date" />
        </div>
        <div>
          <label className="label">End date</label>
          <input className="input" name="endDate" type="date" />
        </div>
        <div>
          <label className="label">Guests</label>
          <input className="input" name="guests" type="number" min={1} defaultValue={2} />
        </div>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="textarea" name="notes" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
