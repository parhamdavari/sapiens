import { test } from "node:test";
import assert from "node:assert/strict";
import { isFamiliar, coverage } from "../scripts/lib/vocab.mjs";
import { words } from "../scripts/lib/text.mjs";

test("headwords match directly", () => {
  for (const w of ["the", "be", "have", "work", "question"]) {
    assert.ok(isFamiliar(w), w);
  }
});

test("regular inflections reduce to headwords", () => {
  for (const w of ["questions", "worked", "working", "carries", "carried", "stopped", "running", "quickly", "easily", "bigger", "biggest"]) {
    assert.ok(isFamiliar(w), w);
  }
});

test("irregular forms map to headwords", () => {
  for (const w of ["went", "children", "was", "better", "thought", "written"]) {
    assert.ok(isFamiliar(w), w);
  }
});

test("contractions and number words are familiar", () => {
  for (const w of ["didn't", "can't", "won't", "we'll", "you're", "it's", "five", "twenty", "first"]) {
    assert.ok(isFamiliar(w), w);
  }
});

test("off-list words are reported, not judged", () => {
  for (const w of ["ontology", "idempotent", "Kincaid", "grep"]) {
    assert.ok(!isFamiliar(w), w);
  }
});

test("hand-counted coverage on a fixture sentence", () => {
  // 10 word tokens; "ontology" and "telemetry" are off-list: 2/10 = 20.0%.
  const c = coverage(words("The ontology check failed and the telemetry numbers went missing."));
  assert.equal(c.tokens, 10);
  assert.equal(c.offList, 2);
  assert.equal(c.offListShare, 20.0);
  assert.deepEqual(c.offListWords.sort(), ["ontology", "telemetry"]);
});

test("hyphenated words are split before matching", () => {
  const c = coverage(words("A well-known fail-closed check."));
  // well, known, fail, closed, a, check are all familiar.
  assert.equal(c.offList, 0);
});
