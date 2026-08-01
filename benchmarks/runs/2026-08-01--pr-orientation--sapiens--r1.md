---
scenario: pr-orientation
arm: sapiens
run: 1
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T12:13:36.834Z
generator: benchmarks/generate.mjs
---

PR #662 is a batch of fail-closed security and correctness fixes for the agent platform. The main fix is grounding enforcement: every claim in a member's answer must now cite the tool call that produced it, and a member that can't do that is marked failed. Before, a member could answer with zero tool calls and the run still counted as SUCCEEDED and billed the user.

The other fixes follow the same fail-closed theme: compiled members were dispatched with empty tool arrays, an empty ontology allow-list passed everything instead of blocking everything, SQL imports skipped ontology validation entirely, and the knowledge-graph service defaulted to a stub credential broker that silently handed callers the platform's own database connection. Some test and telemetry corrections ride along.

It's open and waiting on review. One open question is flagged for the CTO: the strict grading also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author wants a product decision on how to treat uncited-but-correct claims.
