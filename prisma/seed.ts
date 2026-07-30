import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbPath }),
});

const img = {
  hero: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1600&q=80",
  beach1: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
  beach2: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
  island: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  scuba: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1200&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  room: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
  neil: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80",
  jail: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb831?w=1200&q=80",
};

async function main() {
  await prisma.packageStay.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.package.deleteMany();
  await prisma.sectionItem.deleteMany();
  await prisma.homeSection.deleteMany();
  await prisma.navLink.deleteMany();
  await prisma.navColumn.deleteMany();
  await prisma.navItem.deleteMany();
  await prisma.statItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.legalPage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.siteSettings.deleteMany();

  await prisma.siteSettings.create({
    data: {
      id: 1,
      brandName: "Andaman Ecstasy Pvt Ltd",
      tagline: "Let your soul discover Andaman… an island of God…",
      heroHeadline: "Islands that stay with you",
      heroSupport:
        "Private escapes, family holidays, and diving adventures across Havelock, Neil & Port Blair.",
      heroImageUrl: img.hero,
      companyAddress: "Port Blair, Andaman & Nicobar Islands, India",
      gstin: "35AAAAA0000A1Z5",
      metaTitle: "Andaman Ecstasy Pvt Ltd | Andaman Tours & Holidays",
      metaDescription:
        "Plan your Andaman trip with Andaman Ecstasy — packages, hotels, scuba & island hopping.",
      mapEmbedUrl:
        "https://maps.google.com/maps?q=Port%20Blair&t=&z=12&ie=UTF8&iwloc=&output=embed",
    },
  });

  const packagesNav = await prisma.navItem.create({
    data: {
      labelEn: "Packages",
      labelHi: "पैकेज",
      href: "/packages",
      sortOrder: 1,
      columns: {
        create: [
          {
            titleEn: "By style",
            titleHi: "शैली",
            sortOrder: 0,
            links: {
              create: [
                { labelEn: "Honeymoon", href: "/packages", sortOrder: 0 },
                { labelEn: "Family", href: "/packages", sortOrder: 1 },
                { labelEn: "Adventure", href: "/packages", sortOrder: 2 },
              ],
            },
          },
        ],
      },
    },
  });
  void packagesNav;

  await prisma.navItem.createMany({
    data: [
      { labelEn: "Destinations", labelHi: "गंतव्य", href: "/destinations", sortOrder: 2 },
      { labelEn: "Hotels", labelHi: "होटल", href: "/hotels", sortOrder: 3 },
      { labelEn: "Plan my trip", labelHi: "ट्रिप प्लान करें", href: "/plan-my-trip", sortOrder: 4 },
      { labelEn: "Blog", labelHi: "ब्लॉग", href: "/blog", sortOrder: 5 },
      { labelEn: "Contact", labelHi: "संपर्क", href: "/contact", sortOrder: 6 },
    ],
  });

  await prisma.statItem.createMany({
    data: [
      { value: 2500, suffix: "+", labelEn: "Happy clients", labelHi: "खुश ग्राहक", sortOrder: 0 },
      { value: 2012, suffix: "", labelEn: "Serving since", labelHi: "से सेवा", sortOrder: 1 },
      { value: 180, suffix: "+", labelEn: "Tours", labelHi: "टूर्स", sortOrder: 2 },
      { value: 4, suffix: "", labelEn: "Islands", labelHi: "द्वीप", sortOrder: 3 },
    ],
  });

  const havelock = await prisma.destination.create({
    data: {
      slug: "havelock",
      nameEn: "Havelock (Swaraj Dweep)",
      nameHi: "हैवलॉक",
      descriptionEn:
        "Turquoise lagoons, Radhanagar Beach sunsets, and world-class diving.",
      imageUrl: img.beach1,
      sortOrder: 0,
    },
  });
  const neil = await prisma.destination.create({
    data: {
      slug: "neil-island",
      nameEn: "Neil Island (Shaheed Dweep)",
      nameHi: "नील द्वीप",
      descriptionEn: "Quiet beaches, natural bridges, and slow island mornings.",
      imageUrl: img.neil,
      sortOrder: 1,
    },
  });
  const portBlair = await prisma.destination.create({
    data: {
      slug: "port-blair",
      nameEn: "Port Blair",
      nameHi: "पोर्ट ब्लेयर",
      descriptionEn: "Gateway to the islands — history, markets, and ferries.",
      imageUrl: img.jail,
      sortOrder: 2,
    },
  });

  const hotelA = await prisma.hotel.create({
    data: {
      slug: "sea-shell-havelock",
      nameEn: "Sea Shell Havelock",
      descriptionEn: "Beachside stay steps from the lagoon, ideal for couples and families.",
      amenities: JSON.stringify(["Breakfast", "Wi‑Fi", "Pool", "Transfer"]),
      images: JSON.stringify([img.hotel, img.beach1]),
      destinationId: havelock.id,
      islandLabel: "Havelock",
      rooms: {
        create: [
          {
            nameEn: "Deluxe Sea View",
            bed: "King",
            occupancy: 2,
            priceHint: 6500,
            images: JSON.stringify([img.room]),
            descriptionEn: "Private balcony overlooking the water.",
          },
          {
            nameEn: "Garden Cottage",
            bed: "Queen",
            occupancy: 3,
            priceHint: 5200,
            images: JSON.stringify([img.hotel]),
            descriptionEn: "Cottages tucked among tropical gardens.",
          },
        ],
      },
    },
    include: { rooms: true },
  });

  const hotelB = await prisma.hotel.create({
    data: {
      slug: "coral-reef-neil",
      nameEn: "Coral Reef Neil",
      descriptionEn: "Relaxed Neil Island stay near Bharatpur Beach.",
      amenities: JSON.stringify(["Breakfast", "AC", "Scooter rental"]),
      images: JSON.stringify([img.neil, img.island]),
      destinationId: neil.id,
      islandLabel: "Neil Island",
      rooms: {
        create: [
          {
            nameEn: "Standard Room",
            bed: "Double",
            occupancy: 2,
            priceHint: 3800,
            images: JSON.stringify([img.room]),
          },
        ],
      },
    },
    include: { rooms: true },
  });

  void portBlair;

  const pkg = await prisma.package.create({
    data: {
      slug: "andaman-escape",
      titleEn: "Andaman Escape",
      titleHi: "अंडमान एस्केप",
      summaryEn: "Port Blair · Havelock · Neil — 4N/5D classic circuit.",
      descriptionEn:
        "A balanced island hop with ferries, sightseeing, and beach time. Perfect first trip to Andaman.",
      durationNights: 4,
      durationDays: 5,
      priceFrom: 24999,
      coverImages: JSON.stringify([img.beach1, img.island, img.neil]),
      itineraryJson: JSON.stringify([
        { day: 1, title: "Arrive Port Blair", body: "Airport pickup, Cellular Jail light show." },
        { day: 2, title: "Ferry to Havelock", body: "Radhanagar Beach sunset." },
        { day: 3, title: "Havelock leisure", body: "Optional scuba or Elephant Beach." },
        { day: 4, title: "Neil Island", body: "Natural bridge & Bharatpur." },
        { day: 5, title: "Return & depart", body: "Ferry to Port Blair, airport drop." },
      ]),
      inclusionsEn: "Stay with breakfast\nFerry tickets\nAirport transfers\nSightseeing as per itinerary",
      exclusionsEn: "Flights\nLunch & dinner\nScuba & water sports\nPersonal expenses",
      featured: true,
      sortOrder: 0,
      stays: {
        create: [
          {
            hotelId: hotelA.id,
            roomId: hotelA.rooms[0].id,
            nightsFrom: 2,
            nightsTo: 3,
            sortOrder: 0,
          },
          {
            hotelId: hotelB.id,
            roomId: hotelB.rooms[0].id,
            nightsFrom: 4,
            nightsTo: 4,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.package.create({
    data: {
      slug: "island-explorer",
      titleEn: "Island Explorer",
      summaryEn: "6N/7D deeper Andaman with extra beach days.",
      descriptionEn: "More time in Havelock and Neil for divers and slow travellers.",
      durationNights: 6,
      durationDays: 7,
      priceFrom: 34999,
      coverImages: JSON.stringify([img.scuba, img.beach2]),
      inclusionsEn: "Stay with breakfast\nFerries\nTransfers",
      exclusionsEn: "Flights\nOptional activities",
      featured: true,
      sortOrder: 1,
    },
  });

  const carousel = await prisma.homeSection.create({
    data: {
      type: "carousel",
      titleEn: "Island moments",
      sortOrder: 0,
      items: {
        create: [
          { imageUrl: img.beach1, titleEn: "Radhanagar", sortOrder: 0 },
          { imageUrl: img.island, titleEn: "Aerial reefs", sortOrder: 1 },
          { imageUrl: img.scuba, titleEn: "Underwater", sortOrder: 2 },
          { imageUrl: img.neil, titleEn: "Neil shores", sortOrder: 3 },
        ],
      },
    },
  });

  await prisma.homeSection.create({
    data: { type: "stats", titleEn: "Trusted island hosts", sortOrder: 1 },
  });
  await prisma.homeSection.create({
    data: {
      type: "coverflow",
      titleEn: "Experiences",
      subtitleEn: "Add-on adventures for every traveller",
      sortOrder: 2,
      items: {
        create: [
          {
            titleEn: "Scuba Diving in North Bay",
            imageUrl: img.scuba,
            priceLabel: "Starting at ₹3,500",
            sortOrder: 0,
          },
          {
            titleEn: "Sea Walk",
            imageUrl: img.beach2,
            priceLabel: "Starting at ₹3,500",
            sortOrder: 1,
          },
          {
            titleEn: "Kayaking",
            imageUrl: img.island,
            priceLabel: "Starting at ₹2,000",
            sortOrder: 2,
          },
        ],
      },
    },
  });
  await prisma.homeSection.create({
    data: {
      type: "card_carousel",
      titleEn: "Popular Beaches",
      subtitleEn: "Explore the top beaches in Andaman Islands",
      sortOrder: 3,
      items: {
        create: [
          { titleEn: "Radhanagar Beach", imageUrl: img.beach1, linkUrl: "/destinations/havelock", sortOrder: 0 },
          { titleEn: "Elephant Beach", imageUrl: img.beach2, linkUrl: "/destinations/havelock", sortOrder: 1 },
          { titleEn: "Jolly Buoy Island", imageUrl: img.island, linkUrl: "/destinations/port-blair", sortOrder: 2 },
        ],
      },
    },
  });
  await prisma.homeSection.create({
    data: {
      type: "places_row",
      titleEn: "Places to Visit",
      theme: "dark",
      sortOrder: 4,
      items: {
        create: [
          { titleEn: "Radhanagar Beach", imageUrl: img.beach1, sortOrder: 0 },
          { titleEn: "Elephant Beach", imageUrl: img.beach2, sortOrder: 1 },
          { titleEn: "Jolly Buoy Island", imageUrl: img.island, sortOrder: 2 },
          { titleEn: "Cellular Jail", imageUrl: img.jail, sortOrder: 3 },
          { titleEn: "North Bay Island", imageUrl: img.scuba, sortOrder: 4 },
        ],
      },
    },
  });
  await prisma.homeSection.create({ data: { type: "destinations", titleEn: "Destinations", sortOrder: 5 } });
  await prisma.homeSection.create({ data: { type: "packages", titleEn: "Featured Packages", sortOrder: 6 } });
  await prisma.homeSection.create({
    data: {
      type: "youtube",
      titleEn: "Traveller stories",
      sortOrder: 7,
      items: {
        create: [
          {
            titleEn: "Andaman family trip",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            imageUrl: img.beach1,
            sortOrder: 0,
          },
        ],
      },
    },
  });
  await prisma.homeSection.create({ data: { type: "testimonials", titleEn: "What our travellers say", sortOrder: 8 } });
  await prisma.homeSection.create({ data: { type: "faq", titleEn: "FAQ", sortOrder: 9 } });
  await prisma.homeSection.create({
    data: { type: "blog_teaser", titleEn: "From the travel guide", sortOrder: 10 },
  });
  void carousel;
  void pkg;

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Rohan & Priya",
        location: "Bangalore",
        quoteEn:
          "Our trip was magical. Andaman Ecstasy handled ferries, hotels, and every detail perfectly.",
        rating: 5,
        sortOrder: 0,
      },
      {
        name: "Ananya S.",
        location: "Chennai",
        quoteEn: "Best planned honeymoon — clear itinerary PDF and quick WhatsApp support.",
        rating: 5,
        sortOrder: 1,
      },
      {
        name: "Vikram Mehta",
        location: "Delhi",
        quoteEn: "Scuba day was unforgettable. Transparent pricing and lovely stays.",
        rating: 5,
        sortOrder: 2,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        questionEn: "Can we customise our tour package?",
        answerEn:
          "Yes. Andaman Ecstasy specialises in custom itineraries — hotels, activities, and pace tailored to you.",
        sortOrder: 0,
      },
      {
        questionEn: "How many days should I plan for Andaman?",
        answerEn: "Most first-timers love 5–7 days covering Port Blair, Havelock, and Neil.",
        sortOrder: 1,
      },
      {
        questionEn: "Are you based in the Andaman Islands?",
        answerEn: "Yes — we operate from Port Blair and work with trusted island partners.",
        sortOrder: 2,
      },
    ],
  });

  await prisma.legalPage.createMany({
    data: [
      {
        slug: "privacy",
        titleEn: "Privacy Policy",
        bodyEn: "We collect contact details only to plan and communicate about your Andaman trip. We do not sell your data.",
      },
      {
        slug: "terms",
        titleEn: "Terms & Conditions",
        bodyEn: "Bookings are subject to ferry and hotel availability. Prices may change until confirmed.",
      },
      {
        slug: "cancellation",
        titleEn: "Cancellation & Refund Policy",
        bodyEn:
          "Cancellations 15+ days before travel: partial refund after costs. Within 7 days: non-refundable components apply. Full terms shared on confirmation.",
      },
      {
        slug: "travel-tips",
        titleEn: "Travel tips & documents",
        bodyEn:
          "Carry a government photo ID for all travellers. Ferries require advance booking in peak season. Foreign nationals should check current entry rules. Pack reef-safe sunscreen, light cottons, and swimwear.",
      },
      {
        slug: "about",
        titleEn: "About Andaman Ecstasy",
        bodyEn:
          "Andaman Ecstasy Pvt Ltd crafts soulful island journeys — from first-time family trips to dive-focused escapes. Tagline: Let your soul discover Andaman… an island of God…",
      },
    ],
  });

  await prisma.blogPost.create({
    data: {
      slug: "best-time-to-visit-andaman",
      titleEn: "Best time to visit Andaman",
      excerptEn: "Weather, ferries, and diving seasons explained.",
      bodyEn:
        "October to May is ideal for beaches and water sports. Monsoon months are greener but ferry schedules can be weather-dependent.",
      coverUrl: img.beach1,
      category: "Travel tips",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete — Andaman Ecstasy sample data ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
