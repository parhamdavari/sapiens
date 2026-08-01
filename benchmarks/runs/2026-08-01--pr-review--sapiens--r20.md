---
scenario: pr-review
arm: sapiens
run: 20
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:57:27.084Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` frontmatter. The safety rule holds too. Both PRs that delete rule prose (#670 and #671) have a proven replacement in place first.

The gaps are all in reporting, not in the work itself.

- **#670** (stage 3, git hooks) — clean. The commit-msg regex is looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.
- **#671** (stage 4, dedup to 200 lines) — clean except no `/context` number. It re-ran the full 10-scenario suite with no detection regression, and kept the unenforceable text byte-identical.
- **#668** (stage 1, extract) — three gaps. No scenario re-run in the body, it defers that to stage 5, which your prompt does not authorize. No `/context` number, line counts only. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though that file is read-on-demand so it does not break the intent.
- **#669** (stage 2, fix measured-false text) — same three gaps as #668. No scenario re-run at all, no measurement number, no rationale comments. Its hook demo shows a pass rather than a deliberate failure.

The one rule nothing complies with is the `/context` number. All four report line counts only (527 → 421 → 418 → 200).

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number. Want me to do that?
