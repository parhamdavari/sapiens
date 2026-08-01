---
scenario: pr-review
arm: sapiens
run: 35
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:14:58.804Z
generator: benchmarks/generate.mjs
---

Mostly yes. The structural rules hold everywhere. Two PRs skip the reporting duties the prompt asks for.

- **#670 (stage 3, git hooks)** — clean. It quotes the hooks blocking a bad commit and a bad push. The commit-msg regex is a bit looser than §4.5, but the PR body says so and fixes it in the same PR.
- **#671 (stage 4, dedup to 200 lines)** — clean except one gap: no `/context` number. Every cut has a live replacement, unenforceable text stayed byte-identical, and the full 10-scenario suite re-ran with no detection regression.
- **#668 (stage 1, extract derivable content)** — three gaps. No scenario re-run in the body, it defers that to stage 5 and the prompt does not allow deferring. No `/context` or token number, only line counts. No `<!-- -->` rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so the spirit holds.
- **#669 (stage 2, fix measured-false text)** — same three gaps as #668, and the scenario re-run is missing entirely rather than deferred. It also shows its hook passing instead of deliberately failing, which is weaker evidence.

Across all four: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical rule holds in both PRs that delete rule prose (#670 and #671): nothing was deleted before its replacement existed and was proven to fail.

One real cross-cutting miss. No PR reports a `/context` number. All four give line counts only (527 → 421 → 418 → 200), so the token claim behind this refactor is unmeasured.

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch. Want me to do that?
