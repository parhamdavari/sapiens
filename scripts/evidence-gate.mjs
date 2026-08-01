#!/usr/bin/env node
// Requires evidence behind any change to the skill text.
//
//   node scripts/evidence-gate.mjs [base-ref]
//
// The rule this enforces: a pull request that edits skills/sapiens/SKILL.md must also
// add a decision record under benchmarks/runs/, and that record must carry real numbers
// from real transcripts. See docs/edit-protocol.md.
//
// What this gate deliberately does NOT do: generate replies. Generation needs Claude CLI
// credentials, costs tokens per run, and is non-deterministic, so a contributor's pull
// request could fail on variance rather than on their change. Contributors run the
// generation locally and commit the transcripts. This gate checks that they did.
//
// So the gate proves a decision was documented and its evidence exists. It cannot prove
// the decision was correct. A human reviewer still reads the numbers.

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SKILL = "skills/sapiens/SKILL.md";
const RUNS = "benchmarks/runs";
const base = process.argv[2] || process.env.GITHUB_BASE_REF || "main";

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function changedFiles(ref) {
  try {
    const out = execSync(`git diff --name-only --diff-filter=ACMR ${ref}...HEAD`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.split("\n").filter(Boolean);
  } catch {
    console.error(`could not diff against '${ref}'. Fetch it first, or pass a ref.`);
    process.exit(2);
  }
}

console.log(c.bold("\nEvidence gate: skill edits need a decision record"));
console.log(c.dim(`comparing against ${base}\n`));

const changed = changedFiles(base);

// The version line moves on every release and says nothing about behaviour, so a
// release-only bump is not a skill edit.
function bodyChanged(ref) {
  const diff = execSync(`git diff -U0 ${ref}...HEAD -- ${SKILL}`, { encoding: "utf8" });
  return diff
    .split("\n")
    .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
    .some((l) => !/^\s*[+-]\s*version:/.test(l));
}

if (!changed.includes(SKILL)) {
  console.log(c.green("✓") + ` ${SKILL} unchanged, nothing to prove\n`);
  process.exit(0);
}

if (!bodyChanged(base)) {
  console.log(c.green("✓") + ` only the version line changed in ${SKILL}\n`);
  process.exit(0);
}

const records = changed.filter((f) => /^benchmarks\/runs\/DECISION-.+\.md$/.test(f));
const problems = [];

if (!records.length) {
  problems.push(
    `${SKILL} changed, but no new decision record was added under ${RUNS}/.\n` +
    `    Follow docs/edit-protocol.md: before runs, the edit, after runs, then record\n` +
    `    the keep-or-revert decision as ${RUNS}/DECISION-<date>-<topic>.md.`
  );
}

// Each record must carry the evidence, not just a conclusion.
const REQUIRED = [
  { name: "a comparison table", test: (t) => /^\s*\|.+\|.*$/m.test(t) },
  { name: "recall on both sides", test: (t) => /recall/i.test(t) },
  { name: "an explicit decision (kept or reverted)", test: (t) => /\b(kept|reverted|revert)\b/i.test(t) },
  { name: "the model used", test: (t) => /claude-[a-z0-9.\[\]-]+/i.test(t) },
];

for (const rec of records) {
  const text = readFileSync(rec, "utf8");
  for (const r of REQUIRED) {
    if (!r.test(text)) problems.push(`${rec} is missing ${r.name}.`);
  }

  // Every transcript the record cites must exist, so a number cannot point at nothing.
  const cited = [...text.matchAll(/\b(\d{4}-\d{2}-\d{2}--[a-z-]+--[a-z]+--r\d+)\b/g)].map((m) => m[1]);
  for (const t of [...new Set(cited)]) {
    if (!existsSync(join(RUNS, t + ".md"))) {
      problems.push(`${rec} cites transcript ${t}, which is not in ${RUNS}/.`);
    }
  }
}

// A record is worthless if the runs behind it were never committed.
const newTranscripts = changed.filter((f) => /^benchmarks\/runs\/\d{4}-\d{2}-\d{2}--.+\.md$/.test(f));
if (records.length && !newTranscripts.length) {
  problems.push(
    `A decision record was added but no transcripts came with it.\n` +
    `    Commit the runs the decision is based on, so the numbers can be recounted.`
  );
}

if (problems.length) {
  console.log(c.red("✗") + " skill edit is not backed by evidence\n");
  for (const p of problems) console.log("  " + c.red("•") + " " + p);
  console.log("\n" + c.dim("See docs/edit-protocol.md. This gate checks that a decision was"));
  console.log(c.dim("documented and its evidence exists. A reviewer still judges the numbers.\n"));
  process.exit(1);
}

console.log(c.green("✓") + ` skill edit ships with ${records.length} decision record(s)`);
console.log(c.green("✓") + ` ${newTranscripts.length} transcript(s) committed alongside\n`);
