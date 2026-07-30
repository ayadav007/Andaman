import Link from "next/link";

export function Footer({
  brandName,
  tagline,
  logoUrl,
  address,
}: {
  brandName: string;
  tagline: string;
  logoUrl: string | null;
  address: string | null;
}) {
  const shortBrand = brandName.replace(" Pvt Ltd", "");
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-ocean/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a4f4e] via-[#074040] to-[#0b2e2e]" />
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-lagoon/20 blur-3xl" />
      <div className="section-inner relative grid gap-10 py-16 text-white md:grid-cols-4">
        <div className="md:col-span-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brandName} className="mb-4 h-12 w-auto brightness-0 invert" />
          ) : (
            <p className="font-display text-3xl italic">{shortBrand}</p>
          )}
          <p className="mt-3 max-w-md font-display text-lg italic leading-relaxed text-seafoam/90">
            {tagline}
          </p>
          {address && <p className="mt-4 text-sm font-light text-white/55">{address}</p>}
        </div>
        <div>
          <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45">
            Explore
          </p>
          <ul className="space-y-2.5 text-sm font-light text-white/80">
            <li><Link className="hover:text-white" href="/destinations">Destinations</Link></li>
            <li><Link className="hover:text-white" href="/packages">Packages</Link></li>
            <li><Link className="hover:text-white" href="/hotels">Hotels</Link></li>
            <li><Link className="hover:text-white" href="/blog">Travel guide</Link></li>
            <li><Link className="hover:text-white" href="/plan-my-trip">Plan my trip</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/45">
            Company
          </p>
          <ul className="space-y-2.5 text-sm font-light text-white/80">
            <li><Link className="hover:text-white" href="/about">About us</Link></li>
            <li><Link className="hover:text-white" href="/travel-tips">Travel tips</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-white" href="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms</Link></li>
            <li><Link className="hover:text-white" href="/cancellation">Cancellation</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-4 text-center text-xs font-light tracking-wide text-white/45">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
