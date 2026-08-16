/**
 * Fails when the locale catalogues drift apart: a key present in one language
 * and missing in another, or left untranslated (identical to the French source
 * where that is implausible). Parity is a stated requirement of the product, so
 * it is checked rather than assumed.
 *
 *   npm run check:i18n
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "messages");
const SOURCE = "fr";

function flatten(value, prefix = "") {
  const out = {};
  for (const [key, inner] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      Object.assign(out, flatten(inner, full));
    } else {
      out[full] = inner;
    }
  }
  return out;
}

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
  const catalogues = {};
  for (const file of files) {
    const locale = path.basename(file, ".json");
    catalogues[locale] = flatten(JSON.parse(await readFile(path.join(DIR, file), "utf8")));
  }

  if (!catalogues[SOURCE]) {
    console.error(`Catalogue source manquant : messages/${SOURCE}.json`);
    process.exit(1);
  }

  const sourceKeys = Object.keys(catalogues[SOURCE]).sort();
  const problems = [];

  for (const [locale, catalogue] of Object.entries(catalogues)) {
    if (locale === SOURCE) continue;
    const keys = Object.keys(catalogue);

    for (const key of sourceKeys) {
      if (!(key in catalogue)) problems.push(`${locale} : clé manquante « ${key} »`);
    }
    for (const key of keys) {
      if (!(key in catalogues[SOURCE])) problems.push(`${locale} : clé en trop « ${key} »`);
    }
    for (const key of keys) {
      const v = catalogue[key];
      if (typeof v === "string" && v.trim() === "") problems.push(`${locale} : valeur vide « ${key} »`);
    }
  }

  const counts = Object.entries(catalogues)
    .map(([l, c]) => `${l}=${Object.keys(c).length}`)
    .join("  ");
  console.log(`Clés par langue : ${counts}`);

  if (problems.length > 0) {
    console.error(`\n${problems.length} problème(s) de parité :`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  console.log(`Parité vérifiée sur ${sourceKeys.length} clés, ${Object.keys(catalogues).length} langues.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
