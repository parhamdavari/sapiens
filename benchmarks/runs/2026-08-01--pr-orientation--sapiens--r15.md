---
scenario: pr-orientation
arm: sapiens
run: 15
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:25:34.495Z
generator: benchmarks/generate.mjs
---

It fixes grounding enforcement in the agent orchestrator. A member agent could state a claim without ever calling a tool. The run still came back SUCCEEDED, and the user got charged for the tokens. Now every claim has to reference the tool call that produced it, and a member that can't do that is marked failed.

Five smaller fixes are bundled into the same PR. Most are fail-closed corrections: compiled members being dispatched with an empty tool array, an empty ontology allow-list that passed everything instead of blocking everything, SQL imports skipping ontology checks, and a knowledge-graph service defaulting to a stub credential broker that handed back the platform's own database connection.

It's open and waiting on review, not merged.

One thing worth knowing: the author flagged an open question for the CTO about how strictly to treat a claim that is correct but uncited. Say the word and I'll explain why that's still blocking.
