---
scenario: pr-review
arm: sapiens
run: 16
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:54:00.373Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and `paths:` globs on every `.claude/rules/*` file. The critical ordering rule holds as well. In both PRs that delete rule prose (#670 and #671), the replacement exists and is proven to fail first.

The gaps are all in reporting, not in the changes themselves.

- **#670** (stage 3, git-hook enforcement): clean. The commit-msg regex is looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.
- **#671** (stage 4, dedup to 200 lines): one gap, no `/context` number. Every cut has a live replacement, the unenforceable text is byte-identical, and the full 10-scenario suite re-ran with no detection regression.
- **#668** (stage 1, extract derivable content): three gaps. No scenario re-run in the body, it defers that to stage 5 which the prompt does not authorize. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved some content to `docs/knowledge-links.md`, which is not on your named destination list, though that file is read-on-demand so it is harmless in spirit.
- **#669** (stage 2, fix measured-false text): same three gaps. No scenario re-run at all, no measurement number, no HTML-comment rationale. It also shows its hook passing rather than deliberately failing.

One thing spans all four: no PR reports a `/context` number. They all give line counts only (527 → 421 → 418 → 200).

Cheap fix if you want it: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number.
