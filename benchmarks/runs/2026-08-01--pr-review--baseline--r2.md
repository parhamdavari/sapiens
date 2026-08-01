---
scenario: pr-review
arm: baseline
run: 2
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:03:41.301Z
generator: benchmarks/generate.mjs
---

All four PRs done reviewing. Verdict: structure consistent everywhere, but reporting duties slip in two PRs, and one rule fails across all four.

**What holds in all four:** one stage per PR, correct branch and commit format, no @-imports, no attribution trailers, nothing self-merged, and every `.claude/rules/*` file carries `paths:` frontmatter. Critical ordering rule (never delete rule prose before replacement exists and is proven to fail) holds in both PRs that delete prose, #670 and #671.

**Per PR:**

- **#670 (stage 3, git hooks)** — fully consistent, 10/10. Hooks shown blocking bad commit and bad push before prose trimmed. One nuance: commit-msg regex slightly looser than §4.5's strict form, but PR body discloses it and same PR reconciles it.
- **#671 (stage 4, dedup to 200 lines)** — consistent except one gap: no `/context` number. Every cut has live replacement, unenforceable text kept byte-identical, full 10-scenario suite re-run with no regression.
- **#668 (stage 1, extract derivable)** — structurally clean, three gaps: (a) no scenario-suite re-run, deferred to stage 5 which prompt does not authorize; (b) no `/context` or token number, line counts only; (c) no `<!-- -->` rationale at cut sites. Also moved content to `docs/knowledge-links.md`, not on prompt's destination list, though read-on-demand so harmless in spirit.
- **#669 (stage 2, fix measured-false text)** — same three gaps as #668. Also shows hook passing rather than deliberately failing.

**Universal miss:** no PR reports `/context` number. All four give line counts only (527 → 421 → 418 → 200). Prompt asks for measured token number, not lines.

**Cheapest fix:** amend #668/#669 bodies with suite re-run plus two or three HTML comments, then run `/context` once on stage-4 branch to record real number. Want me to do that?
