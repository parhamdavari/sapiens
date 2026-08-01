---
scenario: pr-orientation
arm: sapiens
run: 11
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:16:37.479Z
generator: benchmarks/generate.mjs
---

It's a fix PR for grounding enforcement in the agent orchestrator. Grounding here means every claim in a member's answer has to point at the tool call that produced it. The bug: a member could make a claim without calling any tool at all, and the run was still marked SUCCEEDED and billed to the user. Now a member that can't cite its tool call gets failed.

Five smaller fixes ride along in the same PR. Compiled members were being dispatched with an empty tool array, an empty ontology allow-list was allowing everything instead of blocking everything, SQL imports skipped ontology checks entirely, and the knowledge-graph service defaulted to a stub credential broker that handed callers the platform's own DB connection instead of the user's.

Still open, waiting on review. The author flagged one thing for the CTO: the strict rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet. Say the word if you want the six fixes one by one.
