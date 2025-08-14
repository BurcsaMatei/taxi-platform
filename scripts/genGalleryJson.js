// scripts/genGalleryJson.js
// Scanează RECURSIV /public/images/gallery și generează/actualizează /data/galleryCaptions.json
// Usage:
//   node scripts/genGalleryJson.js            -> actualizează, păstrează textele existente (implicit)
//   node scripts/genGalleryJson.js --fresh    -> rescrie tot (golește textele existente)
//   node scripts/genGalleryJson.js --prune    -> elimină intrările care nu mai există (poate fi folosit și cu --fresh)

const fs = require("fs");
const path = require("path");

// Config
const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const OUTPUT_JSON = path.join(process.cwd(), "data", "galleryCaptions.json");

// Extensii suportate
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// Flag-uri CLI
const args = process.argv.slice(2);
const isFresh = args.includes("--fresh");
const isPrune = args.includes("--prune");

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readExistingJson() {
  if (!fs.existsSync(OUTPUT_JSON)) return [];
  try {
    const raw = fs.readFileSync(OUTPUT_JSON, "utf8");
    return JSON.parse(raw);
  } catch {
    console.warn("⚠️  galleryCaptions.json invalid sau corupt. Îl voi rescrie de la zero.");
    return [];
  }
}

// Walk recursiv prin directoare
function walkDir(dirAbs, acc = []) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const abs = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      walkDir(abs, acc);
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      if (exts.has(ext)) acc.push(abs);
    }
  }
  return acc;
}

function scanGalleryFilesRecursive() {
  if (!fs.existsSync(GALLERY_DIR)) {
    console.error(`❌ Folderul nu există: ${GALLERY_DIR}`);
    process.exit(1);
  }
  const absFiles = walkDir(GALLERY_DIR);

  // transformăm în căi web POSIX: /images/gallery/sub/dir/fișier.jpg
  const webPaths = absFiles.map((abs) => {
    const rel = path.relative(GALLERY_DIR, abs); // ex: sub\dir\g-001.jpg (Windows)
    const posixRel = rel.split(path.sep).join("/"); // -> sub/dir/g-001.jpg
    return `/images/gallery/${posixRel}`;
  });

  // sortare naturală
  webPaths.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return webPaths;
}

function mergeData(filePaths, existing) {
  const map = new Map();
  for (const item of existing) {
    if (item && item.src) map.set(item.src, item);
  }

  const merged = filePaths.map((src) => {
    const prev = map.get(src);
    const base = path.basename(src, path.extname(src)); // ex: g-001

    if (!prev || isFresh) {
      return {
        src,
        alt: isFresh ? "" : prev?.alt ?? "",
        title: isFresh ? base : prev?.title ?? base,
        caption: isFresh ? "" : prev?.caption ?? "",
        description: isFresh ? "" : prev?.description ?? ""
      };
    }
    // păstrăm textele existente
    return {
      src,
      alt: prev.alt || "",
      title: prev.title || base,
      caption: prev.caption || "",
      description: prev.description || ""
    };
  });

  if (isPrune) return merged;

  // dacă NU e prune, intrările vechi care nu mai există pe disc NU sunt incluse (doar avertizăm)
  const currentSet = new Set(filePaths);
  const removed = existing.filter((it) => !currentSet.has(it.src));
  if (removed.length) {
    console.warn("⚠️  Următoarele intrări nu mai există pe disc și NU au fost incluse în noul JSON:");
    removed.forEach((x) => console.warn("   - " + x.src));
  }

  return merged;
}

function writeJson(data) {
  ensureDir(OUTPUT_JSON);
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2), "utf8");
}

(function main() {
  console.log(`🔎 Scan recursiv: ${GALLERY_DIR}`);
  const files = scanGalleryFilesRecursive();

  const existing = isFresh ? [] : readExistingJson();
  const merged = mergeData(files, existing);

  writeJson(merged);
  console.log(`✅ Scris ${OUTPUT_JSON} (${merged.length} intrări)`);
  console.log(
    `ℹ️  Mod: ${isFresh ? "FRESH (rescris complet)" : "UPDATE (păstrează textele existente)"}${
      isPrune ? " + PRUNE (șterge intrările vechi)" : ""
    }`
  );
})();
