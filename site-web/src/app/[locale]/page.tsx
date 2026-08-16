import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/site-header";
import { Link } from "@/i18n/navigation";
import {
  getCategories,
  getFeaturedShops,
  getMarketplaceStats,
} from "@/lib/catalogue";

const tileTone = [
  "bg-indigo-deep",
  "bg-copper",
  "bg-sage-deep",
  "bg-[#3b2f4d]",
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");
  const tPay = await getTranslations("payment");
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const [categories, shops, stats] = await Promise.all([
    getCategories(),
    getFeaturedShops(),
    getMarketplaceStats(),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero — full-bleed indigo carrying the cut-metal lattice. */}
        <section className="relative isolate overflow-hidden bg-indigo-deep text-on-indigo">
          <div
            aria-hidden="true"
            className="motif absolute inset-0 -z-20 opacity-15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(120%_85%_at_88%_8%,rgba(217,142,90,0.34),transparent_62%)]"
          />

          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <span className="inline-block rounded-full bg-sage px-3 py-1 text-xs font-semibold text-on-sage">
              {t("hero.badge")}
            </span>

            <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t("hero.title")}{" "}
              <span className="text-copper-lit">{t("hero.titleAccent")}</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-on-indigo/80">
              {t("hero.lede")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-lg bg-copper-lit px-6 py-3 text-center font-semibold text-indigo-deep"
              >
                {t("hero.ctaPrimary")}
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-on-indigo/40 px-6 py-3 text-center font-semibold"
              >
                {tNav("becomeSeller")}
              </Link>
            </div>

            {/* Real counters. They read zero because nothing is registered yet. */}
            <dl className="mt-11 flex flex-wrap gap-x-10 gap-y-4 border-t border-on-indigo/20 pt-7">
              <div>
                <dd className="font-display tabular text-2xl font-bold text-copper-lit">
                  {stats.shops}
                </dd>
                <dt className="text-sm text-on-indigo/65">{t("stats.shops")}</dt>
              </div>
              <div>
                <dd className="font-display tabular text-2xl font-bold text-copper-lit">
                  {stats.products}
                </dd>
                <dt className="text-sm text-on-indigo/65">
                  {t("stats.products")}
                </dt>
              </div>
              <div>
                <dd className="font-display text-2xl font-bold text-copper-lit">
                  HTG
                </dd>
                <dt className="text-sm text-on-indigo/65">
                  {t("stats.currency")}
                </dt>
              </div>
            </dl>
          </div>
        </section>

        {/* Categories as solid colour blocks: they hold the screen before a
            single photograph exists, and take real imagery later unchanged. */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("categories.title")}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href="/"
                className={`group relative isolate flex aspect-[3/2] flex-col justify-end overflow-hidden rounded-xl p-4 text-on-indigo ${tileTone[index % tileTone.length]}`}
              >
                <span
                  aria-hidden="true"
                  className="motif absolute inset-0 -z-10 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                />
                <span className="font-display font-bold">
                  {tCat(category.key)}
                </span>
                <span className="tabular text-xs opacity-85">
                  {t("categories.productCount", { count: category.productCount })}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured shops — a real empty state, not sample sellers. */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {t("shops.title")}
            </h2>
          </div>

          {shops.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-rule px-6 py-12 text-center">
              <span
                aria-hidden="true"
                className="motif mx-auto mb-4 block size-12 rounded-full bg-sage-deep opacity-90"
              />
              <p className="font-display text-lg font-semibold">
                {t("shops.emptyTitle")}
              </p>
              <p className="mt-1 text-ink-soft">{t("shops.emptyBody")}</p>
            </div>
          ) : null}
        </section>

        {/* Reassurance */}
        <section className="border-t border-rule-soft">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {t("trust.title")}
            </h2>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {t("trust.deliveryTitle")}
                </h3>
                <p className="mt-2 text-ink-soft">{t("trust.deliveryBody")}</p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {t("trust.paymentTitle")}
                </h3>
                <p className="mt-2 text-ink-soft">{t("trust.paymentBody")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-copper px-3 py-1 text-xs font-semibold text-on-copper">
                    {tPay("cod")}
                  </span>
                  {/* Not configured, so it is shown disabled rather than faked. */}
                  <span className="rounded-full border border-rule px-3 py-1 text-xs font-medium text-ink-faint">
                    MonCash · {tPay("comingSoon")}
                  </span>
                  <span className="rounded-full border border-rule px-3 py-1 text-xs font-medium text-ink-faint">
                    NatCash · {tPay("comingSoon")}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {t("trust.supportTitle")}
                </h3>
                <p className="mt-2 text-ink-soft">{t("trust.supportBody")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule-soft">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="font-display text-sm font-semibold">SITE-WEB</p>
          <p className="mt-1 text-sm text-ink-soft">{tFooter("tagline")}</p>
          <p className="mt-4 text-sm text-ink-faint">
            © {new Date().getFullYear()} SITE-WEB. {tFooter("rights")}
          </p>
        </div>
      </footer>
    </>
  );
}
