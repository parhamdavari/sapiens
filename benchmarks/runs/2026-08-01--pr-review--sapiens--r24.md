---
scenario: pr-review
arm: sapiens
run: 24
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:58:52.640Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four pass the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical rule holds too. Neither PR that deletes rule prose (#670, #671) removed anything before its replacement existed and was proven to fail.

The gaps are all in reporting, not structure.

**#670** (stage 3, git hooks) is fully consistent. The commit-msg regex is a bit looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR. It quotes the hooks blocking a bad commit and a bad push.

**#671** (stage 4, dedup to 200 lines) is consistent except for one missing `/context` number. Live replacement for every cut, unenforceable text kept byte-identical, full 10-scenario suite re-run with no detection regression.

**#668 and #669** miss the same three reporting duties: no scenario suite re-run in the body, no `/context` or token number (line counts only), and no `<!-- -->` rationale at the cut sites. #668 defers the re-run to stage 5, which your prompt does not authorize. #669 skips it entirely, and shows its hook passing rather than deliberately failing. #668 also moved some content to `docs/knowledge-links.md`, which is not on your named destination list. It is read-on-demand, so the effect matches the intent.

One thing runs across all four: no PR reports a `/context` number anywhere. Everything is line counts, 527 → 421 → 418 → 200.

Cheapest fix if you want it: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, and run `/context` once on the stage-4 branch to record the real number.
