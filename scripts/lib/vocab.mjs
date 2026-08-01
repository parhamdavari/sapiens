// Familiar-word coverage against the vendored NGSL headword list.
//
// Reports the share of word tokens that are NOT covered by the list. Lower is
// plainer. The metric measures the skill's stated vocabulary claim; the grade
// formulas cannot, because they only see word length.
//
// Matching order for each token, first hit wins:
//   1. the token itself is a headword
//   2. the irregular-forms table maps it to a headword
//   3. a regular inflection rule reduces it to a headword
//
// The suffix rules cover inflection only (plural, tense, -ing, comparative,
// adverbial -ly). Derivation (-ness, -ment, -tion) is deliberately not
// reduced: "government" being familiar is a fact about the list, not about
// suffix arithmetic, and the NGSL carries frequent derived forms as their own
// headwords.
//
// What the number is not: a judgement about any single word. Proper nouns,
// file names, and technical terms all count as off-list. The number compares
// two texts scored the same way; it is not an absolute.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");

function loadList(file) {
  return readFileSync(join(DATA, file), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"));
}

const HEADWORDS = new Set([...loadList("ngsl.txt"), ...loadList("ngsl-supplement.txt")]);
const IRREGULAR = new Map(
  loadList("irregular-forms.txt").map((l) => {
    const [form, head] = l.split("\t");
    return [form.toLowerCase(), head.toLowerCase()];
  })
);

// Regular inflection reductions, tried in order. Each candidate is checked
// against the headword set; the first headword found wins.
function reductions(t) {
  const out = [];
  const push = (s) => s.length > 1 && out.push(s);
  if (t.endsWith("n't")) push(t.slice(0, -3));   // didn't -> did (irregulars map onward)
  for (const c of ["'ll", "'re", "'ve", "'d", "'m", "'s"]) {
    if (t.endsWith(c)) push(t.slice(0, -c.length));
  }
  if (t.endsWith("'s")) push(t.slice(0, -2));
  if (t.endsWith("s'")) push(t.slice(0, -2));
  if (t.endsWith("ies")) push(t.slice(0, -3) + "y");
  if (t.endsWith("es")) push(t.slice(0, -2));
  if (t.endsWith("s")) push(t.slice(0, -1));
  if (t.endsWith("ied")) push(t.slice(0, -3) + "y");
  if (t.endsWith("ed")) { push(t.slice(0, -2)); push(t.slice(0, -1)); }
  if (t.endsWith("ing")) {
    push(t.slice(0, -3));
    push(t.slice(0, -3) + "e");
    if (t.length > 4 && t[t.length - 4] === t[t.length - 5]) push(t.slice(0, -4)); // running -> run
  }
  if (t.endsWith("ily")) push(t.slice(0, -3) + "y");
  if (t.endsWith("ly")) push(t.slice(0, -2));
  if (t.endsWith("ier")) push(t.slice(0, -3) + "y");
  if (t.endsWith("iest")) push(t.slice(0, -4) + "y");
  if (t.endsWith("er")) { push(t.slice(0, -2)); push(t.slice(0, -1)); }
  if (t.endsWith("est")) { push(t.slice(0, -3)); push(t.slice(0, -2)); }
  // doubled final consonant: "stopped" -> "stop", "bigger" -> "big"
  if (t.endsWith("ed") && t.length > 4 && t[t.length - 3] === t[t.length - 4]) push(t.slice(0, -3));
  if (t.endsWith("er") && t.length > 4 && t[t.length - 3] === t[t.length - 4]) push(t.slice(0, -3));
  if (t.endsWith("est") && t.length > 5 && t[t.length - 4] === t[t.length - 5]) push(t.slice(0, -4));
  return out;
}

export function isFamiliar(token) {
  const t = token.toLowerCase();
  if (HEADWORDS.has(t)) return true;
  if (IRREGULAR.has(t)) return true;
  return reductions(t).some((r) => HEADWORDS.has(r) || IRREGULAR.has(r));
}

// Tokens: hyphenated words split into parts, possessives and case folded.
export function coverage(words) {
  const tokens = words
    .flatMap((w) => w.split(/[-–]/))
    .map((w) => w.replace(/[^a-zA-Z']/g, ""))
    .filter((w) => /[a-zA-Z]/.test(w));
  if (!tokens.length) return { tokens: 0, offList: 0, offListShare: 0, offListWords: [] };
  const off = tokens.filter((t) => !isFamiliar(t));
  return {
    tokens: tokens.length,
    offList: off.length,
    offListShare: +((off.length / tokens.length) * 100).toFixed(1),
    offListWords: [...new Set(off.map((t) => t.toLowerCase()))],
  };
}
