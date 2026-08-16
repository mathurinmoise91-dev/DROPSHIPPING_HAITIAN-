/**
 * Kept as .mjs rather than .ts on purpose: loading a TypeScript config requires
 * the SWC native binary, which is unavailable on some platforms (Android/Termux,
 * 32-bit ARM). Plain ESM loads everywhere, and the JSDoc type keeps editor
 * completion and type checking.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

export default nextConfig;
