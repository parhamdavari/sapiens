---
scenario: pr-review
arm: sapiens
run: 30
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:09:20.152Z
generator: benchmarks/generate.mjs
---

Mostly, yes. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries its `paths:` glob. The critical rule holds too. Neither PR that deletes rule prose (#670 and #671) removes anything before its replacement exists and is proven to fail.

The gaps are all in reporting, not in the work itself.

**#668 and #669** skip three duties: no scenario-suite re-run in the body, no `/context` or token number, and no `<!-- -->` rationale comments at the cut sites. #668 defers the re-run to stage 5, which your prompt does not allow. #669 skips it entirely and shows its hook passing instead of deliberately failing. #668 also moved content to `docs/knowledge-links.md`, which is not on your named destination list. It is read-on-demand, so it matches the intent even if not the letter.

**#671** is clean except for the missing `/context` number. It has a live replacement for every cut, kept the unenforceable text byte-identical, and re-ran the full 10-scenario suite with no detection regression.

**#670** is fully consistent. The commit-msg regex is a bit looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.

One thing worth calling out across all four: no PR reports a `/context` number anywhere. They all give line counts only (527 → 421 → 418 → 200). Line count is not the measurement your prompt asks for.

Cheapest fix is to amend the #668 and #669 bodies with a suite re-run plus a couple of HTML comments, then run `/context` once on the stage-4 branch to get the real number. Want me to do that?
