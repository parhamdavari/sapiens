---
scenario: pr-orientation
arm: baseline
run: 2
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:08:18.917Z
generator: benchmarks/generate.mjs
---

PR #662: security/correctness fixes for grounding + fail-closed behavior. Open, waiting on review. 6 fixes bundled:

1. **Grounding enforcement (main fix).** Member could make claims without tool calls; orchestrator still marked run SUCCEEDED, charged user. Now every claim must cite tool call that produced it, else member fails.
2. **Compiled members got empty tool array.** 9-member runs "succeeded" with zero tool calls.
3. **Empty ontology allow-list passed everything.** Now fail-closed: empty = allow nothing.
4. **SQL import path skipped ontology validation.**
5. **Knowledge-graph service defaulted to stub credential broker** — handed caller platform's own DB connection instead of user's, silently.
6. Related test/telemetry corrections.

Open question flagged for CTO: strict grading also fails members that did work correctly but didn't cite in required format, so real-model test suite doesn't fully pass. Author wants product decision on how harsh to treat uncited-but-correct claims. That's why PR not merged yet.
