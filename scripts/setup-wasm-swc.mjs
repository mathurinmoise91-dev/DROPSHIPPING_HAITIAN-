/**
 * Installs the WebAssembly build of SWC and places it where Next.js actually
 * looks for it. Needed on platforms with no native SWC binary — Android/Termux
 * and 32-bit ARM, whose targets Next dropped after v13 and v12 respectively.
 *
 * Two things make this less obvious than it sounds.
 *
 * 1. `npm install @next/swc-wasm-nodejs` is not enough. Next does not resolve
 *    the WASM binding as an npm module: in next/dist/build/swc/index.js it calls
 *    `pathToFileURL(pkgPath)`, treating the name as a *file path*, so a package
 *    in node_modules/@next/ is never found. Its own fallback downloads into
 *    node_modules/next/wasm/, and when that download fails the loader still
 *    reports "Attempted to load @next/swc-wasm-nodejs, but it was not
 *    installed" — while the package sits installed a directory away.
 *
 * 2. npm itself is avoided here. npm 12 enforces an allowScripts policy and
 *    refuses project-scoped installs with EALLOWSCRIPTS on some setups, and any
 *    npm install risks rewriting package-lock.json, whose dirty state then
 *    blocks `git pull`. This package ships no install scripts, so fetching the
 *    tarball and extracting it is both sufficient and side-effect free.
 *
 * Requires `tar`, present on Termux, Linux, macOS and Windows 10+.
 *
 *   npm run setup:wasm
 *   npm run dev:webpack     # the WASM binding only works under webpack
 */

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PKG = "@next/swc-wasm-nodejs";
const NPM_INSTALLED = path.join(ROOT, "node_modules", PKG);
const TARGET = path.join(ROOT, "node_modules", "next", "wasm", "@next", "swc-wasm-nodejs");

const force = process.argv.includes("--force");

async function nextVersion() {
  const pkg = JSON.parse(
    await readFile(path.join(ROOT, "node_modules", "next", "package.json"), "utf8"),
  );
  return pkg.version;
}

function haveTar() {
  try {
    execFileSync("tar", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function installedVersion(dir) {
  try {
    const pkg = JSON.parse(await readFile(path.join(dir, "package.json"), "utf8"));
    return pkg.version;
  } catch {
    return undefined;
  }
}

async function downloadAndExtract(version, destination) {
  const metaUrl = `https://registry.npmjs.org/${PKG.replace("/", "%2F")}/${version}`;
  const meta = await fetch(metaUrl);
  if (!meta.ok) {
    throw new Error(`métadonnées npm indisponibles (HTTP ${meta.status}) : ${metaUrl}`);
  }
  const { dist } = await meta.json();

  console.log(`Téléchargement de ${dist.tarball} …`);
  const response = await fetch(dist.tarball);
  if (!response.ok) throw new Error(`téléchargement échoué (HTTP ${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());
  console.log(`  ${Math.round(buffer.length / 1024 / 1024)} Mo reçus.`);

  const staging = path.join(os.tmpdir(), `swc-wasm-${process.pid}`);
  await mkdir(staging, { recursive: true });
  const tarball = path.join(staging, "package.tgz");
  await writeFile(tarball, buffer);

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  // npm tarballs nest everything under package/, hence --strip-components=1.
  execFileSync("tar", ["-xzf", tarball, "-C", destination, "--strip-components=1"], {
    stdio: "inherit",
  });
  await rm(staging, { recursive: true, force: true });
}

async function main() {
  const version = await nextVersion();
  console.log(`Next.js ${version} détecté.`);

  if (!force && (await installedVersion(TARGET)) === version) {
    console.log(`${path.relative(ROOT, TARGET)} est déjà à la bonne version.`);
    console.log("\nLancez : npm run dev:webpack");
    return;
  }

  // The WASM build must match the Next version exactly, or the bindings differ.
  if ((await installedVersion(NPM_INSTALLED)) === version) {
    console.log(`Copie depuis node_modules/${PKG} (déjà présent, bonne version)…`);
    await rm(TARGET, { recursive: true, force: true });
    await mkdir(path.dirname(TARGET), { recursive: true });
    await cp(NPM_INSTALLED, TARGET, { recursive: true });
  } else {
    if (!haveTar()) {
      console.error("\nÉchec : la commande `tar` est introuvable.");
      console.error("Sur Termux : pkg install tar");
      process.exit(1);
    }
    await downloadAndExtract(version, TARGET);
  }

  if (!existsSync(path.join(TARGET, "wasm.js"))) {
    console.error(`\nÉchec : ${path.relative(ROOT, TARGET)}/wasm.js est absent.`);
    process.exit(1);
  }

  console.log(`\nPrêt : ${path.relative(ROOT, TARGET)}`);
  console.log("Lancez maintenant : npm run dev:webpack");
  console.log("\nTurbopack ne sait pas utiliser le WASM, d'où le suffixe :webpack.");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
