---
scenario: pr-orientation
arm: sapiens
run: 17
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:56:29.296Z
generator: benchmarks/generate.mjs
---

It's a bug-fix PR about grounding, meaning every claim an agent makes has to point at the tool call it came from. The main fix: a member could produce a claim without calling any tool at all. The orchestrator still marked the run SUCCEEDED and charged the user for the tokens. Now a member that can't cite its tool call is marked failed. Five smaller fixes ride along, mostly fail-closed corrections where a missing or empty check let things through instead of blocking them.

It's still open, waiting on review. One thing the author left undecided on purpose: the new rule also fails members that genuinely did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. They want a product decision from the CTO on how strict that case should be.

I can list all six fixes if you want them.
