---
scenario: pr-orientation
arm: sapiens
run: 20
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:01:13.346Z
generator: benchmarks/generate.mjs
---

It's a bug-fix PR for grounding enforcement, bundled with five other fail-closed corrections. The main fix: an agent member could make a claim without ever calling a tool, and the run still got marked SUCCEEDED and billed. Now every claim has to point at the tool call that produced it, and a member that can't do that is failed.

The other five cover compiled members being dispatched with no tools at all, an empty ontology allow-list that allowed everything instead of nothing, SQL imports skipping ontology checks, a knowledge-graph service defaulting to a stub credential broker that handed out the platform's own database connection, plus test and telemetry cleanup.

It's still open and waiting on review. One thing blocks it: the new strict rule also fails members that did the work but did not cite it in the required format, so the real-model test suite does not fully pass. The author left that for the CTO to decide.

Want the detail on any of the six, or on the citation-format question?
