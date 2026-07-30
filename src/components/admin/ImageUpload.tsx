"use client";

import { useState } from "react";

export function ImageUpload({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onFile(file: File | null) {
    if (!file) return;
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", label);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setUrl(data.media.url);
  }

  return (
    <div>
      <label className="label">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-start gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-20 w-auto rounded-lg border border-ocean/15 object-cover" />
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-sand text-xs text-ink/40">
            No image
          </div>
        )}
        <div className="min-w-[200px] flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
          <input
            className="input !py-1.5 text-xs"
            placeholder="Or paste image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {loading && <p className="text-xs text-ocean">Uploading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
