"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fd.get("password") }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3ebe0] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg ring-1 ring-ocean/10">
        <p className="font-display text-3xl text-ocean-deep">Admin</p>
        <p className="mt-1 text-sm text-ink/60">Andaman Ecstasy Pvt Ltd</p>
        <label className="label mt-6">Password</label>
        <input className="input" name="password" type="password" required autoFocus />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn btn-primary mt-4 w-full" disabled={loading}>
          {loading ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
