# Contributing to sapiens

Thanks for wanting to help. This project is a set of instructions, not a program, so
contributing looks a little different from a normal repo. Here's how it works.

## What makes a good contribution

The skill has one job: make Claude's replies readable for someone who works in English
but doesn't think in it. Every change should be arguable against that.

**Things that are clearly useful:**

- A figurative expression or idiom that tripped you up, plus the plain replacement.
  These are the highest-value contributions and the hardest to find, because native
  speakers don't notice them. See `skills/sapiens/references/plain-english.md`.
- A real transcript where the skill produced a bad reply. Paste the prompt and the reply.
  A concrete failure is worth more than a suggestion.
- A rule that fires when it shouldn't, making replies stiff or dropping real content.
- A translation of the README.

**Things that need discussion first:**

- New rules. The skill is already near the spec's token budget, so a new rule usually
  means an existing one has to go or move to a reference file. Open an issue first.
- Changes to the three levels. They're load-tested; changing what `dev` means affects
  everyone's default.

## The rule that governs every change

**Benchmarks are real.** Every number in the README and in `benchmarks/` came from an
actual measured run. If you change a number, include the run that produced it. Never
estimate a figure and present it as measured. A contribution that improves the skill but
can't be measured is still welcome — just say so plainly rather than inventing a number.

## Before you open a pull request

```bash
npm run validate     # checks SKILL.md against the Agent Skills specification
npm run measure      # re-runs the readability metrics over benchmarks/results
```

`validate` enforces the [Agent Skills spec](https://agentskills.io/specification.md):
frontmatter keys, the 1024-character description limit, the name format, and the
recommended token budget for `SKILL.md`. CI runs the same check, so a green local run
means a green PR.

## Adding to the reference tables

`skills/sapiens/references/plain-english.md` holds the long lookup tables. Prefer adding
there over adding to `SKILL.md`, because reference files load on demand and `SKILL.md`
loads every time the skill activates.

Only promote something into `SKILL.md` if it shows up often enough that the model needs
it resident. If you think a phrase qualifies, say why in the PR.

## Style of the skill text itself

The skill is written in the voice it teaches. Full grammar, short sentences, no idioms,
each rule followed by the reason it exists. Explaining *why* a rule matters is not
padding here — it's what makes the model apply the rule to cases the text didn't
anticipate. Keep that.

## Commits and branches

- Branches: `fix/...`, `feat/...`, `docs/...`
- Commits: [Conventional Commits](https://www.conventionalcommits.org), e.g.
  `fix(reference): add "in the weeds" to the figurative table`
- One logical change per pull request.

## Releasing (maintainers)

1. Update `metadata.version` in `skills/sapiens/SKILL.md`
2. Add a `CHANGELOG.md` entry with what changed and any measured effect
3. Tag `vX.Y.Z` and push. CI builds `dist/sapiens.skill` and attaches it to the release.
