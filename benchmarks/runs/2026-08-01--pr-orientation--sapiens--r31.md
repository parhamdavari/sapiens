---
scenario: pr-orientation
arm: sapiens
run: 31
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:17:27.562Z
generator: benchmarks/generate.mjs
---

The PR fixes grounding enforcement in the orchestrator. A member agent could state a claim in its answer without ever calling a tool, and the run still came back SUCCEEDED and charged the user for the tokens. Now every claim has to reference the tool call that produced it, and a member that can't do that is marked failed.

Five smaller fail-closed fixes are in the same PR, meaning the default flips to blocking instead of allowing. The biggest one: compiled members were dispatched with an empty tool array, so nine-member runs finished SUCCEEDED with zero tool calls total.

It's open and waiting on review. One thing is holding it: the new strict rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that as a product decision for the CTO rather than deciding alone.

I can list the other four fixes if you want them.
