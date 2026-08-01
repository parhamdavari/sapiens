---
scenario: pr-orientation
arm: sapiens
run: 18
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:56:45.709Z
generator: benchmarks/generate.mjs
---

It fixes a grounding problem in the agent orchestrator. A member could make a claim in its answer without ever calling a tool, and the run was still marked SUCCEEDED and charged to the user. Now every claim has to point at the tool call that produced it, or the member is marked failed.

Five smaller fixes ride along in the same PR. They all make checks block by default instead of letting things through: empty ontology allow-list was passing everything, SQL imports skipped the ontology check, the knowledge-graph service defaulted to a stub credential broker that handed out the platform's own database connection. One of them is bad enough to be its own PR, honestly. Compiled members were being dispatched with an empty tool array, so nine-member runs finished as SUCCEEDED with zero tool calls.

Still open, waiting on review. The author left one question for the CTO: the new strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet. Tell me if you want that part in more detail.
