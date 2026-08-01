#!/usr/bin/env node
// Measures readability over the transcripts in benchmarks/results/.
//
// Two families of metric, because they catch different problems:
//
//   Flesch-Kincaid grade   — word length and sentence length. Catches dense,
//                            Latinate, long-clause writing.
//   figurative hits        — idioms and metaphors. FK cannot see these at all:
//                            "how hard an uncited claim should bite" is all short
//                            words in a short sentence, so it scores as easy while
//                            being unreadable to a non-native reader. This column is
//                            the reason the skill has a separate check for it.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const RESULTS = "benchmarks/results";

// Sampled from references/plain-english.md. Not exhaustive by design — it measures a
// habit, it does not police a vocabulary.
const FIGURATIVE = [
  "headline one", "the big one", "finished green", "tests are green", "not fully green",
  "should bite", "product call", "judgment call", "settled as", "ship it", "moving parts",
  "low-hanging", "out of the box", "down the line", "down the road", "gotcha", "bake it in",
  "kick the can", "quietly", "under the hood", "footgun", "happy path", "blast radius",
  "paper over", "band-aid", "stopgap", "eat the cost", "in the weeds", "move the needle",
  "no-brainer", "dispatched", "a bundle of",
];

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

export function analyse(raw) {
  const text = raw
    .replace(/<!--[\s\S]*?-->/g, "")          // notes about the transcript, not part of it
    .replace(/^---MESSAGE---.*$/gm, "")
    .replace(/\bNONE\b/g, "")
    .replace(/[#*`>|_]/g, " ")
    .trim();

  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length > 2);
  const W = words.length;
  const S = Math.max(sentences.length, 1);
  const SY = words.reduce((a, w) => a + syllables(w), 0);

  return {
    words: W,
    sentences: S,
    avgSentence: +(W / S).toFixed(1),
    fleschKincaid: +(0.39 * (W / S) + 11.8 * (SY / W) - 15.59).toFixed(1),
    longSentences: sentences.filter((s) => s.split(/\s+/).length > 25).length,
    figurative: FIGURATIVE.filter((f) => text.toLowerCase().includes(f)).length,
    spokenTurns: (raw.match(/^---MESSAGE---/gm) || []).length
      ? raw.split(/^---MESSAGE---.*$/m).slice(1).filter((p) => p.trim() && p.trim() !== "NONE").length
      : 1,
  };
}

if (!existsSync(RESULTS)) {
  console.error(`${RESULTS}/ not found. Run this from the repo root.`);
  process.exit(1);
}

const files = readdirSync(RESULTS).filter((f) => f.endsWith(".md")).sort();
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

console.log("");
console.log(
  pad("transcript", 30) + num("turns", 6) + num("words", 7) + num("avg-sent", 10) +
  num("FK", 6) + num(">25w", 6) + num("figurative", 12)
);
console.log("-".repeat(77));

for (const f of files) {
  const m = analyse(readFileSync(join(RESULTS, f), "utf8"));
  console.log(
    pad(f.replace(/\.md$/, ""), 30) + num(m.spokenTurns, 6) + num(m.words, 7) +
    num(m.avgSentence, 10) + num(m.fleschKincaid, 6) + num(m.longSentences, 6) +
    num(m.figurative, 12)
  );
}
console.log("");
console.log("FK = Flesch-Kincaid grade. Lower is easier. An IELTS Band 6 reader is");
console.log("comfortable around grade 8. FK is blind to idioms, which is what the");
console.log("figurative column is for.");
console.log("");
