---
scenario: pr-orientation
arm: sapiens
run: 28
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:12:16.917Z
generator: benchmarks/generate.mjs
---

Six fixes, all about runs being marked SUCCEEDED when nothing real happened.

The main one: an agent member could make a claim without ever calling a tool, and the orchestrator still marked the run successful and charged the user for the tokens. Now every claim has to point at the tool call that produced it, or the member is marked failed. Related, compiled members were being dispatched with an empty tool array, so runs with nine members finished successfully with zero tool calls total.

The rest are fail-closed corrections. An empty ontology allow-list was passing everything instead of blocking everything. SQL imports skipped the ontology check entirely. The knowledge-graph service defaulted to a stub credential broker, which handed the caller the platform's own database connection instead of the user's.

Still open, waiting on review. The author left one product decision for the CTO: the strict rule also fails members that did the work but did not cite it in the required format, so the real-model test suite does not fully pass. Say the word if you want that part in detail.
