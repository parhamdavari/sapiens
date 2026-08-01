---
scenario: pr-review
arm: sapiens
run: 15
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:14:22.851Z
generator: benchmarks/generate.mjs
---

Mostly consistent. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no self-merge, and `paths:` frontmatter on every `.claude/rules/*` file. The critical rule holds too. Neither #670 nor #671 deletes rule prose before its replacement exists and is proven to fail.

The gaps are all in reporting, not in the work.

**#668 and #669** miss three things each: no scenario-suite re-run in the PR body, no `/context` or token number, and no `<!-- -->` rationale comments at the cut sites. #668 defers the suite re-run to stage 5, which your prompt does not authorize. #669 skips it entirely and shows its hook passing instead of deliberately failing. #668 also moved content to `docs/knowledge-links.md`, which is not on your named destination list. It is read-on-demand, so it does not break the intent.

**#670** is clean. The commit-msg regex is slightly looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.

**#671** is clean except for the missing `/context` number.

That last one is the pattern: no PR anywhere reports a `/context` number. All four give line counts only, 527 → 421 → 418 → 200.

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus a few HTML comments, then run `/context` once on the stage-4 branch. Want me to do that?
