// scripts/strip-type-exports-from-css-ts.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "controlcenter");

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT).filter((p) => p.endsWith(".css.ts"));

let changed = 0;

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");

  // remove any line that starts with: export type ...
  const next = src
    .split("\n")
    .filter((line) => !/^\s*export\s+type\s+/.test(line))
    .join("\n");

  if (next !== src) {
    fs.writeFileSync(file, next, "utf8");
    changed += 1;
  }
}

console.log(`[strip-type-exports] updated files: ${changed}/${files.length}`);