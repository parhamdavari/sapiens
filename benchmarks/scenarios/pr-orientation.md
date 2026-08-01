# Scenario C — "what is this PR about?" (short orientation question)

## What the user typed
> what is this pr about? https://github.com/OraclousAI/oraclous-backend/pull/662

## Raw facts gathered from the PR (title, description, diff, comments)

PR #662, title: "fix: grounding enforcement + fail-closed corrections".
Status: open, waiting on code review. Not merged. 6 distinct fixes in one PR.

**Fix 1 (the main one) — grounding enforcement.**
An agent "member" could produce a claim in its answer without ever calling a tool.
The orchestrator still marked the whole run as SUCCEEDED and charged the user for the
tokens spent. Now every claim in a member's output must reference the specific tool call
that produced it. A member that cannot do this is marked as failed.

**Fix 2 — compiled members dispatched with no tools.**
Members built by the compiler were being sent to the executor with an empty tool array.
Result: runs with nine members completed with a SUCCEEDED status and zero tool calls total.

**Fix 3 — empty ontology allow-list inverted.**
When the ontology allow-list was empty, the check passed everything instead of blocking
everything. Should be fail-closed (empty list = allow nothing).

**Fix 4 — SQL imports bypassed ontology checks.**
The SQL import path skipped the ontology validation step completely.

**Fix 5 — knowledge-graph service default credential broker.**
The service defaulted to a stub credential broker. In practice this handed the caller
the platform's own database connection rather than the end user's, with no warning.

**Fix 6 — related test/telemetry corrections** rolled into the same PR.

**Open question the author flagged for the CTO, deliberately not decided alone:**
The new strict grading rule also fails members that genuinely did the work but did not
cite it in the required format. Because of this, the real-model test suite does not fully
pass. The author wants a product decision on how strict an uncited-but-correct claim
should be treated.

## Findings checklist

Machine-read by `scripts/lib/recall.mjs`. A finding counts as present when any one of its
patterns appears in the reply, case-insensitive. The patterns are my judgement of
acceptable phrasings, recorded here so that judgement is visible and versioned.

- grounding-main-fix: grounding
- success-despite-no-work: succeeded | charged | billed
- fix-count: six | five smaller | five more
- status-waiting-review: waiting on | not merged | open and
- cto-open-question: cto | product decision | design question
