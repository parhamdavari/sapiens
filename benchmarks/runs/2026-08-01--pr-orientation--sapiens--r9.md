---
scenario: pr-orientation
arm: sapiens
run: 9
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:09:46.698Z
generator: benchmarks/generate.mjs
---

It's about grounding enforcement, meaning every claim an agent makes has to point at the tool call it came from. The main fix: a member could state a claim without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now a member that can't cite its tool calls is marked failed.

Five smaller fixes come along with it, mostly the same shape. Things that should have failed closed were passing instead. An empty ontology allow-list allowed everything instead of blocking everything, SQL imports skipped ontology validation entirely, compiled members were being dispatched with an empty tool array (so nine-member runs finished SUCCEEDED with zero tool calls), and the knowledge-graph service defaulted to a stub credential broker that handed out the platform's own database connection rather than the user's.

Still open, waiting on review. The author left one decision for the CTO: the new strict rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet.
