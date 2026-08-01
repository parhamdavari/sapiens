---
scenario: pr-orientation
arm: sapiens
run: 33
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:18:07.603Z
generator: benchmarks/generate.mjs
---

The PR closes several enforcement holes in the agent orchestrator. It's open and waiting on review.

The main fix: an agent member could state a claim without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now every claim must reference the tool call that produced it. A member that can't do that is marked failed.

Five smaller fixes are in the same PR. The one worth knowing about: compiled members were dispatched with an empty tool array, so runs with nine members finished SUCCEEDED with zero tool calls total. The rest tighten checks that were failing open, meaning they let things through when they should have blocked. An empty ontology allow-list passed everything, SQL imports skipped ontology validation, and the knowledge-graph service defaulted to a stub credential broker that handed callers the platform's own database connection instead of the user's.

One thing is still undecided. The strict grading rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that call to the CTO rather than deciding alone.
