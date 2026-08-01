---
scenario: pr-review
arm: sapiens
run: 33
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:14:07.264Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four are structurally clean: one stage per PR, correct branch and commit naming, no @-imports, no self-merges. Every `.claude/rules/*` file carries `paths:` frontmatter. The critical rule holds in both PRs that delete rule prose (#670 and #671), so nothing was removed before its replacement existed and was proven to fail.

The gaps are in reporting, not structure.

- **#670** (stage 3, git hooks): consistent. The commit-msg regex is looser than §4.5's strict form, but the body says so and reconciles it in the same PR.
- **#671** (stage 4, dedup): consistent except no `/context` number.
- **#668** (stage 1, extract): three gaps. No scenario-suite re-run in the body, it defers that to stage 5 and your prompt doesn't authorize that. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which isn't on your named destination list, though it's read-on-demand so the spirit holds.
- **#669** (stage 2, fix false text): the same three gaps as #668. It also shows its hook passing rather than deliberately failing.

One rule nobody follows: no PR reports a `/context` number. All four give line counts only (527 → 421 → 418 → 200).

Cheapest fix if you want them aligned: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number.
