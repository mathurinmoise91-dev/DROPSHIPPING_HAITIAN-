import { defineRouting } from "next-intl/routing";

/**
 * Kreyòl ayisyen is a first-class locale here, not an afterthought: `ht` is the
 * language most buyers actually speak, while `fr` stays the default because it
 * is the language of commerce and administration in Haiti.
 */
export const locales = ["fr", "ht", "en"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ht: "Kreyòl",
  en: "English",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  // The default locale keeps a visible prefix so every language has one stable,
  // shareable URL shape — /fr/…, /ht/…, /en/… — which also keeps hreflang honest.
  localePrefix: "always",
});
