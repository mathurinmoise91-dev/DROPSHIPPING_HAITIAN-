import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Gourdes everywhere. Prices are formatted from one place so a page can
    // never invent its own currency rendering.
    formats: {
      number: {
        gourde: {
          style: "currency",
          currency: "HTG",
          maximumFractionDigits: 0,
        },
      },
    },
  };
});
