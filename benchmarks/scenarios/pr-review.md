# Scenario A — PR consistency review (the user's real case)

## What the user typed
> review the last 4 PRs. do they are consitent with /Users/eva/Downloads/PROMPTclaudemdrefactor.md ?

## What happened in the session (already visible to the user in the UI)
- Claude read the prompt file (1 tool call, shown in UI as "Read 1 file")
- Claude ran `gh pr list` (1 tool call, shown in UI as "ran 1 shell command")
- Claude launched 4 background review agents, one per PR. The UI shows a live panel:
  "4 background agents launched", with each agent's name and a finished/running state,
  and a completion notice per agent with its elapsed time.
- Agents finished in this order: #670 (45s), #668 (1m07s), #669 (1m02s), #671 (1m34s)

## The prompt file's rules (the user wrote this file themselves)
branch and commit format; one stage per PR; enforcement-before-deletion order;
no @-imports; deferred-load destinations must carry `paths:` frontmatter;
Phase 1 scenario re-runs and a `/context` number reported in the PR body;
HTML-comment rationale at cut sites; no self-merge.

## What the four review agents found

**PR #670 — stage 3, git-hook enforcement.** Fully consistent. Scored 10/10.
One disclosed nuance: the commit-msg regex is slightly looser than §4.5's strict form,
but this is stated in the PR body and reconciled in the same PR.
Quotes the hooks blocking a bad commit and a bad push before trimming the prose.

**PR #668 — stage 1, extract derivable content.** Structurally clean: correct branch and
commit naming, one stage, no @-imports, nothing self-merged. Three gaps:
(a) no scenario-suite re-run in the body — it defers that to stage 5, which the prompt
does not authorize; (b) no `/context` or token number, only line counts;
(c) no `<!-- -->` rationale comments at the cut sites.
Also moved some content to `docs/knowledge-links.md`, which is not on the prompt's named
destination list, though it is read-on-demand so it is harmless in spirit.

**PR #669 — stage 2, fix measured-false text.** Same pattern as #668. Structurally clean
(correct naming, one stage, net-zero lines, every correction backed by repo evidence),
but skips the same reporting duties: no scenario re-run at all, no measurement number,
no HTML-comment rationale. Also shows its hook passing rather than deliberately failing.

**PR #671 — stage 4, dedup to 200 lines.** Consistent except one gap (no `/context` number).
Has a live replacement for every cut, kept the unenforceable text byte-identical, and
re-ran the full 10-scenario suite with no detection regression.

**Across all four:** one stage per PR, correct branch and commit format, no @-imports,
no attribution trailers, nothing merged, and all `.claude/rules/*` files carry `paths:` globs.
The critical rule ("never delete a rule before its replacement exists and is proven to fail")
holds in both PRs that delete rule prose (#670 and #671).
No PR anywhere reports a `/context` number; all four give line counts only (527 → 421 → 418 → 200).

## Cheapest fix path (if the user wants it)
Amend the #668/#669 PR bodies with a suite re-run plus two or three HTML comments,
and run `/context` once on the stage-4 branch to record the real number.
