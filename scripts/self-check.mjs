#!/usr/bin/env node
// Holds this repo's own writing to the standard the skill sells.
//
// A project that promises plain, complete, idiom-free English has no business shipping a
// README written in dense clause-stacked marketing prose. This script is the answer to
// "do you use your own tool?" — it runs in CI, and a failure blocks the merge.
//
// Blockquotes are excluded. A quoted bad example is quoted material, and the skill's own
// scope rule leaves quotes exactly as they are.
//
// Every markdown file in the repo is checked on the same budget, with no per-file
// exemptions. Everything under benchmarks/, out/, and probes/ is excluded: the
// transcripts are evidence and the scenarios are inputs to it. Editing either one to
// pass a style check would be worse than failing it. The README in each of those
// directories is prose this project wrote, so it is checked.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { analyse } from "./measure.mjs";

// One budget for every markdown file this project writes. No per-file exemptions, because
// an exemption is where the embarrassing sentence goes to hide.
// Thresholds, recalibrated for measurement layer v2 (see CHANGELOG 3.5.0).
// MAX_GRADE applies to the median of FK, Coleman-Liau, and ARI. The old rule
// was FK < 9.0 alone; the median is stricter against any one formula being
// fooled, and 9.0 keeps the same intent: comfortable reading for a competent
// non-native reader. Idiom hits stay at zero, now against the derived list.
const MAX_GRADE = 9.0;
const MAX_LONG = 0;
const MAX_FIGURATIVE = 0; // against the Wiktionary-derived list
const MAX_EM_DASH = 3;

// Transcripts are evidence, not prose this project wrote to be read. Scoring them here
// would mean editing evidence to pass a style check. out/ and probes/ are the same
// category as benchmarks/: raw outputs and the frozen inputs that produced them.
const SKIP = [/^benchmarks\//, /^out\//, /^probes\//, /^tasks\//, /^node_modules\//, /^dist\//, /^\.git\//];
// READMEs inside evidence directories are prose this project wrote, so they are checked.
const CHECKED_ANYWAY = ["benchmarks/README.md", "out/README.md"];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name).replace(/^\.\//, "");
    if (SKIP.some((r) => r.test(p)) && !CHECKED_ANYWAY.includes(p)) continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

if (!existsSync("skills/sapiens/SKILL.md")) {
  console.error("Run this from the repo root.");
  process.exit(1);
}

const TARGETS = walk(".").sort();

console.log(c.bold("\nSelf-check: this repo against its own standard"));
console.log(c.dim(`${TARGETS.length} markdown files, blockquotes excluded\n`));

let failed = 0;
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log(pad("file", 30) + num("grade", 7) + num(">25w", 7) + num("idiom", 7) + num("em-dash", 9));
console.log("-".repeat(60));

for (const file of TARGETS) {
  const m = analyse(readFileSync(file, "utf8"), { dropQuotes: true });
  const bad = [];
  if (m.grade > MAX_GRADE) bad.push(`grade ${m.grade} > ${MAX_GRADE}`);
  if (m.longSentences > MAX_LONG) bad.push(`${m.longSentences} sentence(s) over 25 words`);
  if (m.idioms > MAX_FIGURATIVE) bad.push(`figurative: ${m.idiomHits.join(", ")}`);
  if (m.emDashes > MAX_EM_DASH) bad.push(`${m.emDashes} em dashes > ${MAX_EM_DASH}`);

  const mark = bad.length ? c.red("✗") : c.green("✓");
  console.log(`${mark} ` + pad(file, 28) + num(m.grade, 7) + num(m.longSentences, 7) +
              num(m.idioms, 7) + num(m.emDashes, 9));
  for (const b of bad) console.log(c.red(`    ${b}`));
  if (bad.length) failed++;
}

console.log("");
if (failed) {
  console.log(c.red(`${failed} file(s) fail the standard this project sells.`));
  console.log(c.dim("Run: node scripts/measure.mjs --prose-only <file>  to see the detail.\n"));
  process.exit(1);
}
console.log(c.green("every file passes\n"));
