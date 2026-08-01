---
scenario: pr-orientation
arm: sapiens
run: 32
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:17:56.110Z
generator: benchmarks/generate.mjs
---

It's a fix PR for grounding enforcement, meaning a member agent now has to point at the tool call that produced each claim in its answer. Before this, a member could make up a claim with no tool call at all, and the run would still be marked SUCCEEDED and billed. Two related bugs came with it: compiled members were dispatched with an empty tool array, so nine-member runs finished with zero tool calls, and an empty ontology allow-list let everything through instead of blocking everything.

Five more fixes are bundled in, all in the same fail-closed direction. It's still open and waiting on review.

One thing to know: the new rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author is asking the CTO how strict that should be. I can walk through the other three fixes or that open question if you want.
