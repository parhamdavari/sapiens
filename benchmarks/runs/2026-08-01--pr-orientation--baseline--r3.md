---
scenario: pr-orientation
arm: baseline
run: 3
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:08:35.449Z
generator: benchmarks/generate.mjs
---

PR #662: "fix: grounding enforcement + fail-closed corrections". Open, awaiting review. Six fixes bundled.

Main fix: grounding enforcement. Agent member could emit claims without any tool call; orchestrator still marked run SUCCEEDED and billed user. Now every claim must cite specific tool call that produced it, else member fails.

Rest, all fail-closed corrections:

1. Compiler dispatched members with empty tool array. Nine-member runs "succeeded" with zero tool calls total.
2. Empty ontology allow-list passed everything. Now empty = allow nothing.
3. SQL import path skipped ontology validation entirely. Now checked.
4. Knowledge-graph service defaulted to stub credential broker. Handed caller platform's own DB connection instead of end user's, no warning.
5. Related test/telemetry corrections.

One open question, flagged for CTO: new strict grading also fails members that did work correctly but didn't cite in required format. Real-model test suite doesn't fully pass because of this. Author wants product decision on how to treat uncited-but-correct claims, not deciding alone.
