"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";

/**
 * Switches language on the current route rather than sending the visitor home,
 * and does it through a transition so the page is never fully reloaded.
 */
export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as Locale;
          startTransition(() => router.replace(pathname, { locale: next }));
        }}
        className="cursor-pointer appearance-none rounded-md border border-rule bg-transparent py-1.5 pr-7 pl-2.5 text-sm font-medium text-ink disabled:opacity-60"
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {localeNames[value]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-2 size-3 fill-none stroke-current stroke-2 opacity-60"
      >
        <path d="M3 4.5 6 7.5 9 4.5" />
      </svg>
    </label>
  );
}
