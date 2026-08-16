import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Next 16 renamed the `middleware` file convention to `proxy`. next-intl still
 * exports its handler under the old name, which is only the factory's name —
 * what matters here is the default export and the file it lives in.
 *
 * This resolves the visitor's locale, redirecting `/` to `/fr` and honouring
 * the Accept-Language header for first-time visitors.
 */
const handleLocale = createMiddleware(routing);

export default handleLocale;

export const config = {
  // Everything except Next internals, the API surface, and files with an
  // extension (images, fonts, manifest, robots.txt…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
