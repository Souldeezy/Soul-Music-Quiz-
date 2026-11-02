import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const completeCatalogRequired = process.argv.includes("--complete");
const errors = [];
const warnings = [];

function sourceFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const text = fs.readFileSync(absolutePath, "utf8");
  return { absolutePath, text, source: ts.createSourceFile(absolutePath, text, ts.ScriptTarget.Latest, true) };
}

function exportedInitializer(relativePath, exportName) {
  const { source } = sourceFile(relativePath);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === exportName && declaration.initializer) {
        return { source, initializer: declaration.initializer };
      }
    }
  }
  throw new Error(`Export ${exportName} introuvable dans ${relativePath}`);
}

function evaluateLiteral(node, source) {
  return vm.runInNewContext(`(${node.getText(source)})`, Object.create(null), { timeout: 1000 });
}

function slugify(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function propertiesOf(objectLiteral) {
  const values = {};
  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : null;
    if (key) values[key] = property.initializer;
  }
  return values;
}

const { source: artistsSource, initializer: artistsInitializer } = exportedInitializer("components/artistes/artistsData.js", "artistSlides");
const artistSlides = evaluateLiteral(artistsInitializer, artistsSource);
const { source: profilesSource, initializer: profilesInitializer } = exportedInitializer("components/artistes/artistProfiles.js", "artistProfiles");
const artistProfiles = evaluateLiteral(profilesInitializer, profilesSource);
const { source: searchSource, initializer: searchInitializer } = exportedInitializer("data/search/temporarySearchItems.js", "temporarySearchItems");
if (!ts.isArrayLiteralExpression(searchInitializer)) throw new Error("temporarySearchItems doit rester un tableau littéral pour être validé automatiquement.");

const artistSearchItems = searchInitializer.elements
  .filter(ts.isObjectLiteralExpression)
  .map((item) => ({ node: item, values: propertiesOf(item) }))
  .filter(({ values }) => values.type && ts.isStringLiteral(values.type) && values.type.text === "Artiste")
  .map(({ node }) => evaluateLiteral(node, searchSource));

const bySlug = new Map();
const byName = new Map();
for (const [index, artist] of artistSlides.entries()) {
  const name = typeof artist.name === "string" ? artist.name.trim() : "";
  if (!name) {
    errors.push(`artistSlides[${index}] n’a pas de nom valide.`);
    continue;
  }
  const slug = slugify(name);
  if (!slug) errors.push(`Le nom « ${name} » produit un slug vide.`);
  if (bySlug.has(slug)) errors.push(`Collision de slug « ${slug} » : « ${bySlug.get(slug)} » et « ${name} ».`);
  else bySlug.set(slug, name);
  if (byName.has(name.toLocaleLowerCase("fr"))) errors.push(`Nom d’artiste dupliqué : « ${name} ».`);
  else byName.set(name.toLocaleLowerCase("fr"), slug);

  if (artist.image) {
    const relativeImage = artist.image.replace(/^\/+/, "");
    const imagePath = path.join(root, "public", relativeImage);
    if (!fs.existsSync(imagePath)) errors.push(`Image absente pour « ${name} » : public/${relativeImage}.`);
    else if (relativeImage.toLowerCase().endsWith(".webp")) {
      const header = Buffer.alloc(12);
      const descriptor = fs.openSync(imagePath, "r");
      try {
        fs.readSync(descriptor, header, 0, header.length, 0);
      } finally {
        fs.closeSync(descriptor);
      }
      if (header.toString("ascii", 0, 4) !== "RIFF" || header.toString("ascii", 8, 12) !== "WEBP") {
        errors.push(`Le fichier annoncé WebP pour « ${name} » n’est pas encodé en WebP : public/${relativeImage}.`);
      }
    }
  }
}

for (const [slug, profile] of Object.entries(artistProfiles)) {
  if (!bySlug.has(slug)) errors.push(`La fiche « ${slug} » ne correspond à aucun artiste de artistSlides.`);
  if (!profile?.name || slugify(profile.name) !== slug) errors.push(`Le nom de la fiche « ${slug} » ne correspond pas à son slug.`);
  for (const field of ["birthDate", "birthPlace", "country", "parcours", "carriere", "tracks"]) {
    const value = profile?.[field];
    const valid = Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
    if (!valid) errors.push(`La fiche « ${slug} » n’a pas de contenu valide pour « ${field} ».`);
  }
}

const searchByHref = new Map();
for (const item of artistSearchItems) {
  const match = typeof item.href === "string" && item.href.match(/^\/artistes\/([^/]+)$/);
  if (!match) {
    errors.push(`Entrée de recherche artiste avec URL invalide : ${item.href ?? "(vide)"}.`);
    continue;
  }
  const [, slug] = match;
  if (!bySlug.has(slug)) errors.push(`L’entrée de recherche « ${item.title} » pointe vers un artiste absent : ${slug}.`);
  if (slugify(item.title ?? "") !== slug) errors.push(`Le titre « ${item.title} » ne correspond pas au slug ${slug} dans la recherche.`);
  if (searchByHref.has(item.href)) errors.push(`Entrée de recherche dupliquée : ${item.href}.`);
  else searchByHref.set(item.href, item);
}

for (const [slug, profile] of Object.entries(artistProfiles)) {
  const item = searchByHref.get(`/artistes/${slug}`);
  if (!item) errors.push(`La fiche « ${slug} » n’a pas d’entrée de recherche.`);
  else if (item.title !== profile.name) errors.push(`Le titre de recherche de « ${slug} » diffère du nom de sa fiche.`);
}

const missingProfiles = [...bySlug.keys()].filter((slug) => !Object.hasOwn(artistProfiles, slug));
const missingSearch = [...Object.entries(artistProfiles)].filter(([slug]) => !searchByHref.has(`/artistes/${slug}`));
if (completeCatalogRequired && missingProfiles.length) errors.push(`${missingProfiles.length} artiste(s) n’ont pas encore de fiche complète (--complete).`);
if (completeCatalogRequired) {
  for (const [slug, name] of bySlug) {
    if (!searchByHref.has(`/artistes/${slug}`)) errors.push(`L’artiste « ${name} » n’a pas d’entrée de recherche (--complete).`);
  }
}

console.log(`Artistes dans l’index : ${artistSlides.length}`);
console.log(`Fiches complètes : ${Object.keys(artistProfiles).length}`);
console.log(`Entrées de recherche artiste : ${artistSearchItems.length}`);
console.log(`Fiches sans recherche : ${missingSearch.length}`);
if (missingProfiles.length) {
  const examples = missingProfiles.slice(0, 8).map((slug) => `${bySlug.get(slug)} (${slug})`);
  warnings.push(`${missingProfiles.length} fiche(s) restent à remplir; exemples : ${examples.join(", ")}${missingProfiles.length > examples.length ? ", …" : ""}.`);
}
for (const warning of warnings) console.warn(`AVERTISSEMENT : ${warning}`);
for (const error of errors) console.error(`ERREUR : ${error}`);
if (errors.length) process.exitCode = 1;
else console.log("Validation artiste réussie.");
