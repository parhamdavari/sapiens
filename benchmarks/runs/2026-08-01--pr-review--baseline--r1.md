---
scenario: pr-review
arm: baseline
run: 1
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:03:14.685Z
generator: benchmarks/generate.mjs
---

Reviews done. Verdict: 2 PRs consistent, 2 have gaps. No PR anywhere reports `/context` number.

**PR #670 (stage 3, git hooks): consistent, 10/10.** Commit-msg regex slightly looser than §4.5 strict form, but PR body discloses this and reconciles it in same PR. Shows hooks blocking bad commit and bad push before prose trim.

**PR #671 (stage 4, dedup to 200 lines): consistent except one gap.** No `/context` number. Otherwise strong: live replacement for every cut, unenforceable text kept byte-identical, full 10-scenario suite re-run with no detection regression.

**PR #668 (stage 1, extract derivable): structurally clean, three gaps.**
- No scenario-suite re-run in body. Defers it to stage 5, which prompt does not authorize.
- No `/context` or token number, only line counts.
- No `<!-- -->` rationale comments at cut sites.
- Minor: moved content to `docs/knowledge-links.md`, not on prompt's named destination list. Read-on-demand, so harmless in spirit.

**PR #669 (stage 2, measured-false fixes): same pattern as #668.** Correct naming, one stage, net-zero lines, every correction backed by repo evidence. But same three reporting gaps: no scenario re-run, no measurement number, no HTML-comment rationale. Also shows hook passing rather than deliberately failing.

**Rules that hold across all four:** one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, all `.claude/rules/*` carry `paths:` globs. Critical rule (never delete rule before replacement exists and proven to fail) holds in both deleting PRs, #670 and #671.

**Systemic miss:** all four report line counts (527 → 421 → 418 → 200), none reports actual `/context` token number prompt asks for.

Cheapest fix: amend #668/#669 bodies with suite re-run plus two or three HTML comments, run `/context` once on stage-4 branch, record real number. Want me to do it?
