---
scenario: pr-orientation
arm: sapiens
run: 21
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:01:27.186Z
generator: benchmarks/generate.mjs
---

It fixes grounding enforcement in the agent orchestrator. Before this, a member agent could state a claim without ever calling a tool, and the run still came back SUCCEEDED and billed the user for the tokens. Now every claim has to reference the tool call that produced it, and a member that can't do that gets marked failed. Five smaller fail-closed fixes come with it, mostly places where a missing or empty check passed everything instead of blocking it.

Status: open, waiting on review. One thing to know before it merges. The author flagged an open question for the CTO, because the new rule also fails members that genuinely did the work but didn't cite it in the required format. The real-model test suite doesn't fully pass because of that.

Want the rundown of the other five fixes?
