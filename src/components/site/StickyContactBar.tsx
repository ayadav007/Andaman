import Link from "next/link";
import type { ReactNode } from "react";

function formatDisplayPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91-${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `+91-${digits}`;
  }
  return raw.startsWith("+") ? raw : `+${raw}`;
}

export function StickyContactBar({ callNumber }: { callNumber: string }) {
  if (!callNumber) return null;
  const display = formatDisplayPhone(callNumber);
  const tel = callNumber.startsWith("+") || callNumber.startsWith("tel:")
    ? callNumber.replace(/^tel:/, "")
    : `+${callNumber.replace(/\D/g, "")}`;

  return (
    <div data-fixed-ui className="sticky-contact-bar pointer-events-none">
      <div className="pointer-events-auto border-t border-black/8 bg-white/95 shadow-[0_-8px_30px_rgba(20,36,36,0.1)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3">
          <nav className="hidden items-center gap-6 md:flex lg:gap-10">
            <BarLink href="/destinations" label="Destinations" icon={<IslandIcon />} />
            <BarLink href="/packages" label="Packages" icon={<MapIcon />} />
            <BarLink href="/hotels" label="Hotels" icon={<PinHeartIcon />} />
          </nav>

          <div className="flex w-full items-center justify-center gap-2 sm:gap-3 md:w-auto md:justify-end">
            <a
              href={`tel:${tel}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-ocean px-3 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean/5 sm:flex-none sm:px-5"
            >
              <PhoneIcon />
              <span className="tracking-wide">{display}</span>
            </a>
            <Link
              href="/plan-my-trip"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-lagoon to-ocean-deep px-3 py-2 text-sm font-semibold text-white shadow-md shadow-ocean-deep/30 transition hover:brightness-105 sm:flex-none sm:px-5"
            >
              <RouteIcon />
              <span>Plan Your Trip</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1 text-[0.7rem] font-semibold tracking-wide text-ink/70 transition hover:text-ocean"
    >
      <span className="text-ink/55 transition group-hover:text-ocean">{icon}</span>
      {label}
    </Link>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9 3 3.4 3.4 3 4 3h3.5c.5 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IslandIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 18c2-3 4-4 8-4s6 1 8 4" />
      <path d="M8 14c.5-3 2-6 4-8 1.5 1.5 2.5 3.5 3 6" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

function PinHeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 21s-7-5.7-7-11a7 7 0 1 1 14 0c0 5.3-7 11-7 11z" />
      <path d="M12 12.5c-.8-.8-2-.8-2.7 0-.7.7-.7 1.9 0 2.6L12 16l2.7-2.9c.7-.7.7-1.9 0-2.6-.7-.8-1.9-.8-2.7 0z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}
