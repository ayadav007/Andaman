"use client";

import { useEffect, useState } from "react";

type Media = { id: string; url: string; filename: string; alt: string | null };

export default function AdminMediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    if (data.ok) setItems(data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(file: File | null) {
    if (!file) return;
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean-deep">Media library</h1>
      <p className="mt-1 text-sm text-ink/60">Upload images for logo, hero, hotels, packages, and sections.</p>

      <div className="admin-card mt-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e.target.files?.[0] || null)}
        />
        {loading && <p className="mt-2 text-sm text-ocean">Uploading…</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="admin-card !p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt || ""} className="h-32 w-full rounded-lg object-cover" />
            <p className="mt-2 truncate text-xs text-ink/50">{m.url}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="text-xs text-ocean"
                onClick={() => navigator.clipboard.writeText(m.url)}
              >
                Copy URL
              </button>
              <button type="button" className="text-xs text-red-600" onClick={() => onDelete(m.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-6 text-sm text-ink/50">No uploads yet.</p>}
    </div>
  );
}
