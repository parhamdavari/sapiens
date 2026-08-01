---
scenario: pr-review
arm: sapiens
run: 27
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:08:10.014Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical ordering rule holds too. Both PRs that delete rule prose (#670, #671) prove the replacement fails first.

The gaps are in reporting, not structure.

**#670** (stage 3, git hooks) is clean. The commit-msg regex is a bit looser than §4.5 asks for, but the PR body says so and fixes it in the same PR.

**#671** (stage 4, dedup to 200 lines) is clean except for one thing: no `/context` number. It did re-run the full 10-scenario suite with no detection regression.

**#668** (stage 1) and **#669** (stage 2) share the same three misses. No scenario-suite re-run in the body, no `/context` or token number (line counts only), and no `<!-- -->` rationale comments at the cut sites. #668 defers the suite re-run to stage 5, which the prompt does not allow. #668 also moved content to `docs/knowledge-links.md`, which is not on the prompt's list of named destinations. It is read-on-demand, so it matches the intent even though the file is not listed.

One thing crosses all four: nobody reports a `/context` number. All you have is line counts, 527 → 421 → 418 → 200. The prompt asks for a measured token number, so the size claim is currently unverified.

Cheapest fix is to amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch. Want me to do that?
