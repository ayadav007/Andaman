"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const label = (en: string, hi: string | null) =>
    locale === "hi" && hi ? hi : en;
  const shortBrand = brandName.replace(" Pvt Ltd", "");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="section-inner flex items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={brandName}
              className="h-9 w-auto max-w-[140px] object-contain sm:h-11 sm:max-w-[170px]"
            />
          ) : (
            <span className="font-display truncate text-xl italic text-ocean-deep sm:text-[1.7rem]">
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="grid h-11 min-w-[2.75rem] place-items-center rounded-full px-2 text-xs font-semibold tracking-wide text-ocean-deep transition hover:bg-white/70"
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
            className="grid h-11 w-11 place-items-center rounded-xl border border-ocean/20 bg-white/50 text-ocean-deep lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ocean/10 bg-sand/95 lg:hidden"
          >
            <div className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
              <ul>
                {nav.map((item) => {
                  const hasColumns = item.columns.length > 0;
                  const isExpanded = expanded === item.id;
                  return (
                    <li key={item.id} className="border-b border-ocean/10 last:border-b-0">
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href || "#"}
                          className="min-w-0 flex-1 py-3.5 text-base font-medium text-ink"
                          onClick={closeMenu}
                        >
                          {label(item.labelEn, item.labelHi)}
                        </Link>
                        {hasColumns && (
                          <button
                            type="button"
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ocean"
                            onClick={() => setExpanded(isExpanded ? null : item.id)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? "Hide" : "Show"} ${label(
                              item.labelEn,
                              item.labelHi,
                            )} links`}
                          >
                            <motion.svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              aria-hidden="true"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </motion.svg>
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {hasColumns && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 pb-4 pl-3">
                              {item.columns.map((col) => (
                                <div
                                  key={col.id}
                                  className="border-l border-ocean/15 pl-3"
                                >
                                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ocean">
                                    {label(col.titleEn, col.titleHi)}
                                  </p>
                                  <ul>
                                    {col.links.map((link) => (
                                      <li key={link.id}>
                                        <Link
                                          href={link.href}
                                          className="block py-2 text-sm text-ink/70"
                                          onClick={closeMenu}
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
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/plan-my-trip"
                className="btn btn-primary mt-5 w-full !py-3 text-sm"
                onClick={closeMenu}
              >
                Plan my trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
