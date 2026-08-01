---
scenario: pr-review
arm: sapiens
run: 29
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:08:55.266Z
generator: benchmarks/generate.mjs
---

Mostly yes. All four follow the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical rule holds too. Neither PR that deletes rule prose (#670, #671) removes it before the replacement exists and is proven to fail.

The gaps are all in reporting, not in the work itself.

#670 (stage 3, git-hook enforcement): consistent. The commit-msg regex is a bit looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR. It quotes the hooks blocking a bad commit and a bad push before trimming any prose.

#671 (stage 4, dedup to 200 lines): consistent except one gap, no `/context` number. Every cut has a live replacement, the unenforceable text stayed byte-identical, and the full 10-scenario suite was re-run with no detection regression.

#668 (stage 1, extract derivable content): structurally clean, three reporting gaps. No scenario-suite re-run in the body, it defers that to stage 5, which your prompt does not authorize. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved some content to `docs/knowledge-links.md`, which is not on your named destination list. That file is read-on-demand, so the effect is harmless.

#669 (stage 2, fix measured-false text): same pattern as #668. Clean structure, net-zero lines, every correction backed by repo evidence. No scenario re-run at all, no measurement number, no HTML-comment rationale. Its hook demo shows a pass rather than a deliberate failure.

One rule has zero compliance across the set: no PR reports a `/context` number. You only have line counts, 527 → 421 → 418 → 200.

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number. Want me to do that?
