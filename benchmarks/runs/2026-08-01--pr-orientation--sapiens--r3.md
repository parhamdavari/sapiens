---
scenario: pr-orientation
arm: sapiens
run: 3
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:09:27.451Z
generator: benchmarks/generate.mjs
---

PR #662 is an open bug-fix PR with six related fixes, all making the agent orchestrator fail closed instead of quietly succeeding. The main fix is grounding enforcement: every claim in a member's answer must now cite the tool call that produced it, and a member that cannot is marked failed. Before this, a run could finish with zero tool calls, still get SUCCEEDED status, and still bill the user.

The other fixes follow the same theme. Compiled members were being dispatched with an empty tool array. An empty ontology allow-list passed everything instead of blocking everything. SQL imports skipped ontology validation entirely. And the knowledge-graph service defaulted to a stub credential broker that silently handed callers the platform's own database connection instead of the end user's. Some test and telemetry corrections are rolled in too.

One thing to know before reviewing: the author flagged an open question for the CTO. The strict grading also fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass. They want a product decision on how to treat uncited-but-correct claims rather than deciding alone.
