#!/usr/bin/env node
// Derives scripts/data/idioms.txt from the raw Wiktionary category dump.
//
//   node scripts/build-idiom-list.mjs
//
// Dev-time only. The dump itself (scripts/data/wiktionary-idioms-raw.json) is
// fetched separately; this script is deterministic over it, so running it
// twice produces identical output. Anyone can re-run the derivation and get
// the same list, which is the point: no entry exists because someone read
// this repo's transcripts.
//
// Every filter below is mechanical. None of them involves reading the list
// and deciding an entry "does not feel like an idiom". The one judgement in
// this file is the choice of filters, and each carries its reason.

import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("scripts/data/wiktionary-idioms-raw.json", "utf8"));

const STOPWORDS = new Set(
  readFileSync("scripts/data/stopwords.txt", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
);

// Verb particles, a closed grammatical set. A two-word entry ending in one of
// these is a phrasal verb. Phrasal verbs are vocabulary, not figurative
// language: learners meet "show up" and "come back" as words to learn, and
// matching them as idioms condemns ordinary plain prose.
const PARTICLES = new Set([
  "up", "down", "in", "out", "on", "off", "over", "under", "away", "back",
  "through", "along", "around", "about", "by", "to", "at", "for", "with",
]);

const filters = [
  {
    name: "multi-word",
    reason:
      "single words (brittle, greenlight) collide with literal technical use; " +
      "a phrase must be at least two words to match safely with boundaries",
    keep: (t) => t.trim().split(/\s+/).length >= 2,
  },
  {
    name: "max-six-words",
    reason: "proverbs longer than six words never occur verbatim in chat replies",
    keep: (t) => t.trim().split(/\s+/).length <= 6,
  },
  {
    name: "lowercase-ascii",
    reason:
      "capitals mark proper nouns (11 Downing Street) and non-ASCII marks " +
      "loanwords; both are out of scope for an English idiom check",
    keep: (t) => /^[a-z][a-z' -]*$/.test(t),
  },
  {
    name: "no-placeholder",
    reason:
      "template forms (one's, someone's, somebody's) never appear verbatim, " +
      "so they can never match and only inflate the count",
    keep: (t) => !/\b(one's|someone|somebody|something|oneself)\b/.test(t),
  },
  {
    name: "not-all-stopwords",
    reason:
      "an entry made entirely of closed-class function words (of a, at all, " +
      "and how) is a grammar sequence and fires on ordinary literal prose",
    keep: (t) => !t.split(/\s+/).every((w) => STOPWORDS.has(w.replace(/'/g, "'"))),
  },
  {
    name: "no-two-word-phrasal-verbs",
    reason:
      "a two-word entry ending in a verb particle (show up, come back) is a " +
      "phrasal verb; learners meet these as vocabulary, not as idioms",
    keep: (t) => {
      const w = t.split(/\s+/);
      return !(w.length === 2 && PARTICLES.has(w[1]));
    },
  },
  {
    name: "no-two-word-with-stopword",
    reason:
      "a two-word entry containing a closed-class function word (say what, " +
      "on demand, as well) is a frame fragment that fires on literal grammar; " +
      "the cost is losing short real idioms like 'at bay', accepted because " +
      "this metric wants precision over recall and says so",
    keep: (t) => {
      const w = t.split(/\s+/);
      return !(w.length === 2 && w.some((x) => STOPWORDS.has(x)));
    },
  },
];

let titles = raw.titles;
const counts = [["fetched", titles.length]];
for (const f of filters) {
  titles = titles.filter(f.keep);
  counts.push([f.name, titles.length]);
}
titles = [...new Set(titles.map((t) => t.trim().toLowerCase()))].sort();
counts.push(["deduplicated", titles.length]);

const header = `# English idioms, derived from Wiktionary.
#
# Source: ${raw.source}
# Licence: ${raw.licence}
# Retrieved: ${raw.retrieved} (${raw.count} raw titles)
# Derived by: scripts/build-idiom-list.mjs — mechanical filters only, each
# with its reason in the script. Re-running the script reproduces this file
# byte for byte from the raw dump.
#
# Filter chain: ${counts.map(([n, c]) => `${n} ${c}`).join(" -> ")}
#
# WHAT THE NUMBER MEANS. A hit count is a lower bound against this list, not
# an absolute measure of figurative language. Two texts are comparable
# because the same list scores both. No entry was added or removed by hand;
# if an entry bothers you, change a filter and re-run, so the change applies
# to the whole list and is visible in this header.
`;

writeFileSync("scripts/data/idioms.txt", header + titles.join("\n") + "\n");
console.log(counts.map(([n, c]) => `${n}: ${c}`).join("\n"));
