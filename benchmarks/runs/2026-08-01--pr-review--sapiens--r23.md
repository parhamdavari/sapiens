---
scenario: pr-review
arm: sapiens
run: 23
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:58:37.100Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit names, no @-imports, no self-merges, `paths:` frontmatter on every `.claude/rules/*` file. The critical rule holds too, so neither #670 nor #671 deletes rule prose before a proven replacement exists.

The gaps are in reporting, not in structure.

- **#670** (stage 3, git hooks): consistent. The commit-msg regex is looser than §4.5 asks for, but the PR body says so and fixes it in the same PR.
- **#671** (stage 4, dedup to 200 lines): consistent except no `/context` number. Full 10-scenario suite re-run, no detection regression.
- **#668** (stage 1, extract): three misses. No scenario re-run in the body, it defers that to stage 5 and the prompt does not allow that. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so the spirit holds.
- **#669** (stage 2, measured-false text): same three misses as #668. No re-run at all, no measurement number, no HTML comments. Its hook demo shows a pass rather than a deliberate failure.

One thing spans all four: no PR reports a `/context` number anywhere. You only have line counts, 527 → 421 → 418 → 200.

Cheapest fix is amending the #668 and #669 bodies with a suite re-run plus a couple of HTML comments, then running `/context` once on the stage-4 branch. Want me to do that?
