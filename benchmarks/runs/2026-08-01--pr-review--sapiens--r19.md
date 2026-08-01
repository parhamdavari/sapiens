---
scenario: pr-review
arm: sapiens
run: 19
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:57:01.950Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit names, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` frontmatter. The critical rule holds too, in both PRs that delete rule prose (#670 and #671) the replacement exists and is proven to fail first.

The gaps are all in reporting, not in the work itself.

- **#670** (stage 3, git hooks) is clean. The commit-msg regex is a bit looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.
- **#671** (stage 4, dedup) is clean except for one thing: no `/context` number. It has a live replacement for every cut and re-ran the full 10-scenario suite with no detection regression.
- **#668** (stage 1, extract) misses three reporting duties. No scenario re-run in the body, it defers that to stage 5 and your prompt does not authorize that. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though the file is read-on-demand so it does not break anything.
- **#669** (stage 2, fix measured-false text) misses the same three. It also shows its hook passing instead of deliberately failing.

The one thing true across all four: no PR reports a `/context` number anywhere. Everything is line counts (527 → 421 → 418 → 200).

Cheap fix if you want it: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number.
