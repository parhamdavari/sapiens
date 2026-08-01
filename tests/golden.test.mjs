// Golden snapshots for toProse. If a stripper change moves these, every
// published number moves with it. Regenerate deliberately, never casually:
//   node -e "..." (see tests/fixtures/ header note in the repo history)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toProse } from "../scripts/lib/text.mjs";

test("toProse of the README is byte-stable", () => {
  const got = toProse(readFileSync("README.md", "utf8"), { dropQuotes: true }) + "\n";
  assert.equal(got, readFileSync("tests/fixtures/golden-readme.txt", "utf8"));
});

test("toProse of a frozen transcript is byte-stable", () => {
  const got = toProse(readFileSync("benchmarks/results/ci-triage--baseline.md", "utf8")) + "\n";
  assert.equal(got, readFileSync("tests/fixtures/golden-transcript.txt", "utf8"));
});
