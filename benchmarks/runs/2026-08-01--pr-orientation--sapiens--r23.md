---
scenario: pr-orientation
arm: sapiens
run: 23
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:02:06.861Z
generator: benchmarks/generate.mjs
---

It fixes grounding enforcement in the agent orchestrator. Grounding here means every claim in a member's answer has to point at the tool call that produced it. Before this PR, a member could produce a claim without calling any tool at all. The run still came back SUCCEEDED and the user was charged. Now a member that can't cite its tool call is marked failed.

Five smaller fixes rode along in the same PR, mostly fail-closed corrections:

- Compiled members were dispatched with an empty tool array. Nine-member runs finished SUCCEEDED with zero tool calls total.
- An empty ontology allow-list allowed everything instead of blocking everything.
- SQL imports skipped ontology validation completely.
- The knowledge-graph service defaulted to a stub credential broker, so the caller got the platform's own database connection rather than the end user's, with no warning.
- Test and telemetry corrections.

Still open, waiting on review. The author left one question for the CTO: the new strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet.
