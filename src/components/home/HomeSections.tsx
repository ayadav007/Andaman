"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import { formatINR, youtubeEmbed } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/i18n";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Item = {
  id: string;
  titleEn: string | null;
  titleHi: string | null;
  subtitleEn: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  priceLabel: string | null;
  videoUrl: string | null;
};

type Section = {
  id: string;
  type: string;
  titleEn: string | null;
  titleHi: string | null;
  subtitleEn: string | null;
  subtitleHi: string | null;
  theme: string;
  items: Item[];
};

type Stat = { id: string; value: number; suffix: string; labelEn: string; labelHi: string | null };
type Dest = {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string | null;
  imageUrl: string | null;
  descriptionEn: string;
};
type Pkg = {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string | null;
  summaryEn: string;
  priceFrom: number;
  durationNights: number;
  durationDays: number;
  coverImages: string;
};
type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  quoteEn: string;
  quoteHi: string | null;
  rating: number;
};
type Faq = {
  id: string;
  questionEn: string;
  questionHi: string | null;
  answerEn: string;
  answerHi: string | null;
};

type Blog = {
  id: string;
  slug: string;
  titleEn: string;
  excerptEn: string;
  coverUrl: string | null;
  category: string | null;
};

export function HomeSections({
  sections,
  stats,
  destinations,
  packages,
  testimonials,
  faqs,
  posts,
  tripadvisorEmbed,
  locale,
}: {
  sections: Section[];
  stats: Stat[];
  destinations: Dest[];
  packages: Pkg[];
  testimonials: Testimonial[];
  faqs: Faq[];
  posts: Blog[];
  tripadvisorEmbed: string | null;
  locale: Locale;
}) {
  return (
    <>
      {sections.map((section) => {
        const title = pickLocale(locale, section.titleEn, section.titleHi);
        const subtitle = pickLocale(locale, section.subtitleEn, section.subtitleHi);
        switch (section.type) {
          case "carousel":
            return <ImageCarousel key={section.id} items={section.items} />;
          case "stats":
            return <StatsStrip key={section.id} title={title} stats={stats} locale={locale} />;
          case "coverflow":
            return (
              <Coverflow
                key={section.id}
                title={title}
                subtitle={subtitle}
                items={section.items}
                locale={locale}
              />
            );
          case "card_carousel":
            return (
              <CardCarousel
                key={section.id}
                title={title}
                subtitle={subtitle}
                items={section.items}
                locale={locale}
              />
            );
          case "places_row":
            return (
              <PlacesRow
                key={section.id}
                title={title}
                items={section.items}
                dark={section.theme === "dark"}
                locale={locale}
              />
            );
          case "destinations":
            return (
              <DestinationsGrid
                key={section.id}
                title={title}
                destinations={destinations}
                locale={locale}
              />
            );
          case "packages":
            return (
              <PackagesGrid key={section.id} title={title} packages={packages} locale={locale} />
            );
          case "youtube":
            return (
              <YoutubeSection key={section.id} title={title} items={section.items} locale={locale} />
            );
          case "testimonials":
            return <Testimonials key={section.id} title={title} items={testimonials} locale={locale} />;
          case "faq":
            return <FaqSection key={section.id} title={title || "FAQ"} faqs={faqs} locale={locale} />;
          case "blog_teaser":
            return <BlogTeaser key={section.id} title={title} posts={posts} />;
          case "tripadvisor":
            return tripadvisorEmbed ? (
              <TripadvisorBlock key={section.id} title={title} embed={tripadvisorEmbed} />
            ) : null;
          default:
            return null;
        }
      })}
    </>
  );
}

function SectionHead({
  title,
  subtitle,
  light,
  center = true,
}: {
  title: string | null;
  subtitle?: string | null;
  light?: boolean;
  center?: boolean;
}) {
  if (!title && !subtitle) return null;
  return (
    <Reveal className={center ? "text-center" : ""}>
      {title && (
        <h2
          className={`section-title ${center ? "center" : ""} ${light ? "!text-white after:!bg-gradient-to-r after:!from-seafoam after:!to-coral" : ""}`}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`section-sub ${center ? "mx-auto" : ""} ${light ? "!text-white/65" : ""}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

function ImageCarousel({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const slides = items.filter((x) => x.imageUrl);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);
  if (!slides.length) return null;

  return (
    <section className="relative mt-3 overflow-hidden sm:mt-4">
      <div className="relative h-[48vw] min-h-[260px] max-h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[i].id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slides[i].imageUrl!}
              alt={slides[i].titleEn || ""}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/50 via-transparent to-transparent" />
            {slides[i].titleEn && (
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="font-display text-2xl italic text-white drop-shadow-lg sm:text-3xl">
                  {slides[i].titleEn}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xl text-white backdrop-blur-md transition hover:bg-white/30"
          onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)}
        >
          ‹
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xl text-white backdrop-blur-md transition hover:bg-white/30"
          onClick={() => setI((v) => (v + 1) % slides.length)}
        >
          ›
        </button>
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-2 bg-white/40"}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsStrip({
  title,
  stats,
  locale,
}: {
  title: string | null;
  stats: Stat[];
  locale: Locale;
}) {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-seafoam/50 via-transparent to-sand-deep/40" />
      <div className="section-inner relative">
        <SectionHead title={title} />
        <Stagger className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((s) => (
            <StaggerItem key={s.id}>
              <StatCounter
                value={s.value}
                suffix={s.suffix}
                label={pickLocale(locale, s.labelEn, s.labelHi) || ""}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl italic text-ocean-deep md:text-5xl">
        {n}
        <span className="text-lagoon">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-light tracking-wide text-ink/60">{label}</p>
    </div>
  );
}

function Coverflow({
  title,
  subtitle,
  items,
  locale,
}: {
  title: string | null;
  subtitle: string | null;
  items: Item[];
  locale: Locale;
}) {
  // Unbounded cursor so cards slide off one side and enter the other (no teleport)
  const [cursor, setCursor] = useState(0);
  const [dir, setDir] = useState(0);
  const gap = 230;

  if (!items.length) return null;

  const go = (d: number) => {
    setDir(d);
    setCursor((c) => c + d);
  };

  const n = items.length;
  const offsets = n === 1 ? [0] : ([-1, 0, 1] as const);

  const cardVariants: Variants = {
    enter: (d: number) => ({
      x: (d >= 0 ? 1 : -1) * gap * 1.4,
      scale: 0.82,
      opacity: 0,
    }),
    exit: (d: number) => ({
      x: (d >= 0 ? -1 : 1) * gap * 1.4,
      scale: 0.8,
      opacity: 0,
    }),
  };

  const visible = offsets.map((offset) => {
    const virtual = cursor + offset;
    const item = items[((virtual % n) + n) % n];
    return { key: virtual, offset, item };
  });

  return (
    <section className="section relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a3f3e] via-[#0d2a2a] to-[#1a2528]" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-lagoon/20 blur-3xl" />
      <div className="section-inner relative">
        <SectionHead title={title} subtitle={subtitle} light />
        <div className="relative mt-10 flex items-center justify-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Previous experience"
            className="z-20 shrink-0 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-2xl backdrop-blur transition hover:bg-white/20"
            onClick={() => go(-1)}
          >
            ‹
          </button>

          <div className="relative h-[340px] w-full max-w-[760px] overflow-hidden sm:h-[380px] sm:overflow-visible">
            <AnimatePresence initial={false} custom={dir}>
              {visible.map(({ key, offset, item }) => {
                const isCenter = offset === 0;
                return (
                  <motion.div
                    key={key}
                    custom={dir}
                    variants={cardVariants}
                    initial="enter"
                    animate={{
                      x: offset * gap,
                      scale: isCenter ? 1 : 0.86,
                      opacity: isCenter ? 1 : 0.55,
                      zIndex: isCenter ? 3 : 1,
                      y: isCenter ? 0 : 14,
                    }}
                    exit="exit"
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 32,
                      mass: 0.8,
                    }}
                    className={`absolute left-1/2 top-4 w-[240px] -ml-[120px] overflow-hidden rounded-2xl bg-white text-ink shadow-2xl sm:w-[280px] sm:-ml-[140px] ${
                      !isCenter ? "pointer-events-none max-sm:!opacity-0" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className={`w-full object-cover ${isCenter ? "h-52 sm:h-56" : "h-40 sm:h-44"}`}
                      />
                    )}
                    <div className="p-4">
                      <p className="font-display text-lg italic text-ocean-deep sm:text-xl">
                        {pickLocale(locale, item.titleEn, item.titleHi)}
                      </p>
                      {item.priceLabel && (
                        <p className="mt-1 text-sm font-medium text-ocean">{item.priceLabel}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next experience"
            className="z-20 shrink-0 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-2xl backdrop-blur transition hover:bg-white/20"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

function CardCarousel({
  title,
  subtitle,
  items,
  locale,
}: {
  title: string | null;
  subtitle: string | null;
  items: Item[];
  locale: Locale;
}) {
  return (
    <section className="section">
      <div className="section-inner">
        <SectionHead title={title} subtitle={subtitle} />
        <Stagger className="mt-2 flex gap-5 overflow-x-auto pb-4 snap-x scrollbar-thin">
          {items.map((item) => (
            <StaggerItem key={item.id} className="snap-start">
              <Link href={item.linkUrl || "#"} className="media-card group block min-w-[250px] max-w-[270px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.imageUrl && (
                  <div className="overflow-hidden">
                    <img src={item.imageUrl} alt="" className="h-44 w-full object-cover" />
                  </div>
                )}
                <p className="px-4 py-3.5 font-display text-lg italic text-ocean-deep transition group-hover:text-ocean">
                  {pickLocale(locale, item.titleEn, item.titleHi)}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function PlacesRow({
  title,
  items,
  dark,
  locale,
}: {
  title: string | null;
  items: Item[];
  dark: boolean;
  locale: Locale;
}) {
  return (
    <section className={`section relative overflow-hidden ${dark ? "text-white" : ""}`}>
      {dark && <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a2e] to-[#0f3d3c]" />}
      <div className="section-inner relative">
        <SectionHead title={title} light={dark} />
        <Stagger className="mt-8 flex gap-4 overflow-x-auto pb-3">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <div className="group relative min-w-[210px] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 p-4 text-center font-display text-lg italic text-white">
                  {pickLocale(locale, item.titleEn, item.titleHi)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function DestinationsGrid({
  title,
  destinations,
  locale,
}: {
  title: string | null;
  destinations: Dest[];
  locale: Locale;
}) {
  return (
    <section className="section">
      <div className="section-inner">
        <SectionHead title={title || "Destinations"} center={false} />
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <StaggerItem key={d.id}>
              <Link href={`/destinations/${d.slug}`} className="media-card group block">
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.imageUrl || ""}
                    alt=""
                    className="h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl italic text-ocean-deep">
                    {pickLocale(locale, d.nameEn, d.nameHi)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-ink/60">
                    {d.descriptionEn}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-ocean transition group-hover:translate-x-1">
                    Explore →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function PackagesGrid({
  title,
  packages,
  locale,
}: {
  title: string | null;
  packages: Pkg[];
  locale: Locale;
}) {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-seafoam/35 to-transparent" />
      <div className="section-inner relative">
        <SectionHead title={title || "Featured Packages"} center={false} />
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
          {packages.map((p) => {
            let cover = "";
            try {
              const arr = JSON.parse(p.coverImages);
              cover = Array.isArray(arr) ? arr[0] : "";
            } catch {
              cover = "";
            }
            return (
              <StaggerItem key={p.id}>
                <Link
                  href={`/packages/${p.slug}`}
                  className="media-card group flex flex-col overflow-hidden sm:flex-row"
                >
                  <div className="overflow-hidden sm:w-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-52 w-full object-cover sm:h-full sm:min-h-[200px]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ocean">
                      {p.durationNights}N / {p.durationDays}D
                    </p>
                    <h3 className="font-display mt-1 text-2xl italic text-ocean-deep">
                      {pickLocale(locale, p.titleEn, p.titleHi)}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-ink/60">
                      {p.summaryEn}
                    </p>
                    <p className="mt-auto pt-5 font-display text-xl text-ocean-deep">
                      From {formatINR(p.priceFrom)}{" "}
                      <span className="text-sm font-sans font-normal text-ink/45">/ person</span>
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Link href="/packages" className="btn btn-primary">
            View all packages
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function YoutubeSection({
  title,
  items,
  locale,
}: {
  title: string | null;
  items: Item[];
  locale: Locale;
}) {
  return (
    <section className="section">
      <div className="section-inner">
        <SectionHead title={title || "Videos"} />
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const embed = youtubeEmbed(item.videoUrl);
            return (
              <StaggerItem key={item.id}>
                <div className="media-card overflow-hidden">
                  {embed ? (
                    <iframe
                      src={embed}
                      title={pickLocale(locale, item.titleEn, item.titleHi) || "Video"}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="aspect-video w-full object-cover" />
                  ) : null}
                  <p className="p-4 font-display text-lg italic text-ocean-deep">
                    {pickLocale(locale, item.titleEn, item.titleHi)}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function Testimonials({
  title,
  items,
  locale,
}: {
  title: string | null;
  items: Testimonial[];
  locale: Locale;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);
  const item = items[i];
  if (!item) return null;
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(26,155,148,0.12),transparent_55%)]" />
      <div className="section-inner relative max-w-3xl text-center">
        <SectionHead title={title || "Traveller stories"} />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="relative mt-10 rounded-[2rem] border border-ocean/10 bg-white/80 px-8 py-10 shadow-xl shadow-ocean-deep/5 backdrop-blur"
          >
            <span className="font-display absolute -top-4 left-8 text-6xl italic leading-none text-lagoon/30">
              “
            </span>
            <p className="font-display text-xl italic leading-relaxed text-ink/80 sm:text-2xl">
              {pickLocale(locale, item.quoteEn, item.quoteHi)}
            </p>
            <p className="mt-6 text-sm font-semibold tracking-wide text-ocean-deep">
              {item.name}
              {item.location ? ` · ${item.location}` : ""}
            </p>
            <p className="mt-1 tracking-widest text-coral">{"★".repeat(item.rating)}</p>
          </motion.blockquote>
        </AnimatePresence>
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Testimonial ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-7 bg-ocean" : "w-2 bg-ocean/25"}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogTeaser({ title, posts }: { title: string | null; posts: Blog[] }) {
  if (!posts.length) return null;
  return (
    <section className="section">
      <div className="section-inner">
        <SectionHead title={title || "From the travel guide"} center={false} />
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <StaggerItem key={p.id}>
              <Link href={`/blog/${p.slug}`} className="media-card group block">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.coverUrl && (
                    <img src={p.coverUrl} alt="" className="h-40 w-full object-cover" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ocean">
                    {p.category}
                  </p>
                  <h3 className="font-display mt-2 text-xl italic text-ocean-deep">{p.titleEn}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-light text-ink/60">{p.excerptEn}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function TripadvisorBlock({ title, embed }: { title: string | null; embed: string }) {
  return (
    <section className="section bg-seafoam/25">
      <div className="section-inner">
        <SectionHead title={title} />
        <Reveal>
          <div
            className="mx-auto mt-8 max-w-3xl overflow-auto rounded-2xl bg-white/70 p-4 shadow-lg"
            dangerouslySetInnerHTML={{ __html: embed }}
          />
        </Reveal>
      </div>
    </section>
  );
}

function FaqSection({ title, faqs, locale }: { title: string; faqs: Faq[]; locale: Locale }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section className="section">
      <div className="section-inner max-w-3xl">
        <SectionHead title={title} />
        <div className="mt-10 space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = open === f.id;
            return (
              <Reveal key={f.id} delay={idx * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-ocean/10 bg-white/80 shadow-sm backdrop-blur">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-medium text-ocean-deep"
                    onClick={() => setOpen(isOpen ? null : f.id)}
                  >
                    {pickLocale(locale, f.questionEn, f.questionHi)}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-ocean"
                    >
                      ▾
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-5 pb-4 text-sm font-light leading-relaxed text-ink/65">
                          {pickLocale(locale, f.answerEn, f.answerHi)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
