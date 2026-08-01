---
scenario: pr-orientation
arm: sapiens
run: 10
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:16:25.622Z
generator: benchmarks/generate.mjs
---

It's a fix PR that closes a trust hole in the agent runs. An agent member could make a claim in its answer without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged for the tokens. Now every claim has to point at the tool call that produced it, and a member that can't do that is marked failed.

Five smaller fixes ride along, mostly in the same area: compiled members were being dispatched with an empty tool array (nine-member runs finished with zero tool calls), an empty ontology allow-list allowed everything instead of blocking everything, SQL imports skipped the ontology check entirely, and the knowledge-graph service defaulted to a stub credential broker that handed out the platform's own database connection instead of the user's.

Still open, waiting on review.

One thing to know if you're reviewing it: the new strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author left that as an open question for the CTO rather than deciding alone. I can pull up the details of that question if it's relevant to you.
