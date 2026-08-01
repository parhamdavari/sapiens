---
scenario: pr-review
arm: sapiens
run: 1
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:04:35.647Z
generator: benchmarks/generate.mjs
---

Mostly consistent. #670 and #671 pass; #668 and #669 skip the same three reporting duties from your prompt file.

The structural rules hold across all four: one stage per PR, correct branch and commit naming, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical rule, never delete a rule before its replacement exists and is proven to fail, holds in both PRs that delete rule prose (#670 and #671).

The gaps:

- **#668 and #669** have no scenario-suite re-run in the PR body, no measurement number, and no HTML-comment rationale at the cut sites. #668 defers the re-run to stage 5, which your prompt does not authorize. #668 also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so it is harmless in spirit.
- **No PR reports a `/context` number.** All four give line counts only (527 → 421 → 418 → 200). This is the one gap #671 has; otherwise it is fully consistent, with a live replacement for every cut and a clean 10-scenario re-run.
- **#670** scored clean. Its commit-msg regex is slightly looser than the strict form in §4.5, but the PR body discloses this and reconciles it in the same PR.

If you want these fixed, the cheapest path is to amend the #668 and #669 PR bodies with a suite re-run plus two or three HTML comments, and run `/context` once on the stage-4 branch to record the real number.
