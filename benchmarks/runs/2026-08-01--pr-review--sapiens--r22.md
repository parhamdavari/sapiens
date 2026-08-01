---
scenario: pr-review
arm: sapiens
run: 22
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:58:13.285Z
generator: benchmarks/generate.mjs
---

Mostly yes. Every structural rule holds across all four. The gaps are in reporting, not in the work itself.

- #670 (stage 3, git hooks): consistent. The commit-msg regex is looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.
- #671 (stage 4, dedup to 200 lines): consistent except for a missing `/context` number. It re-ran the full 10-scenario suite with no detection regression.
- #668 (stage 1, extract derivable content): three gaps. No scenario re-run in the body, because it defers that to stage 5, which your prompt does not authorize. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites.
- #669 (stage 2, fix measured-false text): the same three gaps, and no scenario re-run at all. It also shows its hook passing instead of deliberately failing.

One more thing on #668: it moved some content to `docs/knowledge-links.md`, which is not on your named destination list. That file is read-on-demand, so it fits the intent, but it is off the list as written.

What holds everywhere: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and `paths:` globs on every `.claude/rules/*` file. The critical rule also holds. Neither #670 nor #671 deletes rule prose before its replacement exists and is proven to fail.

The one gap shared by all four is the `/context` number. Nobody reports it. All four give line counts only (527 → 421 → 418 → 200).

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number. Want me to do that?
