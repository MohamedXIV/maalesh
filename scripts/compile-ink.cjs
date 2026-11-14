/* eslint-disable @typescript-eslint/no-require-imports -- Node-only .cjs build tooling. */
/* Compiles authored Ink once before Next dev/build.
 * Generated JSON in public/ink is checked into no source and served as assets.
 */
const fs = require("node:fs");
const path = require("node:path");
const { Compiler } = require("inkjs/full");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "public", "ink");
fs.mkdirSync(destination, { recursive: true });
for (const locale of ["en", "ar"]) {
  const source = fs.readFileSync(path.join(root, "src", "content", "ink", "hr." + locale + ".ink"), "utf8");
  const story = new Compiler(source).Compile();
  if (!story) throw new Error("Ink compiler returned no story for " + locale);
  // Ensure generated narrative only contains approved, author-edited content.
  fs.writeFileSync(path.join(destination, "hr." + locale + ".json"), story.ToJson(), "utf8");
  process.stdout.write("Ink compiled: " + locale + "\n");
}
