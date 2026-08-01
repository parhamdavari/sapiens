---
scenario: pr-orientation
arm: sapiens
run: 5
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:18:25.837Z
generator: benchmarks/generate.mjs
---

It's a bug-fix PR that makes the agent orchestrator fail-closed instead of quietly passing bad runs. The main fix is grounding enforcement: every claim a member makes must now cite the tool call it came from, and a member that can't is marked failed. Before, a member could answer with no tool calls at all and the run still counted as SUCCEEDED and got billed. Five smaller fixes ride along, all the same theme: compiled members dispatched with no tools, an empty ontology allow-list that passed everything instead of blocking everything, SQL imports skipping ontology checks, and a knowledge-graph service that defaulted to the platform's own database credentials.

It's open and waiting on review. The author also flagged one decision for the CTO: the strict rule fails members that did the work but didn't cite it in the required format, so the real-model test suite doesn't fully pass yet. I can go through the six fixes in detail if you want.
