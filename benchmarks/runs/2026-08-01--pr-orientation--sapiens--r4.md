---
scenario: pr-orientation
arm: sapiens
run: 4
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:18:06.825Z
generator: benchmarks/generate.mjs
---

PR #662 is a batch of fail-closed fixes for the agent orchestrator. The main one is grounding enforcement: a member agent could make claims without ever calling a tool, and the run was still marked SUCCEEDED and billed. Now every claim must cite the tool call that produced it, or the member is marked failed.

Five smaller fixes ride along in the same spirit: compiled members were dispatched with empty tool arrays, an empty ontology allow-list passed everything instead of blocking everything, SQL imports skipped ontology checks, the knowledge-graph service defaulted to a stub credential broker that handed out the platform's own database connection, plus test and telemetry corrections.

It's still open and waiting on review. The author flagged one open question for the CTO: the strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. I can go through the individual fixes in more detail if you want.
