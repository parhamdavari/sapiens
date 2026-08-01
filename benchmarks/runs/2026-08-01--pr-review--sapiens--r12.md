---
scenario: pr-review
arm: sapiens
run: 12
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:13:10.518Z
generator: benchmarks/generate.mjs
---

Yes on structure, no on reporting.

All four hold the structural rules: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and `paths:` frontmatter on every `.claude/rules/*` file. The critical rule also holds. Neither #670 nor #671 deletes rule prose before its replacement exists and is proven to fail.

The gaps are all in the evidence the PR bodies are supposed to carry.

#670 is clean. The commit-msg regex is a bit looser than the strict form in §4.5, but the body says so and reconciles it in the same PR. It quotes the hooks blocking a bad commit and a bad push.

#671 is clean except for one thing: no `/context` number. It has a live replacement for every cut, kept the unenforceable text byte-identical, and re-ran the full 10-scenario suite with no detection regression.

#668 and #669 both skip the same three reporting duties: no Phase 1 scenario re-run in the body, no `/context` or token number (line counts only), and no `<!-- -->` rationale at the cut sites. #668 defers the re-run to stage 5, which your prompt does not authorize. #669 skips it entirely, and shows its hook passing instead of deliberately failing. #668 also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so it is harmless in spirit.

One gap is universal: no PR reports a `/context` number anywhere. All four give line counts only (527 → 421 → 418 → 200).

Cheap fix if you want it: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number.
