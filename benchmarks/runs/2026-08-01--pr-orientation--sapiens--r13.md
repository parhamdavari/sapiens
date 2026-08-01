---
scenario: pr-orientation
arm: sapiens
run: 13
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:17:16.060Z
generator: benchmarks/generate.mjs
---

Six fixes in one PR, all on the same theme: the orchestrator was trusting output it shouldn't. The main one is grounding enforcement. An agent member could state a claim without ever calling a tool, and the run still came back SUCCEEDED and charged the user for the tokens. Now every claim has to reference the tool call that produced it, and a member that can't do that is marked failed.

The other five make checks block by default instead of pass by default:

- compiled members were dispatched with an empty tool array, so nine-member runs finished SUCCEEDED with zero tool calls
- an empty ontology allow-list passed everything instead of blocking everything
- SQL imports skipped ontology validation completely
- the knowledge-graph service defaulted to a stub credential broker, which handed the caller the platform's own database connection instead of the user's, with no warning
- related test and telemetry corrections

Still open, waiting on review. One thing is deliberately undecided: the new strict rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. The author wants the CTO to decide how strict that should be. Tell me if you want the detail on that part.
