"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/itineraries", label: "Itineraries" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/hotels", label: "Hotels" },
  { href: "/admin/sections", label: "Home sections" },
  { href: "/admin/content", label: "FAQ / Reviews / Blog" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/integrations", label: "Integrations" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="border-r border-ocean/10 bg-ocean-deep p-5 text-white">
      <p className="font-display text-2xl">Ecstasy Admin</p>
      <nav className="mt-8 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block rounded-lg px-3 py-2 text-sm ${active ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10"}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="mt-8 text-sm text-white/70 hover:text-white"
        onClick={async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        }}
      >
        Log out
      </button>
      <Link href="/" className="mt-4 block text-xs text-white/50 hover:text-white">
        ← View site
      </Link>
    </aside>
  );
}
