---
scenario: pr-review
arm: sapiens
run: 5
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:16:07.693Z
generator: benchmarks/generate.mjs
---

Mostly consistent. #670 and #671 are close to fully compliant; #668 and #669 skip the same three reporting duties; and no PR anywhere reports a `/context` number.

**#670 (stage 3, git hooks): consistent, no action needed.** One nuance: the commit-msg regex is slightly looser than the prompt's strict form, but the PR body discloses this and reconciles it in the same PR.

**#671 (stage 4, dedup to 200 lines): consistent except one gap.** It has a live replacement for every cut and re-ran the full 10-scenario suite with no regression, but gives no `/context` number.

**#668 (stage 1) and #669 (stage 2): structurally clean but missing the reporting duties.** Both have correct naming, one stage, and no @-imports. Both lack a scenario-suite re-run, a measurement number, and the HTML-comment rationale at cut sites. #668 defers the re-run to stage 5, which the prompt does not authorize. It also moved content to `docs/knowledge-links.md`, which is not on the prompt's destination list, though it is read-on-demand so it is harmless in spirit. #669 shows its hook passing instead of deliberately failing.

The critical rule holds: both PRs that delete rule prose (#670, #671) prove the replacement fails a bad input first. All four keep one stage per PR, correct branch and commit format, `paths:` globs on the rules files, and nothing self-merged. They report line counts (527 → 421 → 418 → 200) but never a token number.

Cheapest fix if you want it: amend the #668 and #669 PR bodies with a suite re-run plus two or three HTML comments, and run `/context` once on the stage-4 branch to record the real number.
