import { test } from "node:test";
import assert from "node:assert/strict";
import { splitSentences, toProse, words } from "../scripts/lib/text.mjs";

test("abbreviations do not end sentences", () => {
  const s = splitSentences(
    "We compare A vs. B in stage 4. It works, e.g. on macOS. Version 3.4.0 shipped today."
  );
  assert.equal(s.length, 3);
  assert.equal(s[0], "We compare A vs. B in stage 4.");
  assert.equal(s[1], "It works, e.g. on macOS.");
});

test("titles do not end sentences", () => {
  const s = splitSentences("Dr. Smith agreed. Mr. Jones did not. Ms. Lee abstained.");
  assert.equal(s.length, 3);
});

test("decimals and versions stay whole", () => {
  const s = splitSentences("Coverage rose to 98.5 percent. Version 3.4.0 is out.");
  assert.equal(s.length, 2);
});

test("i.e. mid-sentence, case-insensitive", () => {
  const s = splitSentences("Fail closed, i.e. block by default. That is the rule.");
  assert.equal(s.length, 2);
  const s2 = splitSentences("Fail closed, I.E. block by default. That is the rule.");
  assert.equal(s2.length, 2);
});

test("question and exclamation marks split", () => {
  const s = splitSentences("Does it work? It does! Good.");
  assert.equal(s.length, 3);
});

test("etc. is treated as non-splitting by documented choice", () => {
  const s = splitSentences("Files, tables, etc. and more follow. Second sentence here.");
  assert.equal(s.length, 2);
});

test("toProse strips code, tables, headings, link targets", () => {
  const raw = [
    "# Heading",
    "",
    "Real prose here.",
    "",
    "```js",
    "const x = 1;",
    "```",
    "",
    "| a | b |",
    "|---|---|",
    "| 1 | 2 |",
    "",
    "A [link text](https://example.com) survives as text.",
  ].join("\n");
  const t = toProse(raw);
  assert.ok(!t.includes("Heading"));
  assert.ok(!t.includes("const x"));
  assert.ok(!t.includes("|"));
  assert.ok(!t.includes("example.com"));
  assert.ok(t.includes("Real prose here."));
  assert.ok(t.includes("link text"));
});

test("toProse dropQuotes removes blockquotes only when asked", () => {
  const raw = "Kept prose.\n\n> quoted material here\n\nMore prose.";
  assert.ok(toProse(raw).includes("quoted material"));
  assert.ok(!toProse(raw, { dropQuotes: true }).includes("quoted material"));
});

test("words counts only tokens containing letters", () => {
  assert.equal(words("one two 3 4.5 six").length, 3);
});
