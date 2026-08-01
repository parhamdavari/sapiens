---
scenario: pr-orientation
arm: sapiens
run: 25
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:11:25.649Z
generator: benchmarks/generate.mjs
---

PR #662 closes a trust hole in agent runs. A member could state a claim without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now every claim in a member's output has to point at the tool call that produced it, and a member that can't do that is marked failed.

Five smaller fixes are in the same PR, mostly fail-closed corrections. Compiled members were being dispatched with an empty tool array, so nine-member runs finished SUCCEEDED with zero tool calls. An empty ontology allow-list passed everything instead of blocking everything. SQL imports skipped ontology validation entirely. The knowledge-graph service defaulted to a stub credential broker, which handed the caller the platform's own database connection instead of the end user's, with no warning.

It's open and waiting on review, not merged. One thing is deliberately undecided: the new strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author wants a product call from the CTO on that. I can go into it if you want.
