---
scenario: pr-orientation
arm: baseline
run: 1
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:07:59.180Z
generator: benchmarks/generate.mjs
---

PR #662: bug-fix bundle, "grounding enforcement + fail-closed corrections". Open, waiting on review. Six fixes, one theme: system trusted agent output too much, now fails closed.

**Main fix — grounding enforcement.** Agent members could emit claims without any tool call behind them. Orchestrator still marked run SUCCEEDED and billed user for tokens. Now every claim must cite the specific tool call that produced it. Member that can't cite = failed.

**Rest:**
1. Compiler dispatched members with empty tool arrays. Nine-member runs "succeeded" with zero tool calls total.
2. Empty ontology allow-list passed everything instead of blocking everything. Now empty = allow nothing.
3. SQL import path skipped ontology validation entirely.
4. Knowledge-graph service defaulted to stub credential broker, which silently handed callers the platform's own DB connection instead of the end user's.
5. Related test/telemetry corrections rolled in.

**Open question flagged for CTO:** new strict rule also fails members that did real work but didn't cite it in required format, so real-model test suite doesn't fully pass. Author wants product decision on how to treat uncited-but-correct claims before merge.
