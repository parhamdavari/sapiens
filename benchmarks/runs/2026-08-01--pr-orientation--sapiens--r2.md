---
scenario: pr-orientation
arm: sapiens
run: 2
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:09:10.463Z
generator: benchmarks/generate.mjs
---

It's a fail-closed hardening PR for the agent orchestrator, still open and waiting on review. The main fix is grounding enforcement: every claim in a member's answer now has to cite the tool call it came from, and a member that can't do that is marked failed. Before this, runs could report SUCCEEDED (and bill the user) with zero tool calls made.

It bundles five smaller fixes in the same spirit: compiled members were dispatched with no tools, an empty ontology allow-list passed everything instead of blocking everything, SQL imports skipped ontology checks entirely, and the knowledge-graph service silently fell back to the platform's own database credentials instead of the user's. Plus related test and telemetry corrections.

One thing to know before reviewing: the strict grading also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that as an open product question for the CTO rather than deciding alone.
