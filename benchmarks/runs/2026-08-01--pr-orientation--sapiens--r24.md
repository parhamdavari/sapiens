---
scenario: pr-orientation
arm: sapiens
run: 24
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:02:35.546Z
generator: benchmarks/generate.mjs
---

It fixes a case where an agent could make a claim without ever calling a tool, and the run was still marked SUCCEEDED and billed. Now every claim has to point at the tool call that produced it, and a member that can't do that is failed instead.

Five smaller fixes ride along, mostly fail-closed corrections. The notable one: compiled members were being dispatched with an empty tool array, so nine-member runs finished "successful" with zero tool calls.

It's open and waiting on review. The author left one thing undecided for the CTO: the new rule also fails members that did the work but didn't cite it in the right format, so the real-model test suite doesn't fully pass yet.

Want the full list of the six fixes?
