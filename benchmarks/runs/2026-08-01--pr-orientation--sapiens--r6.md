---
scenario: pr-orientation
arm: sapiens
run: 6
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:18:52.816Z
generator: benchmarks/generate.mjs
---

PR #662 fixes a trust problem in the agent orchestrator: runs could be marked successful and billed even when the agents never actually did the work. It's open, waiting on review.

The main fix is grounding enforcement, meaning every claim in an agent's answer must point to the tool call that produced it. Before, an agent could invent an answer with zero tool calls and the run still counted as SUCCEEDED. Five smaller fixes ride along, mostly making checks fail closed: an empty ontology allow-list now blocks everything instead of allowing everything, SQL imports no longer skip validation, and compiled agents no longer get dispatched with an empty tool list.

One thing to know before reviewing: the author flagged an open product question for the CTO. The strict rule also fails agents that did the work correctly but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet. I can go through the individual fixes in more detail if you want.
