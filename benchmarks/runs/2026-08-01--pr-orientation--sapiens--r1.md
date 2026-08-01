---
scenario: pr-orientation
arm: sapiens
run: 1
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:08:51.061Z
generator: benchmarks/generate.mjs
---

It's a batch of fail-closed fixes for the agent orchestrator, still open and waiting on review. The main fix is grounding enforcement: every claim a member makes must now point at the tool call that produced it, and a member that can't do that is marked failed. Before, members could answer with zero tool calls and the run still counted as succeeded and got billed. Five smaller fixes ride along, mostly closing similar holes (empty tool arrays, an inverted ontology allow-list, SQL imports skipping validation, a stub credential broker handing out the platform's own database connection).

One thing to know: the stricter grading also fails members that did the work but didn't cite it, so the real-model test suite doesn't fully pass. The author flagged that for the CTO as a product decision. I can go through the six fixes in detail if you want.
