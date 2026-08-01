---
scenario: pr-orientation
arm: sapiens
run: 29
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:12:42.634Z
generator: benchmarks/generate.mjs
---

It is a fix PR with one main change and five smaller ones bundled in. The main fix is grounding enforcement: an agent member could make a claim without ever calling a tool, and the run would still be marked SUCCEEDED and billed to the user. Now every claim has to point at the tool call that produced it, and a member that cannot do that gets marked as failed.

The others are related safety holes. Compiled members were being dispatched with no tools at all, so nine-member runs finished successfully with zero tool calls. An empty ontology allow-list was allowing everything instead of blocking everything. SQL imports skipped the ontology check. The knowledge-graph service defaulted to a stub credential broker, which handed out the platform's own database connection instead of the user's.

It is still open and waiting on review, and the author flagged one thing for the CTO. The new strict rule also fails members that did the work but did not cite it in the right format, so the real-model test suite does not fully pass yet. Someone has to decide how strict to be about a correct-but-uncited claim.

Say the word if you want the detail on any single fix.
