---
scenario: pr-review
arm: sapiens
run: 2
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:05:16.602Z
generator: benchmarks/generate.mjs
---

Mostly consistent. The hard rules all hold across the four PRs: one stage per PR, correct branch and commit format, no @-imports, nothing self-merged, and every `.claude/rules/*` file carries `paths:` globs. The critical rule, never delete a rule before its replacement is proven, holds in both PRs that delete prose (#670 and #671). The gaps are all in reporting, and they cluster in the two early PRs.

Per PR:

- **#670 (stage 3, git hooks)** — fully consistent, 10/10. Its commit-msg regex is slightly looser than §4.5, but the PR body says so and the same PR reconciles it.
- **#668 (stage 1)** — structurally clean, three gaps: no scenario-suite re-run (it defers that to stage 5, which your prompt does not authorize), no `/context` number (line counts only), and no HTML-comment rationale at the cut sites. It also moved content to `docs/knowledge-links.md`, which is not on your named destination list, though it is read-on-demand so harmless in spirit.
- **#669 (stage 2)** — same pattern: clean structure, but skips the re-run, the measurement number, and the rationale comments. It also shows its hook passing instead of deliberately failing.
- **#671 (stage 4)** — consistent except one gap: no `/context` number. It has a live replacement for every cut and re-ran the full 10-scenario suite with no detection regression.

One thing spans all four: no PR anywhere reports a `/context` number. They all give line counts instead (527 → 421 → 418 → 200), and your prompt asks for the token number.

The cheap fix is to amend the #668 and #669 PR bodies with a suite re-run plus the missing HTML comments, and run `/context` once on the stage-4 branch to record the real number. Say the word and I'll do it.
