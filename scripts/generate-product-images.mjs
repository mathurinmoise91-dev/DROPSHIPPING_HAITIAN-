/**
 * Generates product images through the Higgsfield API and writes them to
 * public/products/, plus a manifest the storefront reads.
 *
 * Uses @higgsfield/client (pure JS) rather than the Higgsfield CLI, because the
 * CLI ships as a prebuilt binary for darwin/linux on x64/arm64 only and cannot
 * run on Android/Termux. The SDK authenticates with an API key, so there is no
 * browser OAuth step either.
 *
 * Credentials, either form:
 *   export HF_API_KEY=<key_id>
 *   export HF_API_SECRET=<key_secret>
 * or
 *   export HF_CREDENTIALS=<key_id>:<key_secret>
 *
 * Usage:
 *   node --experimental-strip-types scripts/generate-product-images.mjs           # dry run
 *   node --experimental-strip-types scripts/generate-product-images.mjs --yes     # spends credits
 *   ... --only casque-bluetooth-pro --yes
 *   ... --force --yes        # regenerate images that already exist
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { HiggsfieldClient, SoulSize, SoulQuality, BatchSize } from "@higgsfield/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "products");
const MANIFEST = path.join(ROOT, "src", "lib", "product-images.json");

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const flagValue = (f) => {
  const i = args.indexOf(f);
  return i !== -1 ? args[i + 1] : undefined;
};

const confirmed = hasFlag("--yes");
const force = hasFlag("--force");
const only = flagValue("--only");

/**
 * Square, because the product card reserves a 1:1 slot. Matching the ratio at
 * generation time avoids cropping and layout shift.
 */
const SIZE = SoulSize.SQUARE_1536x1536;

function buildPrompt(product) {
  return [
    `Professional e-commerce product photograph of ${product.name.toLowerCase()}`,
    `category: ${product.category.toLowerCase()}`,
    "centered on a clean white seamless background",
    "soft even studio lighting, subtle shadow beneath the product",
    "sharp focus, high detail, true-to-life colors",
    "no text, no watermark, no logo, no people",
  ].join(", ");
}

function credentialsPresent() {
  if (process.env.HF_API_KEY && process.env.HF_API_SECRET) return true;
  const combined = process.env.HF_CREDENTIALS || process.env.HF_KEY;
  return Boolean(combined && combined.includes(":"));
}

function resolveCredentials() {
  if (process.env.HF_API_KEY && process.env.HF_API_SECRET) {
    return {
      apiKey: process.env.HF_API_KEY,
      apiSecret: process.env.HF_API_SECRET,
    };
  }
  const combined = process.env.HF_CREDENTIALS || process.env.HF_KEY;
  const [apiKey, apiSecret] = combined.split(":");
  return { apiKey, apiSecret };
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`téléchargement échoué (${response.status}) pour ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
  return buffer.length;
}

async function main() {
  const { products } = await import("../src/lib/products.ts");

  let targets = products;
  if (only) {
    targets = products.filter((p) => p.id === only);
    if (targets.length === 0) {
      console.error(`Aucun produit avec l'id "${only}".`);
      console.error(`Ids disponibles : ${products.map((p) => p.id).join(", ")}`);
      process.exit(1);
    }
  }

  const manifest = await readManifest();
  if (!force) {
    targets = targets.filter((p) => {
      const known = manifest[p.id];
      return !(known && existsSync(path.join(ROOT, "public", known.replace(/^\//, ""))));
    });
  }

  if (targets.length === 0) {
    console.log("Rien à générer : toutes les images existent déjà. --force pour refaire.");
    return;
  }

  console.log(`${targets.length} image(s) à générer, ${SIZE}, qualité ${SoulQuality.HD} :`);
  for (const p of targets) console.log(`  - ${p.id}`);

  if (!confirmed) {
    console.log("");
    console.log("Simulation. Chaque image consomme des crédits Higgsfield.");
    console.log("Relance avec --yes pour générer réellement.");
    return;
  }

  if (!credentialsPresent()) {
    console.error("");
    console.error("Identifiants absents.");
    console.error("  export HF_API_KEY=<key_id> && export HF_API_SECRET=<key_secret>");
    console.error("  ou export HF_CREDENTIALS=<key_id>:<key_secret>");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const client = new HiggsfieldClient(resolveCredentials());
  const failures = [];

  try {
    for (const product of targets) {
      process.stdout.write(`→ ${product.id} … `);
      try {
        const jobSet = await client.generate(
          "/v1/text2image/soul",
          {
            prompt: buildPrompt(product),
            width_and_height: SIZE,
            quality: SoulQuality.HD,
            batch_size: BatchSize.SINGLE,
          },
          { withPolling: true },
        );

        if (jobSet.isNsfw) throw new Error("rejeté par le filtre NSFW");
        if (jobSet.isFailed) throw new Error("génération échouée côté Higgsfield");

        const url = jobSet.jobs?.[0]?.results?.raw?.url;
        if (!url) throw new Error("aucune image dans la réponse");

        const extension = path.extname(new URL(url).pathname) || ".jpg";
        const filename = `${product.id}${extension}`;
        const bytes = await download(url, path.join(OUT_DIR, filename));

        manifest[product.id] = `/products/${filename}`;
        console.log(`ok (${Math.round(bytes / 1024)} Ko)`);
      } catch (error) {
        console.log(`échec : ${error.message}`);
        failures.push({ id: product.id, message: error.message });
      }
    }
  } finally {
    client.close();
  }

  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
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
