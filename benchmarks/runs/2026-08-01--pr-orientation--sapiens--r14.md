---
scenario: pr-orientation
arm: sapiens
run: 14
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:25:01.879Z
generator: benchmarks/generate.mjs
---

Six fixes in one PR, all in the agent orchestrator, and mostly about failing instead of passing silently.

The main one is grounding enforcement. A member could state a claim without ever calling a tool, and the run still finished as SUCCEEDED and charged the user for the tokens. Now every claim has to point at the specific tool call that produced it. A member that can't do that is marked failed.

The other five plug similar holes: compiled members were dispatched with an empty tool array, so nine-member runs completed with zero tool calls. An empty ontology allow-list let everything through instead of blocking everything. SQL imports skipped ontology validation entirely. The knowledge-graph service defaulted to a stub credential broker, which handed the caller the platform's own database connection rather than the user's. Fix 6 is test and telemetry cleanup.

It's open and waiting on review. The author flagged one thing for the CTO instead of deciding alone: the new strict rule also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet.
