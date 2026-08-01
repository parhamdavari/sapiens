import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { syllables, grades } from "../scripts/lib/formulas.mjs";
import { splitSentences, words } from "../scripts/lib/text.mjs";

test("syllable counter on a hand-checked word set", () => {
  const expected = {
    cat: 1, warm: 1, make: 1, close: 1, table: 2, little: 2,
    reading: 2, sentence: 2, formula: 3, readable: 3, calibration: 4,
  };
  for (const [w, n] of Object.entries(expected)) {
    assert.equal(syllables(w), n, `syllables(${w})`);
  }
});

test("micro-fixture: hand-counted exact values", () => {
  // "The cat sat on the mat." = 6 words, 6 syllables, 17 letters, 1 sentence.
  // FK  = 0.39*6 + 11.8*1 - 15.59            = -1.45
  // CLI = 0.0588*(17/6*100) - 0.296*(1/6*100) - 15.8 = -4.07 (2dp at 1dp: -4.1)
  // ARI = 4.71*(17/6) + 0.5*6 - 21.43        = -5.08
  const w = words("The cat sat on the mat.");
  const s = splitSentences("The cat sat on the mat.");
  const g = grades(w, s);
  assert.equal(g.fleschKincaid, -1.4);
  assert.equal(g.colemanLiau, -4.1);
  assert.equal(g.ari, -5.1);
  assert.equal(g.grade, -4.1); // median
});

test("median and spread", () => {
  const g = grades(words("The cat sat on the mat."), ["one sentence"]);
  assert.ok(g.grade >= Math.min(g.fleschKincaid, g.colemanLiau, g.ari));
  assert.ok(g.grade <= Math.max(g.fleschKincaid, g.colemanLiau, g.ari));
});

test("calibration passages within tolerance of textstat reference", () => {
  const cal = JSON.parse(readFileSync("tests/fixtures/calibration.json", "utf8"));
  for (const [name, p] of Object.entries(cal.passages)) {
    const text = readFileSync(`tests/fixtures/${p.file}`, "utf8");
    const g = grades(words(text), splitSentences(text));
    for (const [formula, ref] of Object.entries(p.expected)) {
      const got = g[formula];
      const tol = cal.tolerance[formula];
      assert.ok(
        Math.abs(got - ref) <= tol,
        `${name} ${formula}: got ${got}, reference ${ref}, tolerance ${tol}`
      );
    }
  }
});
