// Findings recall: did a reply keep the facts the fixture says a correct
// answer must contain?
//
// This is the metric class the other columns cannot see. Every other number
// rewards shorter and plainer; this one is the counterweight, because a reply
// that got shorter by silently dropping a finding must score worse, not
// better. The dropped-#669-detail case in benchmarks/results is the motivating
// example, and the test suite asserts this scorer catches it.
//
// The checklist lives in the scenario file under "## Findings checklist", one
// finding per line: `- id: pattern | pattern | ...`. A finding is present when
// any pattern appears in the reply, case-insensitive, after the same prose
// stripping the other metrics use. The patterns are the scenario author's
// judgement of acceptable phrasings; keeping them in the fixture keeps that
// judgement visible and versioned instead of buried in scorer code.

import { readFileSync } from "node:fs";
import { toProse } from "./text.mjs";

export function parseChecklist(scenarioRaw) {
  const section = scenarioRaw.split(/^## Findings checklist$/m)[1];
  if (!section) return [];
  return [...section.matchAll(/^- ([a-z0-9-]+):\s*(.+)$/gm)].map(([, id, pats]) => ({
    id,
    patterns: pats.split("|").map((p) => p.trim().toLowerCase()).filter(Boolean),
  }));
}

export function recall(scenarioPath, replyRaw) {
  const checklist = parseChecklist(readFileSync(scenarioPath, "utf8"));
  const text = toProse(replyRaw).toLowerCase();
  const missing = checklist
    .filter((f) => !f.patterns.some((p) => text.includes(p)))
    .map((f) => f.id);
  return {
    total: checklist.length,
    found: checklist.length - missing.length,
    missing,
    share: checklist.length
      ? +(((checklist.length - missing.length) / checklist.length) * 100).toFixed(0)
      : 100,
  };
}
