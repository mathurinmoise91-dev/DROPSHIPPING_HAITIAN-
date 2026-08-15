/**
 * Installs the WebAssembly build of SWC and places it where Next.js actually
 * looks for it. Needed on platforms with no native SWC binary — Android/Termux
 * and 32-bit ARM, whose targets Next dropped after v13 and v12 respectively.
 *
 * Why the plain `npm install @next/swc-wasm-nodejs` is not enough: Next does not
 * resolve the WASM binding as an npm module. In next/dist/build/swc/index.js it
 * calls `pathToFileURL(pkgPath)`, i.e. it treats the name as a *file path*, so a
 * package sitting in node_modules/@next/ is never found. Its own fallback
 * downloads the package into node_modules/next/wasm/ instead, and when that
 * download fails the loader reports "Attempted to load @next/swc-wasm-nodejs,
 * but it was not installed" even though the package is installed.
 *
 * So this script copies the package into node_modules/next/wasm/@next/, which
 * removes the network step entirely. Verified: with that directory populated and
 * the download cache cleared, the build compiles and no download is attempted.
 *
 * Re-run it after any `npm install`, which prunes the unsaved package.
 *
 *   npm run setup:wasm
 *   npm run dev:webpack     # the WASM binding only works under webpack
 */

import { cp, mkdir, rm, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PKG = "@next/swc-wasm-nodejs";
const INSTALLED = path.join(ROOT, "node_modules", PKG);
const TARGET = path.join(ROOT, "node_modules", "next", "wasm", "@next", "swc-wasm-nodejs");

async function nextVersion() {
  const pkg = JSON.parse(
    await readFile(path.join(ROOT, "node_modules", "next", "package.json"), "utf8"),
  );
  return pkg.version;
}

async function main() {
  const version = await nextVersion();
  console.log(`Next.js ${version} détecté.`);

  // The WASM build must match the Next version exactly, or the bindings differ.
  console.log(`Installation de ${PKG}@${version} (~29 Mo)…`);
  // --no-package-lock matters as much as --no-save: without it npm rewrites
  // package-lock.json, and the dirty file blocks the next `git pull`.
  execFileSync(
    "npm",
    ["install", "--no-save", "--no-package-lock", `${PKG}@${version}`],
    { cwd: ROOT, stdio: "inherit" },
  );

  if (!existsSync(path.join(INSTALLED, "wasm.js"))) {
    console.error(`\nÉchec : ${PKG} est absent de node_modules après l'installation.`);
    process.exit(1);
  }

  console.log(`Copie vers ${path.relative(ROOT, TARGET)}…`);
  await rm(TARGET, { recursive: true, force: true });
  await mkdir(path.dirname(TARGET), { recursive: true });
  await cp(INSTALLED, TARGET, { recursive: true });

  if (!existsSync(path.join(TARGET, "wasm.js"))) {
    console.error("\nÉchec : la copie n'a pas abouti.");
    process.exit(1);
  }

  console.log("\nPrêt. Lancez maintenant :");
  console.log("  npm run dev:webpack");
  console.log("\nTurbopack ne sait pas utiliser le WASM, d'où le suffixe :webpack.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
