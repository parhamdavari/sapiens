// Idiom detection against the derived Wiktionary list.
//
// Matching is by exact word sequence, not substring. The text is tokenized
// into lowercase words, and every 2-gram to 6-gram is looked up in the list.
// "in the redirect flow" therefore cannot fire the entry "in the red": the
// token "redirect" is not the token "red". The old substring matcher had
// exactly that bug.
//
// Limits, stated plainly: inflection is not folded ("slipped through the
// cracks" does not match "slip through the cracks"), and an entry that is
// also a literal phrase ("a good deal" of time) still counts. Both make the
// number a lower bound with some noise, comparable between two texts scored
// the same way, never an absolute.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");

const ENTRIES = readFileSync(join(DATA, "idioms.txt"), "utf8")
  .split("\n")
  .filter((l) => l && !l.startsWith("#"));

// Entries are stored as written (low-hanging fruit) but the tokenizer splits
// hyphens, so entries are normalised to spaced form for lookup.
const PHRASES = new Set(ENTRIES.map((e) => e.replace(/-/g, " ")));
const MAX_WORDS = 6;

function tokens(text) {
  return (text.toLowerCase().match(/[a-z][a-z']*/g) || []);
}

export function idiomHits(text) {
  const t = tokens(text);
  const hits = new Set();
  for (let i = 0; i < t.length; i++) {
    let phrase = t[i];
    for (let n = 2; n <= MAX_WORDS && i + n <= t.length; n++) {
      phrase += " " + t[i + n - 1];
      if (PHRASES.has(phrase)) hits.add(phrase);
    }
  }
  return [...hits].sort();
}

export const listSize = ENTRIES.length;
