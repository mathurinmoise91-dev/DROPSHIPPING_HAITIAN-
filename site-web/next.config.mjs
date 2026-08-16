import createNextIntlPlugin from "next-intl/plugin";

/**
 * ESM rather than TypeScript on purpose: loading a TS config requires the SWC
 * native binary, which does not exist for every platform the project may be
 * edited on. The JSDoc type keeps editor completion.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  poweredByHeader: false,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
