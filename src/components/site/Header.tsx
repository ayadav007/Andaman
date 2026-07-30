"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type NavLink = { id: string; labelEn: string; labelHi: string | null; href: string };
type NavColumn = {
  id: string;
  titleEn: string;
  titleHi: string | null;
  links: NavLink[];
};
type NavItem = {
  id: string;
  labelEn: string;
  labelHi: string | null;
  href: string | null;
  columns: NavColumn[];
};

export function Header({
  brandName,
  logoUrl,
  nav,
  locale,
}: {
  brandName: string;
  logoUrl: string | null;
  nav: NavItem[];
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const label = (en: string, hi: string | null) =>
    locale === "hi" && hi ? hi : en;
  const shortBrand = brandName.replace(" Pvt Ltd", "");

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="section-inner flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brandName} className="h-11 w-auto max-w-[170px] object-contain" />
          ) : (
            <span className="font-display truncate text-2xl italic text-ocean-deep sm:text-[1.7rem]">
              {shortBrand}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setMega(item.columns.length ? item.id : null)}
              onMouseLeave={() => setMega(null)}
            >
              <Link
                href={item.href || "#"}
                className="rounded-full px-3.5 py-2 text-[1.05rem] font-medium tracking-wide text-ink/70 transition hover:bg-white/60 hover:text-ocean"
              >
                {label(item.labelEn, item.labelHi)}
                {item.columns.length > 0 ? (
                  <span className="ml-1 opacity-50">▾</span>
                ) : null}
              </Link>
              <AnimatePresence>
                {mega === item.id && item.columns.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full pt-3"
                  >
                    <div className="flex min-w-[440px] gap-8 rounded-2xl border border-ocean/10 bg-white/95 p-6 shadow-2xl shadow-ocean-deep/10 backdrop-blur-xl">
                      {item.columns.map((col) => (
                        <div key={col.id} className="min-w-[140px]">
                          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ocean">
                            {label(col.titleEn, col.titleHi)}
                          </p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.id}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-ink/70 transition hover:text-ocean"
                                >
                                  {label(link.labelEn, link.labelHi)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-ocean-deep transition hover:bg-white/70"
            onClick={async () => {
              const next = locale === "en" ? "hi" : "en";
              await fetch("/api/locale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale: next }),
              });
              window.location.reload();
            }}
          >
            {locale === "en" ? "हिं" : "EN"}
          </button>
          <Link
            href="/plan-my-trip"
            className="btn btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex"
          >
            Plan trip
          </Link>
          <button
            type="button"
            className="rounded-xl border border-ocean/20 bg-white/50 px-3 py-2 text-sm font-medium lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ocean/10 bg-sand/95 lg:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href || "#"}
                    className="block rounded-lg px-2 py-2.5 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {label(item.labelEn, item.labelHi)}
                  </Link>
                  {item.columns.map((col) => (
                    <div key={col.id} className="ml-3 space-y-1 border-l border-ocean/15 pl-3">
                      <p className="text-xs font-bold text-ocean">{label(col.titleEn, col.titleHi)}</p>
                      {col.links.map((link) => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="block py-1 text-sm text-ink/70"
                          onClick={() => setOpen(false)}
                        >
                          {label(link.labelEn, link.labelHi)}
                        </Link>
                      ))}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
