import sharp from "sharp";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { remainingArticleProfiles } from "../data/news/remainingArticles.js";

const categories = {
  concerts: [
    ["concerts-wattstax", "Wattstax", "Watts Festival concert"],
    ["concerts-james-brown-live", "James Brown live concert 1960s 1970s stage", "James Brown performance cape Apollo 1960s"],
    ["concerts-aretha-franklin-live", "Aretha Franklin live concert performance 1968", "Aretha Franklin concert stage microphone"],
    ["concerts-apollo", "Apollo Theater Harlem", "Apollo Theater marquee"],
    ["concerts-soul-venues", "Stax Records studio Memphis", "Motown Studio A Detroit"],
    ["concerts-fillmore-west", "Fillmore West San Francisco 1960s concert", "Fillmore West Bill Graham stage"],
  ],
  culture: [
    ["culture-soul-struggle", "Savannah civil rights museum", "soul music protest archive"],
    ["culture-gospel-rhythm-blues", "Gospel choir", "church choir gospel"],
    ["culture-motown-stax", "Motown Stax", "Stax Records studio"],
    ["culture-soul-civil-rights", "Library of Congress civil rights photograph", "civil rights museum Savannah"],
    ["culture-memphis-detroit-philadelphia", "Philadelphia soul Sigma Sound Studios", "Memphis Beale Street archival"],
    ["culture-soul-funk-rnb", "independent soul record label 1970s", "soul 45 record label archive"],
  ],
  sampling: [
    ["sampling-soul-underground", "Sylvers soul group 1970s", "Friends of Distinction 1970s"],
    ["sampling-soul-to-dilla", "J Dilla", "MPC sampler"],
    ["sampling-amen-break", "drum break", "drum kit drummer"],
    ["sampling-crate-digging", "record shop", "vinyl records shop"],
    ["sampling-orchestration", "Isaac Hayes", "Curtis Mayfield orchestra"],
    ["sampling-vinyl-production", "vinyl turntable", "music sampler studio"],
  ],
};

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();
}

async function searchCommons(query, limit = 6) {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const searchParams = new URLSearchParams({
    action: "query", format: "json", list: "search", srnamespace: "6",
    srlimit: String(limit), srsearch: query,
  });
  const headers = {
    "User-Agent": "SMQ-NewsEditorial/1.0 (local research; contact via project owner)",
  };
  let searchResponse;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    searchResponse = await fetch(`https://commons.wikimedia.org/w/api.php?${searchParams}`, { headers });
    if (searchResponse.status !== 429) break;
    await new Promise((resolve) => setTimeout(resolve, 12000 * (attempt + 1)));
  }
  if (!searchResponse.ok) throw new Error(`Commons search ${searchResponse.status} for ${query}`);
  const searchJson = await searchResponse.json();
  const pageIds = (searchJson.query?.search || []).map((page) => page.pageid);
  if (!pageIds.length) return [];
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const infoParams = new URLSearchParams({
    action: "query", format: "json", pageids: pageIds.join("|"),
    prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "1600",
  });
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(`https://commons.wikimedia.org/w/api.php?${infoParams}`, { headers });
    if (response.status !== 429) break;
    await new Promise((resolve) => setTimeout(resolve, 12000 * (attempt + 1)));
  }
  if (!response.ok) throw new Error(`Commons API ${response.status} for ${query}`);
  const json = await response.json();
  return Object.values(json.query?.pages || {}).map((page) => {
    const info = page.imageinfo?.[0];
    const metadata = info?.extmetadata || {};
    const license = stripHtml(metadata.LicenseShortName?.value || "");
    return {
      title: page.title,
      description: stripHtml(metadata.ImageDescription?.value || page.title),
      author: stripHtml(metadata.Artist?.value || ""),
      license,
      licenseUrl: stripHtml(metadata.LicenseUrl?.value || ""),
      pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`,
      sourceUrl: info?.thumburl || info?.url,
      width: info?.width,
      height: info?.height,
      mime: info?.mime,
    };
  }).filter((item) => item.sourceUrl && /\.(?:jpe?g|png|webp|tiff?)(?:\?|$)/i.test(item.title) && item.width >= 500 && item.height >= 400 && /^(?:CC0|Public domain|CC BY|CC BY-SA|CC BY-ND)/i.test(item.license));
}

async function research(categoryFilter, slugFilter) {
  for (const [category, articles] of Object.entries(categories)) {
    if (categoryFilter && category !== categoryFilter) continue;
    console.log(`\n### ${category}`);
    for (const [slug, ...queries] of articles) {
      if (slugFilter && slug !== slugFilter) continue;
      console.log(`\n## ${slug}`);
      const unique = new Map();
      for (const query of queries) {
        for (const item of await searchCommons(query, 6)) unique.set(item.title, item);
      }
      console.log(JSON.stringify([...unique.values()].slice(0, 5), null, 2));
    }
  }
}

async function downloadAndConvert(category, slug, filename, url) {
  const directory = path.resolve("public/images/news/articles", category, slug);
  await fs.mkdir(directory, { recursive: true });
  const jpgPath = path.join(directory, `${filename}.jpg`);
  const webpPath = path.join(directory, `${filename}.webp`);
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 2500 : 10000 * attempt));
    response = await fetch(url, { headers: { "User-Agent": "SMQ-NewsEditorial/1.0" } });
    if (response.ok || response.status !== 429) break;
  }
  if (!response.ok) throw new Error(`Image download ${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 12_000) throw new Error(`Image unexpectedly small: ${url}`);
  await fs.writeFile(jpgPath, buffer);
  await sharp(buffer).rotate().webp({ quality: 82, effort: 5 }).toFile(webpPath);
  const metadata = await sharp(webpPath).metadata();
  if (!metadata.width || !metadata.height || metadata.width < 500 || metadata.height < 400) {
    throw new Error(`Converted image failed validation: ${webpPath}`);
  }
  await fs.unlink(jpgPath);
  console.log(`${webpPath} ${metadata.width}x${metadata.height} ${buffer.length} bytes source`);
}

async function convertRemainingProfiles(forcePaths = new Set()) {
  const sources = new Map();
  const photos = Object.values(remainingArticleProfiles).flatMap((article) => Object.values(article.photos));
  const existingBySource = new Map();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (const photo of photos) {
    const outputPath = path.resolve("public", photo.src.replace(/^\//, ""));
    try {
      const existing = await fs.stat(outputPath);
      if (existing.size > 12_000 && !existingBySource.has(photo.sourceUrl)) {
        existingBySource.set(photo.sourceUrl, outputPath);
      }
    } catch {
      // This source has no converted copy on disk yet.
    }
  }
  const filenameFor = (photo) => decodeURIComponent(new URL(photo.sourceUrl).pathname.split("/").pop());
  const filenames = [...new Set(photos.map(filenameFor))];
  const directUrls = new Map();
  for (let offset = 0; offset < filenames.length; offset += 40) {
    const batch = filenames.slice(offset, offset + 40);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      titles: batch.map((filename) => `File:${filename}`).join("|"),
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "700",
    });
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "SMQ-NewsEditorial/1.0" },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Commons metadata lookup failed: ${response.status}`);
    const json = await response.json();
    for (const page of Object.values(json.query?.pages || {})) {
      const file = page.title.replace(/^File:/, "");
      const info = page.imageinfo?.[0];
      if (info?.thumburl || info?.url) directUrls.set(file, info.thumburl || info.url);
    }
  }

  for (const article of Object.values(remainingArticleProfiles)) {
    const firstPhotoPath = path.resolve("public", Object.values(article.photos)[0].src.replace(/^\//, ""));
    const articleDirectory = path.dirname(firstPhotoPath);
    await fs.mkdir(articleDirectory, { recursive: true });
    for (const [name, photo] of Object.entries(article.photos)) {
      const webpPath = path.resolve("public", photo.src.replace(/^\//, ""));
      try {
        const existing = await fs.stat(webpPath);
        if (existing.size > 12_000 && !forcePaths.has(webpPath)) continue;
      } catch {
        // Missing output: download and convert it below.
      }
      const localSource = existingBySource.get(photo.sourceUrl);
      if (localSource && localSource !== webpPath && !forcePaths.has(webpPath)) {
        await fs.copyFile(localSource, webpPath);
        console.log(`${article.slug}/${name}: reused converted copy ${webpPath}`);
        continue;
      }
      if (!sources.has(photo.sourceUrl)) {
        const directUrl = directUrls.get(filenameFor(photo));
        if (!directUrl) {
          sources.set(photo.sourceUrl, Promise.reject(new Error(`Commons file not found: ${filenameFor(photo)}`)));
        } else {
          sources.set(photo.sourceUrl, (async () => {
            let response;
            for (let attempt = 0; attempt < 3; attempt += 1) {
              await delay(attempt === 0 ? 2500 : 10000 * attempt);
              response = await fetch(directUrl, {
                headers: { "User-Agent": "SMQ-NewsEditorial/1.0" },
                signal: AbortSignal.timeout(30000),
              });
              if (response.ok) break;
              if (response.status !== 429) throw new Error(`Image download ${response.status}: ${directUrl}`);
            }
            if (!response?.ok) {
              const fallbackParams = new URLSearchParams({
                action: "query", format: "json", titles: `File:${filenameFor(photo)}`,
                prop: "imageinfo", iiprop: "url", iiurlwidth: "600",
              });
              const fallbackResponse = await fetch(`https://commons.wikimedia.org/w/api.php?${fallbackParams}`, {
                headers: { "User-Agent": "SMQ-NewsEditorial/1.0" },
                signal: AbortSignal.timeout(20000),
              });
              if (fallbackResponse.ok) {
                const fallbackJson = await fallbackResponse.json();
                const fallbackInfo = Object.values(fallbackJson.query?.pages || {})[0]?.imageinfo?.[0];
                const fallbackUrl = fallbackInfo?.thumburl;
                if (fallbackUrl && fallbackUrl !== directUrl) {
                  await delay(2500);
                  response = await fetch(fallbackUrl, {
                    headers: { "User-Agent": "SMQ-NewsEditorial/1.0" },
                    signal: AbortSignal.timeout(30000),
                  });
                }
              }
            }
            if (!response?.ok) throw new Error(`Image download ${response?.status || "failed"}: ${directUrl}`);
            const buffer = Buffer.from(await response.arrayBuffer());
            if (buffer.length < 12_000) throw new Error(`Image unexpectedly small: ${directUrl}`);
            return buffer;
          })());
        }
      }
      try {
        const buffer = await sources.get(photo.sourceUrl);
        await fs.mkdir(path.dirname(webpPath), { recursive: true });
        const webp = await sharp(buffer).rotate().webp({ quality: 82, effort: 5 }).toBuffer();
        const metadata = await sharp(webp).metadata();
        if (!metadata.width || !metadata.height || metadata.width < 500 || metadata.height < 400) {
          throw new Error(`Converted image failed validation: ${webpPath}`);
        }
        await fs.writeFile(webpPath, webp);
        existingBySource.set(photo.sourceUrl, webpPath);
        console.log(`${article.slug}/${name}: ${metadata.width}x${metadata.height} ${webpPath}`);
      } catch (error) {
        console.error(`${article.slug}/${name}: ${error.message}`);
      }
    }
  }
}

async function refreshDuplicateImages() {
  const hashed = new Map();
  for (const article of Object.values(remainingArticleProfiles)) {
    for (const photo of Object.values(article.photos)) {
      const filePath = path.resolve("public", photo.src.replace(/^\//, ""));
      try {
        const hash = crypto.createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
        const group = hashed.get(hash) || [];
        group.push({ filePath, article, photo });
        hashed.set(hash, group);
      } catch {
        // Missing assets are handled by the regular conversion pass.
      }
    }
  }
  const preferredReplacements = new Set([
    "gospel-rnb-right-tall.webp",
    "soul-struggle-left-top.webp",
    "soul-cities-left-top.webp",
    "soul-cities-right-tall.webp",
    "soul-orchestration-left-bottom.webp",
    "james-brown-breaks-left-bottom.webp",
    "soul-to-dilla-right-tall.webp",
  ]);
  const duplicatePaths = new Set([...hashed.values()].filter((group) => group.length > 1).flatMap((group) => {
    if (group.length > 2) return group.map(({ filePath }) => filePath);
    const preferred = group.find(({ filePath }) => preferredReplacements.has(path.basename(filePath)));
    return [(preferred || group[0]).filePath];
  }));
  duplicatePaths.add(path.resolve("public/images/news/articles/sampling/sampling-vinyl-production/vinyl-production-right-tall.webp"));
  console.log(`Refreshing ${duplicatePaths.size} article images from duplicate groups.`);
  await convertRemainingProfiles(duplicatePaths);
}

if (process.argv[2] === "research") {
  await research(process.argv[3], process.argv[4]);
} else if (process.argv[2] === "convert") {
  const [, , , category, slug, filename, url] = process.argv;
  if (!category || !slug || !filename || !url) throw new Error("Usage: node scripts/research-news-images.mjs convert <category> <slug> <filename> <source-url>");
  await downloadAndConvert(category, slug, filename, url);
} else if (process.argv[2] === "convert-remaining") {
  await convertRemainingProfiles();
} else if (process.argv[2] === "refresh-duplicates") {
  await refreshDuplicateImages();
} else {
  throw new Error("Usage: node scripts/research-news-images.mjs research | convert <category> <slug> <filename> <source-url>");
}
