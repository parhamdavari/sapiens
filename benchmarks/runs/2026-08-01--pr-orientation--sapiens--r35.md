---
scenario: pr-orientation
arm: sapiens
run: 35
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:18:52.758Z
generator: benchmarks/generate.mjs
---

It closes a hole where an agent member could state a claim without ever calling a tool, and the run was still marked successful and billed. Now every claim has to point at the tool call that produced it, and a member that cannot do that is marked as failed.

Five smaller fixes ride along in the same direction: things that used to fail open now fail closed. One of them is worth knowing about on its own, because a service was defaulting to the platform's own database credentials instead of the end user's, with no warning.

The PR is open and waiting on review. One decision is still unresolved. The strict rule also fails members that genuinely did the work but did not cite it in the required format, so the real-model tests do not fully pass. The author is asking the CTO how strict that case should be.

I can walk through the six fixes one by one if you want them.
