---
scenario: pr-orientation
arm: sapiens
run: 36
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:19:14.950Z
generator: benchmarks/generate.mjs
---

It closes a set of cases where a run was marked successful without the work actually happening.

The main one: an agent could state an answer without ever calling a tool. The run was still marked successful, and the user was charged for it. Now every claim has to point at the tool call it came from. An agent that cannot do that is marked as failed.

Five smaller fixes go the same direction, mostly checks that let things through when they should have blocked them. One example: runs with nine agents finished as successful with zero tool calls in total.

It is still open and waiting on review. The author left one question for the CTO. The new rule also fails agents that did the work but did not cite it in the required format, so the test suite against real models does not fully pass yet. Someone has to decide how strict that should be.

Want me to go through the other five fixes?
