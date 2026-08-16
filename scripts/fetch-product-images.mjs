/**
 * Downloads already-generated product images into public/products/ and writes
 * the manifest the storefront reads.
 *
 * This is the second half of the image pipeline. Generation happens through the
 * Higgsfield MCP connector (or scripts/generate-product-images.mjs), which
 * records each result URL in src/lib/product-sources.json. This script only
 * fetches those URLs, so it needs no API key and costs nothing to run.
 *
 * It exists because generation and download do not always happen in the same
 * place: some environments can reach the Higgsfield API but not its CDN.
 *
 * Usage:
 *   npm run fetch:images
 *   npm run fetch:images -- --force   # re-download files that already exist
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sources from "../src/lib/product-sources.json" with { type: "json" };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "products");
const MANIFEST = path.join(ROOT, "src", "lib", "product-images.json");

const force = process.argv.includes("--force");

async function main() {
  const entries = Object.entries(sources);
  if (entries.length === 0) {
    console.log("src/lib/product-sources.json est vide, rien à télécharger.");
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  const failures = [];

  for (const [id, url] of entries) {
    // Keep the CDN's extension so the bytes are never mislabelled.
    const extension = path.extname(new URL(url).pathname) || ".png";
    const filename = `${id}${extension}`;
    const destination = path.join(OUT_DIR, filename);
    manifest[id] = `/products/${filename}`;

    if (!force && existsSync(destination)) {
      console.log(`= ${filename} (déjà présent)`);
      continue;
    }

    process.stdout.write(`→ ${filename} … `);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await writeFile(destination, buffer);
      console.log(`ok (${Math.round(buffer.length / 1024)} Ko)`);
    } catch (error) {
      console.log(`échec : ${error.message}`);
      failures.push({ id, message: error.message });
      delete manifest[id];
    }
  }

  const ordered = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  await writeFile(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`\nManifeste écrit : ${path.relative(ROOT, MANIFEST)}`);

  if (failures.length > 0) {
    console.error(`\n${failures.length} échec(s) :`);
    for (const f of failures) console.error(`  - ${f.id} : ${f.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
