PR #662 (`fix: grounding enforcement + fail-closed corrections`) is a correctness/safety PR — it's open and still waiting on code review, not merged. It bundles six fixes, and the theme running through all of them is "stop reporting success when the system didn't actually do the work."

**The main fix — grounding enforcement.** An agent member could assert a claim in its answer without ever having called a tool, and the orchestrator would still mark the run SUCCEEDED and bill the user for the tokens. Now every claim in a member's output has to reference the specific tool call that produced it. If a member can't do that, it's marked failed.

**The other five:**

1. **Compiled members dispatched with no tools.** Members coming out of the compiler were handed to the executor with an empty tool array. The visible symptom: nine-member runs finishing SUCCEEDED with zero tool calls total. This is basically the mechanism behind the problem fix 1 catches.
2. **Empty ontology allow-list was inverted.** An empty allow-list passed everything instead of blocking everything. Now fail-closed — empty list means allow nothing.
3. **SQL imports bypassed ontology checks.** The SQL import path skipped ontology validation entirely.
4. **Knowledge-graph service defaulted to a stub credential broker.** In practice that handed the caller the platform's own database connection instead of the end user's, silently.
5. **Related test and telemetry corrections**, rolled into the same PR.

**One thing to know before reviewing:** the author flagged an open question for the CTO rather than deciding it alone. The new strict grading rule also fails members that genuinely did the work but didn't cite it in the required format. Because of that, the real-model test suite doesn't fully pass right now. The decision needed is a product one — how harshly should an uncited-but-correct claim be treated? That's worth resolving before the PR lands, since it determines whether the failing tests are a bug or the intended behavior.
