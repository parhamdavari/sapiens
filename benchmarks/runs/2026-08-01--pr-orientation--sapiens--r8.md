---
scenario: pr-orientation
arm: sapiens
run: 8
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:09:33.705Z
generator: benchmarks/generate.mjs
---

PR #662 tightens up cases where a run reported success without actually doing the work. The main fix is grounding enforcement: every claim in an agent member's answer now has to point at the tool call that produced it, and a member that can't do that is marked failed. Before this, a member could invent a claim with no tool call at all, and the orchestrator still marked the run SUCCEEDED and charged for the tokens.

Five more fixes ride along in the same PR, mostly in the same spirit. Compiled members were being dispatched with an empty tool list, so nine-member runs finished green with zero tool calls. An empty ontology allow-list was passing everything instead of blocking everything. SQL imports skipped ontology checks. The knowledge-graph service defaulted to a stub credential broker that handed out the platform's database connection instead of the user's.

It's still open and waiting on review. The author also flagged one question for the CTO: the new strict rule fails members that did the real work but didn't cite it in the required format, so the real-model tests don't fully pass yet.

Say the word if you want the detail on any of the six, or on the open question.
