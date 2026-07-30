"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function PayButton({ bookingId }: { bookingId: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setLoading(false);
      setError(data.error || "Payment not available yet. Configure Razorpay keys in .env");
      return;
    }

    await new Promise<void>((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Razorpay script failed"));
      document.body.appendChild(s);
    }).catch(() => {
      setError("Could not load Razorpay");
      setLoading(false);
    });

    if (!window.Razorpay) {
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "Andaman Ecstasy Pvt Ltd",
      description: "Package booking payment",
      order_id: data.orderId,
      prefill: {
        name: data.guestName,
        email: data.email,
        contact: data.phone,
      },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verify = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, ...response }),
        });
        const result = await verify.json();
        setLoading(false);
        if (result.ok && result.invoiceUrl) {
          window.location.href = result.invoiceUrl;
        } else {
          setError("Payment captured but verification failed. Contact us.");
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });
    rzp.open();
  }

  return (
    <div>
      <button type="button" className="btn btn-primary w-full" onClick={pay} disabled={loading}>
        {loading ? "Opening payment…" : "Pay with Razorpay"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
