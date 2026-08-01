---
scenario: pr-orientation
arm: sapiens
run: 30
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:12:55.425Z
generator: benchmarks/generate.mjs
---

It's a fix PR, six fixes bundled together, and the main one is grounding enforcement. Grounding here means every claim in an agent member's answer has to point at the tool call that produced it. Before this, a member could state a claim without calling any tool at all, and the orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now a member that can't cite its source is marked failed.

The other five are mostly fail-closed corrections. Compiled members were being dispatched with an empty tool array, so nine-member runs finished SUCCEEDED with zero tool calls. An empty ontology allow-list was passing everything instead of blocking everything. SQL imports skipped the ontology check completely. And the knowledge-graph service defaulted to a stub credential broker, which in practice handed the caller the platform's own database connection instead of the user's.

Still open, waiting on review. One thing worth knowing before you read it: the strict new rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that as an open product decision for the CTO rather than calling it alone.
