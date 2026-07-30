export type Locale = "en" | "hi";

const dict = {
  en: {
    explore: "Explore",
    planTrip: "Plan my trip",
    destinations: "Destinations",
    packages: "Packages",
    hotels: "Hotels",
    contact: "Contact",
    bookNow: "Request booking",
    inclusions: "Inclusions",
    exclusions: "Exclusions",
    includedStays: "Included stays",
    nights: "Nights",
    from: "From",
    readMore: "View details",
    faq: "FAQ",
    blog: "Travel guide",
    about: "About us",
  },
  hi: {
    explore: "खोजें",
    planTrip: "ट्रिप प्लान करें",
    destinations: "गंतव्य",
    packages: "पैकेज",
    hotels: "होटल",
    contact: "संपर्क",
    bookNow: "बुकिंग अनुरोध",
    inclusions: "शामिल",
    exclusions: "शामिल नहीं",
    includedStays: "शामिल होटल",
    nights: "रातें",
    from: "से शुरू",
    readMore: "विवरण देखें",
    faq: "प्रश्न",
    blog: "यात्रा गाइड",
    about: "हमारे बारे में",
  },
} as const;

export function t(locale: Locale, key: keyof (typeof dict)["en"]) {
  return dict[locale][key] ?? dict.en[key];
}

export function pickLocale<T extends string | null | undefined>(
  locale: Locale,
  en: T,
  hi?: T | null,
) {
  if (locale === "hi" && hi) return hi;
  return en;
}
