# Changelog

All notable changes to sapiens. Format follows [Keep a Changelog](https://keepachangelog.com);
versions follow [Semantic Versioning](https://semver.org).

## [Unreleased]

- New brand mark: an early-human head in profile speaking three ochre strokes, replacing
  the evolution-line placeholder. Dark and light variants for the icon and the banner.
- Head-only favicon for 48px and below, where the speech strokes stop being legible.
- `docs/brand.md` records the mark's reasoning, the palette, and the responsive rule.

## [3.2.0]

Restructured for the [Agent Skills specification](https://agentskills.io/specification.md).

- Long lookup tables moved to `references/plain-english.md`, loaded on demand
- Rationale prose compressed; a duplicate levels table removed
- `SKILL.md` cut from ~6,900 to ~5,000 tokens, inside the spec's recommended budget
- Quality improved rather than dropped: on the same test question, 153 → 113 words,
  reading grade 6.3 → 5.9, and no sentence over 25 words

## [3.1.0]

- **Size budget.** Answer length now follows from the question asked, with a table of
  defaults and the habit of offering depth in one line instead of delivering it
- **Figurative language and undefined jargon.** The failure standard readability scores
  cannot detect. Measured on a real session reply: 9 figurative expressions in 192 words
- Hard 25-word ceiling on sentences, with counting moved into the pre-send checks
- Measured: reading grade 9.1 → 6.3, figurative expressions 9 → 0, length 327 → 153 words

## [3.0.0]

- **Turn architecture.** New rules for how often to speak across a long task: a speaking
  budget, a test for what earns a mid-task message, and a final-report shape where one
  fact has one home
- **Pre-send checklist.** Cheap self-checks on the finished draft, ending with a
  completeness check so shortening never becomes dropping a finding
- Reporting depth now scales with the level
- Measured on two long tasks: 62% and 64% fewer spoken words, speaking once instead of
  3 and 5 times, with no material finding lost

## [2.0.0]

- Scope boundary between chat prose and artifacts such as code and commit messages
- Much larger catalogue of banned AI phrases, grouped by function
- Plain-English word swap table
- Shape and rhythm section: formatting, em dashes, sentence variety, describing the thing
  rather than the diff
- "Don't overcorrect" section, so the rules don't produce sterile output

## [1.0.0]

- Initial release: three levels, dual activation, core grammar rules
