---
scenario: pr-orientation
arm: sapiens
run: 7
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:09:10.669Z
generator: benchmarks/generate.mjs
---

Six fixes in one PR, all about the system trusting work it shouldn't. The main one is grounding enforcement: an agent member could state a claim without ever calling a tool, and the orchestrator still marked the run SUCCEEDED and charged for the tokens. Now every claim has to point at the tool call that produced it, and a member that can't do that gets marked failed.

The rest are fail-closed corrections, meaning the default flips from "allow" to "block". An empty ontology allow-list was passing everything instead of nothing. SQL imports skipped the ontology check completely. Compiled members were dispatched with an empty tool array, so nine-member runs finished green with zero tool calls. And the knowledge-graph service defaulted to a stub credential broker that handed over the platform's own database connection rather than the user's.

Still open, waiting on review. The author flagged one question for the CTO: the strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. That's a product decision, not a code fix.
