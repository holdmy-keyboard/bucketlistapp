import fs from "node:fs";
import path from "node:path";

const targetDir = path.join(process.cwd(), "node_modules", "@typescript", "vfs", "dist");
const files = [
  "vfs.cjs.development.js",
  "vfs.cjs.production.min.js",
  "vfs.esm.js",
  "vfs.globals.js",
];
const before = 'localStorage.getItem("DEBUG")';
const after = '((typeof localStorage.getItem==="function")&&localStorage.getItem("DEBUG"))';

if (!fs.existsSync(targetDir)) {
  console.log("[patch-typescript-vfs] skipped: @typescript/vfs not installed");
  process.exit(0);
}

let changedCount = 0;
for (const file of files) {
  const fullPath = path.join(targetDir, file);
  if (!fs.existsSync(fullPath)) continue;

  const source = fs.readFileSync(fullPath, "utf8");
  if (!source.includes(before)) continue;

  const patched = source.split(before).join(after);
  if (patched !== source) {
    fs.writeFileSync(fullPath, patched, "utf8");
    changedCount += 1;
  }
}

console.log(`[patch-typescript-vfs] patched ${changedCount} file(s)`);
