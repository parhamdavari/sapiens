#!/usr/bin/env node
// Measures readability over the transcripts in benchmarks/results/.
//
//   node scripts/measure.mjs                 # the benchmark transcripts
//   node scripts/measure.mjs README.md ...   # any file, including this repo's own docs
//
// Two families of metric, because they catch different problems.
//
//   Flesch-Kincaid grade   Word length and sentence length. Catches dense, Latinate,
//                          long-clause writing.
//   figurative hits        Idioms and metaphors. FK cannot see these. "How hard an
//                          uncited claim should bite" is all short words in a short
//                          sentence, so it scores as easy while being opaque to a reader
//                          working in a second language.
//
// The figurative list is in scripts/figurative-list.mjs. Read the note at the top of that
// file before quoting any number this script prints: a hit count is a lower bound against
// one fixed list, not an absolute measure.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { FIGURATIVE } from "./figurative-list.mjs";
import { toProse, splitSentences, words as wordsOf } from "./lib/text.mjs";

export { toProse };

const RESULTS = "benchmarks/results";

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  let n = 0, prev = false;
  for (const ch of w) {
    const isVowel = "aeiouy".includes(ch);
    if (isVowel && !prev) n++;
    prev = isVowel;
  }
  if (w.endsWith("e") && n > 1) n--;
  return Math.max(n, 1);
}

export function analyse(raw, opts) {
  const text = toProse(raw, opts);
  const words = wordsOf(text);
  const sentences = splitSentences(text);
  const W = words.length;
  const S = Math.max(sentences.length, 1);
  const SY = words.reduce((a, w) => a + syllables(w), 0);
  const lower = text.toLowerCase();

  return {
    words: W,
    sentences: S,
    avgSentence: +(W / S).toFixed(1),
    fleschKincaid: +(0.39 * (W / S) + 11.8 * (SY / W) - 15.59).toFixed(1),
    longSentences: sentences.filter((s) => s.split(/\s+/).filter(Boolean).length > 25).length,
    figurative: FIGURATIVE.filter((f) => lower.includes(f)).length,
    figurativeHits: FIGURATIVE.filter((f) => lower.includes(f)),
    emDashes: (text.match(/—/g) || []).length,
    spokenTurns: /^---MESSAGE---/m.test(raw)
      ? raw.split(/^---MESSAGE---.*$/m).slice(1).filter((p) => p.trim() && p.trim() !== "NONE").length
      : 1,
  };
}

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

function report(rows, showTurns) {
  console.log("");
  console.log(
    pad("file", 30) + (showTurns ? num("turns", 6) : "") + num("words", 7) +
    num("avg-sent", 10) + num("FK", 6) + num(">25w", 6) + num("figurative", 12) + num("em-dash", 9)
  );
  console.log("-".repeat(showTurns ? 86 : 80));
  for (const [name, m] of rows) {
    console.log(
      pad(name, 30) + (showTurns ? num(m.spokenTurns, 6) : "") + num(m.words, 7) +
      num(m.avgSentence, 10) + num(m.fleschKincaid, 6) + num(m.longSentences, 6) +
      num(m.figurative, 12) + num(m.emDashes, 9)
    );
  }
  console.log("");
}

// Only run the CLI when invoked directly, so self-check.mjs can import analyse().
const isMain = import.meta.url === `file://${process.argv[1]}`;
const args = isMain ? process.argv.slice(2) : null;
if (isMain) main();

function main() {
// --prose-only drops blockquotes. Use it when measuring this repo's own docs: a quoted
// bad example is quoted material, and the skill's own scope rule leaves quotes alone.
const dropQuotes = args.includes("--prose-only");
const files = args.filter((a) => !a.startsWith("--"));

if (files.length) {
  const rows = files.map((f) => [basename(f), analyse(readFileSync(f, "utf8"), { dropQuotes })]);
  report(rows, false);
  for (const [name, m] of rows) {
    if (m.figurativeHits.length) console.log(`${name} figurative: ${m.figurativeHits.join(", ")}`);
  }
  console.log("");
} else {
  if (!existsSync(RESULTS)) {
    console.error(`${RESULTS}/ not found. Run this from the repo root.`);
    process.exit(1);
  }
  const found = readdirSync(RESULTS).filter((f) => f.endsWith(".md")).sort();
  report(found.map((f) => [f.replace(/\.md$/, ""), analyse(readFileSync(join(RESULTS, f), "utf8"))]), true);
  console.log("FK = Flesch-Kincaid grade. Lower is easier. FK is blind to idioms, which is");
  console.log("what the figurative column is for. See scripts/figurative-list.mjs for how");
  console.log("that list was built and what its number does and does not mean.");
  console.log("");
}
}
