/**
 * One-shot image optimizer for park-armada.ru (T2).
 * Run: node scripts/optimize-images.mjs
 * Then rename *.opt.webp → target names after visual check.
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../public/images");

const jobs = [
  { file: "taxi-premium-hero.webp", out: "taxi-premium-hero", w: 1600, q: 74 },
  {
    file: "delivery-premium-hero.webp",
    out: "delivery-premium-hero",
    w: 1600,
    q: 74,
  },
  {
    file: "legal-documents-hero.webp",
    out: "legal-documents-hero",
    w: 1600,
    q: 74,
  },
  { file: "trust-city.jpg", out: "trust-city", w: 1600, q: 74 },
  { file: "taxi-premium-hero.webp", out: "taxi-card", w: 1200, q: 70 },
  { file: "delivery-premium-hero.webp", out: "delivery-card", w: 1200, q: 70 },
  { file: "legal-documents-hero.webp", out: "legal-card", w: 1200, q: 70 },
];

for (const j of jobs) {
  const from = path.join(SRC, j.file);
  const to = path.join(SRC, `${j.out}.opt.webp`);
  await sharp(from)
    .resize({ width: j.w, withoutEnlargement: true })
    .webp({ quality: j.q })
    .toFile(to);
  console.log(j.file, "->", to);
}
