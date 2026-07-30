"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero({
  brandName,
  tagline,
  headline,
  support,
  imageUrl,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: {
  brandName: string;
  tagline: string;
  headline: string;
  support: string;
  imageUrl: string | null;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <div
        className="hero-zoom absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl || "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1800&q=85"})`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,61,61,0.15)_0%,rgba(5,40,40,0.55)_55%,rgba(8,24,24,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f6f1e8] to-transparent" />

      <div className="section-inner relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-28 pt-28 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/70">
            Andaman & Nicobar
          </p>
          <h1 className="font-display text-[clamp(2.8rem,8vw,5.8rem)] leading-[0.95] italic">
            {brandName.replace(" Pvt Ltd", "")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-display text-xl font-medium italic text-seafoam sm:text-2xl">
            {tagline}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base font-light tracking-wide text-white/85 sm:text-lg">
            {headline}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-relaxed text-white/65 sm:text-base">
            {support}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href={primaryUrl} className="btn btn-primary">
                {primaryLabel}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href={secondaryUrl} className="btn btn-ghost">
                {secondaryLabel}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-ocean-deep/70"
        >
          <span className="float-soft inline-block h-8 w-px bg-ocean/40" />
          Scroll
        </motion.div>
      </div>
    </section>
  );
}
