import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseChecklist, recall } from "../scripts/lib/recall.mjs";

test("every scenario carries a checklist of at least five findings", () => {
  for (const s of ["pr-review", "ci-triage", "pr-orientation"]) {
    const list = parseChecklist(readFileSync(`benchmarks/scenarios/${s}.md`, "utf8"));
    assert.ok(list.length >= 5, `${s}: ${list.length}`);
    for (const f of list) assert.ok(f.patterns.length >= 1, f.id);
  }
});

test("the frozen pr-review sapiens transcript misses the dropped finding", () => {
  // The known case: the short answer dropped the weak-evidence detail that
  // PR #669 showed its hook passing. The scorer must see the hole.
  const r = recall(
    "benchmarks/scenarios/pr-review.md",
    readFileSync("benchmarks/results/pr-review--sapiens.md", "utf8")
  );
  assert.ok(r.missing.includes("hook-passing-not-failing"), JSON.stringify(r));
  assert.ok(r.found < r.total);
});

test("the frozen pr-review baseline keeps that finding", () => {
  const r = recall(
    "benchmarks/scenarios/pr-review.md",
    readFileSync("benchmarks/results/pr-review--baseline.md", "utf8")
  );
  assert.ok(!r.missing.includes("hook-passing-not-failing"), JSON.stringify(r));
});

test("frozen sapiens transcripts score full recall on the other two scenarios", () => {
  for (const s of ["ci-triage", "pr-orientation"]) {
    const r = recall(
      `benchmarks/scenarios/${s}.md`,
      readFileSync(`benchmarks/results/${s}--sapiens.md`, "utf8")
    );
    assert.equal(r.missing.length, 0, `${s}: missing ${r.missing}`);
  }
});
