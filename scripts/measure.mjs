#!/usr/bin/env node
// Measures readability over the transcripts in benchmarks/results/.
//
//   node scripts/measure.mjs                 # the benchmark transcripts
//   node scripts/measure.mjs README.md ...   # any file, including this repo's own docs
//   node scripts/measure.mjs --markdown      # emit the docs tables, ready to paste
//   node scripts/measure.mjs --prose-only F  # drop blockquotes first (quoted material)
//
// Metric families, and why each exists:
//
//   grade      Median of three validated formulas: Flesch-Kincaid,
//              Coleman-Liau, ARI. Two of the three count characters, not
//              syllables, so no single heuristic decides the number. The
//              formulas weight sentence length and word shape differently, so
//              they legitimately disagree on unusual text; a spread above 3
//              grades is printed with the per-formula detail, and the median
//              is the headline precisely because it shrugs off one outlier.
//              Calibrated in tests/formulas.test.mjs against an independent
//              implementation.
//   off-list%  Share of words not covered by the vendored NGSL familiar-word
//              list (scripts/lib/vocab.mjs). Measures the plain-vocabulary
//              claim directly. Grade formulas cannot: they only see length.
//   idioms     Hits against a list derived mechanically from Wiktionary
//              (scripts/build-idiom-list.mjs). A lower bound with documented
//              limits, comparable between texts, never an absolute.
//   >25w       Sentences over 25 words, the skill's own ceiling.
//   em-dash    Em dashes in prose.
//   turns      Times the assistant spoke in a multi-message transcript.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { toProse, splitSentences, words as wordsOf } from "./lib/text.mjs";
import { grades } from "./lib/formulas.mjs";
import { coverage } from "./lib/vocab.mjs";
import { idiomHits } from "./lib/idioms.mjs";

export { toProse };

const RESULTS = "benchmarks/results";

export function analyse(raw, opts) {
  const text = toProse(raw, opts);
  const words = wordsOf(text);
  const sentences = splitSentences(text);
  const g = grades(words, sentences);
  const cov = coverage(words);
  const hits = idiomHits(text);
  const W = Math.max(words.length, 1);
  const S = Math.max(sentences.length, 1);

  return {
    words: words.length,
    sentences: S,
    avgSentence: +(W / S).toFixed(1),
    grade: g.grade,
    fleschKincaid: g.fleschKincaid,
    colemanLiau: g.colemanLiau,
    ari: g.ari,
    spread: g.spread,
    longSentences: sentences.filter((s) => s.split(/\s+/).filter(Boolean).length > 25).length,
    offListShare: cov.offListShare,
    offListWords: cov.offListWords,
    idioms: hits.length,
    idiomHits: hits,
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
    num("avg-sent", 10) + num("grade", 7) + num(">25w", 6) +
    num("off-list%", 11) + num("idioms", 8) + num("em-dash", 9)
  );
  console.log("-".repeat(showTurns ? 94 : 88));
  for (const [name, m] of rows) {
    console.log(
      pad(name, 30) + (showTurns ? num(m.spokenTurns, 6) : "") + num(m.words, 7) +
      num(m.avgSentence, 10) + num(m.grade.toFixed(1), 7) + num(m.longSentences, 6) +
      num(m.offListShare, 11) + num(m.idioms, 8) + num(m.emDashes, 9)
    );
  }
  console.log("");
  for (const [name, m] of rows) {
    if (m.spread > 3) {
      console.log(`  ${name}: formulas spread ${m.spread} grades ` +
        `(FK ${m.fleschKincaid}, CLI ${m.colemanLiau}, ARI ${m.ari}). ` +
        `The text is unusual on one dimension; the median is the headline for this reason.`);
    }
    if (m.idiomHits.length) console.log(`  ${name} idioms: ${m.idiomHits.join(", ")}`);
  }
}

// Markdown table for the docs. Regenerate rather than hand-edit:
//   node scripts/measure.mjs --markdown
function markdownTable(rows) {
  const lines = [
    "| transcript | turns | words | avg-sent | grade | >25w | off-list% | idioms | em-dash |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
  ];
  for (const [name, m] of rows) {
    lines.push(
      `| \`${name}\` | ${m.spokenTurns} | ${m.words} | ${m.avgSentence} | ${m.grade.toFixed(1)} | ` +
      `${m.longSentences} | ${m.offListShare} | ${m.idioms} | ${m.emDashes} |`
    );
  }
  return lines.join("\n");
}

// Only run the CLI when invoked directly, so self-check.mjs can import analyse().
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) main(process.argv.slice(2));

function main(args) {
  const dropQuotes = args.includes("--prose-only");
  const markdown = args.includes("--markdown");
  const files = args.filter((a) => !a.startsWith("--"));

  if (files.length) {
    const rows = files.map((f) => [basename(f), analyse(readFileSync(f, "utf8"), { dropQuotes })]);
    if (markdown) { console.log(markdownTable(rows)); return; }
    report(rows, false);
    for (const [name, m] of rows) {
      if (m.offListWords.length) console.log(`  ${name} off-list: ${m.offListWords.join(", ")}`);
    }
    console.log("");
  } else {
    if (!existsSync(RESULTS)) {
      console.error(`${RESULTS}/ not found. Run this from the repo root.`);
      process.exit(1);
    }
    const found = readdirSync(RESULTS).filter((f) => f.endsWith(".md")).sort();
    const rows = found.map((f) => [f.replace(/\.md$/, ""), analyse(readFileSync(join(RESULTS, f), "utf8"))]);
    if (markdown) { console.log(markdownTable(rows)); return; }
    report(rows, true);
    console.log("");
    console.log("grade = median of Flesch-Kincaid, Coleman-Liau, and ARI. Lower is easier.");
    console.log("off-list% = words outside the vendored NGSL familiar-word list.");
    console.log("idioms = hits against the Wiktionary-derived list; a lower bound, see");
    console.log("scripts/build-idiom-list.mjs for what the number does and does not mean.");
    console.log("");
  }
}
