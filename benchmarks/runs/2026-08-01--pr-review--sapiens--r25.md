---
scenario: pr-review
arm: sapiens
run: 25
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:07:06.667Z
generator: benchmarks/generate.mjs
---

Mostly consistent. The structural rules hold across all four. The reporting rules are where two of them slip.

What holds everywhere: one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and `paths:` frontmatter on every `.claude/rules/*` file. The critical rule holds too. Neither #670 nor #671 deletes rule prose before its replacement exists and is proven to fail.

**#670 (stage 3, git-hook enforcement)** is clean. Its commit-msg regex is a bit looser than §4.5's strict form, but the PR body says so and reconciles it in the same PR.

**#671 (stage 4, dedup to 200 lines)** misses one thing: no `/context` number. Everything else is there, including a live replacement for every cut and a full 10-scenario re-run with no detection regression.

**#668 (stage 1) and #669 (stage 2)** share the same three misses. No scenario-suite re-run in the body. #668 defers it to stage 5, which your prompt does not authorize, and #669 skips it entirely. No `/context` or token number, only line counts. No `<!-- -->` rationale comments at the cut sites. #668 also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so the spirit holds. #669 shows its hook passing rather than deliberately failing.

One gap is universal: no PR reports a `/context` number. All four give line counts only, 527 → 421 → 418 → 200.

Cheapest fix: amend the #668 and #669 bodies with a suite re-run plus two or three HTML comments, then run `/context` once on the stage-4 branch to record the real number. Say the word and I'll do it.
