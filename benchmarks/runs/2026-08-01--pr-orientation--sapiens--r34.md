---
scenario: pr-orientation
arm: sapiens
run: 34
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:18:34.441Z
generator: benchmarks/generate.mjs
---

It fixes grounding enforcement in the agent orchestrator. Before this, a member could make a claim in its answer without ever calling a tool, and the run was still marked SUCCEEDED and billed to the user. Now every claim has to point at the tool call that produced it. A member that cannot do that is marked as failed.

Five smaller fail-closed fixes ride along in the same PR. One example: an empty ontology allow-list used to allow everything instead of blocking everything.

It is open and waiting on review. The author also flagged one question for the CTO. The strict new rule fails members that did the real work but did not cite it in the required format, so the real-model test suite does not fully pass yet.

Want the full list of all six fixes?
