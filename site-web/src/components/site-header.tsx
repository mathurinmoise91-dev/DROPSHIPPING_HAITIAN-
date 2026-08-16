import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");

  return (
    <header className="sticky top-0 z-40 border-b border-rule-soft bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight whitespace-nowrap"
        >
          SITE<span className="text-copper">-WEB</span>
        </Link>

        <nav
          aria-label={t("primaryLabel")}
          className="hidden items-center gap-1 lg:flex"
        >
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            {t("home")}
          </Link>
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
          >
            {t("explore")}
          </Link>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Search is a primary action in a marketplace, so it stays on screen at
          every width — on its own row below the bar on small screens. */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-3 sm:px-6 lg:hidden lg:px-8">
        <form role="search" action="/" className="relative">
          <label htmlFor="q-mobile" className="sr-only">
            {tSearch("label")}
          </label>
          <input
            id="q-mobile"
            name="q"
            type="search"
            placeholder={tSearch("placeholder")}
            className="h-11 w-full rounded-lg border border-rule bg-raised px-3 text-base text-ink placeholder:text-ink-faint"
          />
        </form>
      </div>
    </header>
  );
}
