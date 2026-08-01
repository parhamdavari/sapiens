---
scenario: pr-orientation
arm: sapiens
run: 26
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:11:45.667Z
generator: benchmarks/generate.mjs
---

It's a correctness and security fix in the orchestrator, six related fixes bundled into one PR. The main one is grounding enforcement, meaning every claim in an agent member's answer must point at the tool call that produced it. Before this, a member could produce a claim without calling any tool, and the run was still marked SUCCEEDED and billed to the user. Now a member that can't cite its source is marked as failed. The other fixes close similar holes, like an empty ontology allow-list that passed everything instead of blocking everything.

It's open and waiting on review. There's one open item the author flagged for the CTO: the new strict rule also fails members that did the real work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet.

I can walk through the other five fixes if you want them.
