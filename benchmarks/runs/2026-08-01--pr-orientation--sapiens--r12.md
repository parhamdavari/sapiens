---
scenario: pr-orientation
arm: sapiens
run: 12
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:16:54.545Z
generator: benchmarks/generate.mjs
---

Bug-fix PR, still open and waiting on review.

The main fix is grounding enforcement. An agent member could produce a claim without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now every claim has to reference the tool call that produced it, and a member that can't do that is marked failed.

Five smaller fixes ride along, mostly checks that were letting things through when they should have blocked them. One example: compiled members were dispatched to the executor with an empty tool array, so nine-member runs finished as SUCCEEDED with zero tool calls.

One thing worth knowing before review: the new strict rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that as a product decision for the CTO rather than deciding alone.

I can list the other four fixes if you want them.
