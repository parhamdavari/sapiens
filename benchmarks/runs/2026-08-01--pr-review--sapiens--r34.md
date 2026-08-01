---
scenario: pr-review
arm: sapiens
run: 34
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:14:30.316Z
generator: benchmarks/generate.mjs
---

Mostly yes. Two of the four follow the prompt file fully. Two skip the same reporting rules.

**#670** (stage 3, git hooks): consistent. The commit-msg regex is looser than the strict form in §4.5, but the PR body says so and reconciles it in the same PR.

**#671** (stage 4, dedup to 200 lines): consistent except one gap, no `/context` number. Every cut has a live replacement, the unenforceable text stayed byte-identical, and the full 10-scenario suite re-ran with no detection regression.

**#668** (stage 1, extract derivable content): structurally clean, three gaps. No scenario-suite re-run in the body, it defers that to stage 5, which your prompt does not authorize. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list. That file is read-on-demand, so the effect matches the intent.

**#669** (stage 2, fix measured-false text): same three gaps as #668, and the re-run is missing entirely rather than deferred. It also shows its hook passing instead of deliberately failing, so there is no proof the replacement blocks anything.

Across all four: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The delete-order rule holds in both PRs that remove rule prose (#670 and #671). The one gap everywhere is the measurement. No PR reports a `/context` number, all four give line counts only (527 → 421 → 418 → 200).

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number. Want me to do that?
