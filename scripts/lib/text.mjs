// Text preparation shared by measure.mjs and self-check.mjs.
//
// toProse strips everything a reader does not parse as running prose: markdown
// syntax, code, tables, HTML, transcript markers. Without it, measuring a README
// measures its markup.
//
// splitSentences segments prose without breaking on common abbreviations or
// decimals. The abbreviation set is a visible constant, not a heuristic. "etc."
// is deliberately treated as non-splitting: it sometimes ends a real sentence,
// but treating it as a boundary breaks the mid-sentence case, and a missed
// split only merges two short sentences while a false split manufactures two
// fragments that skew every per-sentence metric.

// Abbreviations whose trailing period never ends a sentence for our purposes.
export const ABBREVIATIONS = [
  "e.g.", "i.e.", "vs.", "etc.", "cf.", "et al.",
  "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "approx.",
];

const MASK = "\u0001"; // control char as a period stand-in, never occurs in prose

export function splitSentences(text) {
  let masked = text;
  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    masked = masked.replace(
      new RegExp(`(^|[\\s(])(${escaped})\\.`, "gi"),
      (_, pre, body) => pre + body + MASK
    );
  }
  return masked
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replaceAll(MASK, ".").trim())
    .filter(Boolean);
}

// Strip everything that isn't prose the reader parses as a sentence: transcript
// markers, HTML, code blocks and spans, tables, link targets, and markdown
// punctuation.
export function toProse(raw, { dropQuotes = false } = {}) {
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, " ")   // YAML frontmatter is metadata, not prose
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(dropQuotes ? /^\s*>.*$/gm : /(?!)/g, " ")   // blockquotes are quoted material
    // Inline double-quoted strings are quoted material too: a doc that mentions
    // a banned phrase ("Feel free to reach out") is not using it. Same scope
    // rule as blockquotes, same documented hole: quoting your own sentence
    // would evade the check. Straight and curly quotes, within one line.
    .replace(dropQuotes ? /["“][^"“”\n]{1,120}["”]/g : /(?!)/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*\|.*\|\s*$/gm, " ")          // table rows
    .replace(/^---MESSAGE---.*$/gm, " ")
    .replace(/\bNONE\b/g, " ")
    .replace(/`[^`]*`/g, " ")                  // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // images carry no prose
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // links keep their text, drop the target
    .replace(/^[\s·|—–-]*$/gm, " ")             // separator-only lines (badge rows, nav rows)
    .replace(/^\s*#{1,6}\s.*$/gm, " ")        // headings are labels, not sentences
    .replace(/^\s*[-*+]\s+(.*?)\s*$/gm, "$1. ")
    .replace(/^\s*\d+\.\s+(.*?)\s*$/gm, "$1. ")
    .replace(/[#*>|_]/g, " ")
    .replace(/\n\s*\n/g, ". ")                // a blank line ends a sentence
    .replace(/\s+/g, " ")
    .replace(/(\s*\.)+/g, ".")
    .trim();
}

export function words(text) {
  return text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
}
