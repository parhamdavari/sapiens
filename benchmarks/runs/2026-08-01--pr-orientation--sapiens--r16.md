---
scenario: pr-orientation
arm: sapiens
run: 16
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:56:11.723Z
generator: benchmarks/generate.mjs
---

It's a correctness fix for the agent orchestrator. The main one: an agent member could state a claim in its answer without ever calling a tool, and the run still came back as SUCCEEDED with the user charged for the tokens. Now every claim has to point at the tool call that produced it, or the member is marked failed.

Five smaller fixes ride along, mostly other places where a check passed when it should have blocked.

Still open, waiting on review. One thing to know: the new strict rule also fails members that did the work but did not cite it in the required format, so the real-model test suite does not fully pass. The author left that as a product decision for the CTO rather than deciding alone.

Want me to go through the other five fixes?
