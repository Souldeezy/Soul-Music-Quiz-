import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { articleProfiles } from "../data/news/articleProfiles.js";

const articles = Object.values(articleProfiles);
const failures = [];
const entries = [];

function collectEditorialText(value, key = "") {
  if (typeof value === "string") return key === "href" ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((item) => collectEditorialText(item));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([childKey, child]) => collectEditorialText(child, childKey));
}

function countWords(value) {
  return collectEditorialText(value)
    .join(" ")
    .match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length || 0;
}

function editorialWordCounts(article) {
  const sections = article.blocks
    .filter((block) => block.type === "paragraphs")
    .map((block) => countWords(block.items));
  return {
    intro: countWords(article.intro),
    sections,
    outro: countWords(article.outro),
    total: countWords([article.intro, ...article.blocks.filter((block) => block.type === "paragraphs").map((block) => block.items), article.outro]),
  };
}

async function perceptualHash(filePath) {
  const { data } = await sharp(filePath).rotate().resize(32, 32, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const pixels = Array.from({ length: 32 }, (_, y) => Array.from({ length: 32 }, (_, x) => data[y * 32 + x]));
  const coeffs = [];
  for (let v = 0; v < 8; v += 1) {
    for (let u = 0; u < 8; u += 1) {
      let sum = 0;
      for (let y = 0; y < 32; y += 1) {
        for (let x = 0; x < 32; x += 1) {
          sum += pixels[y][x] * Math.cos(((2 * x + 1) * u * Math.PI) / 64) * Math.cos(((2 * y + 1) * v * Math.PI) / 64);
        }
      }
      coeffs.push(sum);
    }
  }
  const median = [...coeffs.slice(1)].sort((a, b) => a - b)[31];
  return coeffs.slice(1).reduce((bits, value, index) => bits | ((value > median ? 1n : 0n) << BigInt(index)), 0n);
}

function hammingDistance(a, b) {
  let bits = a ^ b;
  let count = 0;
  while (bits) {
    count += Number(bits & 1n);
    bits >>= 1n;
  }
  return count;
}

for (const article of articles) {
  const counts = editorialWordCounts(article);
  if (counts.total < 750 || counts.total > 1000) failures.push(`BODY_WORDCOUNT ${counts.total} (intro ${counts.intro}, sections ${counts.sections.join("/")}, outro ${counts.outro}): ${article.slug}`);
  if (counts.intro < 80 || counts.intro > 150) failures.push(`INTRO_WORDCOUNT ${counts.intro}: ${article.slug}`);
  if (counts.outro < 50 || counts.outro > 100) failures.push(`OUTRO_WORDCOUNT ${counts.outro}: ${article.slug}`);
  counts.sections.forEach((sectionCount, index) => {
    if (sectionCount < 140) failures.push(`SECTION_WORDCOUNT ${sectionCount} (section ${index + 1}): ${article.slug}`);
  });
  for (const [slot, photo] of Object.entries(article.photos)) {
    const filePath = path.resolve("public", photo.src.replace(/^\//, ""));
    const caption = `${photo.alt} ${photo.caption}`;
    if (/image optimis[eé]e|pas une photo|la photo n'a pas été prise|ne montre pas/i.test(caption)) {
      failures.push(`CAPTION: ${article.slug}/${slot}: ${photo.caption}`);
    }
    try {
      const bytes = await fs.readFile(filePath);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");
      const pHash = await perceptualHash(filePath);
      entries.push({ article: article.slug, slot, filePath, hash, pHash });
    } catch {
      failures.push(`MISSING_IMAGE: ${article.slug}/${slot}: ${photo.src}`);
    }
  }
}

for (let i = 0; i < entries.length; i += 1) {
  for (let j = i + 1; j < entries.length; j += 1) {
    const a = entries[i];
    const b = entries[j];
    if (a.article === b.article && a.slot === b.slot) continue;
    const distance = hammingDistance(a.pHash, b.pHash);
    if (a.hash === b.hash || distance <= 7) {
      failures.push(`POSSIBLE_DUPLICATE distance=${a.hash === b.hash ? 0 : distance}: ${a.article}/${a.slot} <-> ${b.article}/${b.slot}`);
    }
  }
}

console.log(`Audited ${articles.length} articles and ${entries.length} image slots. Body count includes intro, section paragraphs and outro; excludes headings, image text and metadata.`);
console.log(failures.length ? failures.join("\n") : "No word-count, missing-image, or forbidden-caption failures.");
if (failures.length) process.exitCode = 1;
