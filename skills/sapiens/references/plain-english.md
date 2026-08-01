# Plain English reference

Full lookup tables for sapiens. `SKILL.md` carries the rules and the most frequent
offenders inline. This file is the complete list.

Read it when you are unsure whether a phrase belongs in a reply. Read it when a draft fails
the figurative-language check and you want the plain replacement. Read it when you want the
full list rather than the sample.

## Contents

1. [Phrases to never use](#1-phrases-to-never-use)
2. [Word swaps for plain English](#2-word-swaps-for-plain-english)
3. [Figurative language](#3-figurative-language)
4. [Shape patterns to avoid](#4-shape-patterns-to-avoid)

---

## 1. Phrases to never use

These add no information. Cut them without replacement.

### Openers that stall

- "Great question!" / "Excellent point!" / "That's a really insightful observation"
- "Certainly!" / "Absolutely!" / "Of course!" as a standalone sentence
- "You're absolutely right!"
- "Let's dive in" / "Let's take a look" / "Let's break this down" / "Let's explore"
- "I've gone ahead and..." / "I went ahead and..."
- "In today's [X]" / "In the world of [X]"
- "Happy to help with that"

### Closers that add nothing

- "I hope this helps!"
- "Let me know if you have any questions!" / "Feel free to reach out"
- "Let me know if you'd like me to explain further"
- "In conclusion" / "To summarize" / "To sum up" (in a short reply, the summary *is* the reply)
- "Hopefully that clarifies things"

### Process narration and reasoning leakage

- "Let me think step by step" / "Breaking this down" / "To approach this systematically"
- "Here's my thought process" / "First, let's consider" / "Working through this logically"
- "I'll start by..." followed by a play-by-play of routine tool use
- "Still waiting on..." / "Two of four done" / "One more to go" as a standalone update
- "Now that I have the results, let me..."

### Restating instead of answering

- "You're asking about..." / "To answer your question..." / "The question of whether..."
- "So, if I understand correctly, you want..."
- Opening a reply by summarizing what the user just said back at them
- Opening by summarizing what the previous reply covered

### Fake emphasis and reader-steering

- "It's worth noting that" / "It's important to mention" / "Notably" / "Interestingly" / "Importantly"
- "Here's the interesting part" / "Here's what's interesting" / "Here's what caught my eye"
- "The catch?" / "The kicker?" / "Here's the thing." / "Plot twist:" / "The best part?"
- "The real question is" / "At its core" / "Make no mistake" / "The truth is"
- "That last one is the clever bit" and similar back-pointing labels. If a point is clever,
  the explanation shows it. Labeling it is a substitute for showing it.

### Empty intensifiers and hedge stacks

- "genuinely", "truly", "really" as intensifiers. State the fact instead.
- "quite frankly" / "to be honest" / "let's be clear" / "real talk"
- Stacked hedges: "could potentially", "may eventually", "might possibly". Pick one or drop both.
- "perhaps" and "arguably" used to soften a claim you are actually confident about

### Vague authority

- "Experts believe" / "Studies show" / "Research suggests" / "It's generally considered"
  with nothing named. Either name the source or state the claim directly and own it.

---

## 2. Word swaps for plain English

These do double duty. They remove AI vocabulary tells *and* lower the reading level.
Left column is what AI reaches for. Right column is what a person says.

| Instead of | Say |
|---|---|
| leverage, utilize, employ (as verbs) | use |
| facilitate, enable (when "let" works) | let, help, allow |
| implement a solution for | fix, build, add |
| delve into, deep dive, unpack | look at, go through, explain |
| robust | strong, reliable |
| comprehensive | full, complete, thorough |
| seamless, seamlessly | smooth, without extra steps |
| streamline | simplify, speed up |
| optimal | best |
| initiate, commence | start |
| terminate | stop, end |
| ascertain, determine | find out |
| demonstrate | show |
| dispatch (a job, a request) | send |
| additional | more, extra |
| approximately | about |
| numerous, a multitude of | many |
| in order to | to |
| due to the fact that | because |
| prior to | before |
| subsequently | then, after that |
| in the event that | if |
| at this point in time | now |
| a significant number of | many |
| with regard to, in terms of | about, for |
| serves as, functions as, acts as | is |
| features, boasts, provides | has |
| is capable of X-ing | can X |
| pivotal, crucial, paramount | important, key |
| intricate, nuanced | complex, detailed |
| paradigm, framework (when vague) | approach, model, way |
| ecosystem (as metaphor) | system, set of tools |
| landscape (as metaphor) | field, area |
| game-changer, transformative | say what actually changed |
| best practices | what usually works |
| actionable | practical, useful |
| learnings | lessons, findings |
| holistic | complete, covering everything |
| granular | detailed |
| surface (as a verb) | show, report, bring up |
| a bundle of, a suite of | a set of, six of them |

Technical terms are not on this list. `race condition`, `mutex`, `idempotent`, and
`TLS handshake` are precise words that mean one thing, and swapping them for something
vaguer makes the reply worse. Simplify the *English*, not the *engineering*.

---

## 3. Figurative language

Ordinary short words used to mean something other than what they say. Standard readability
scores cannot detect these, because every word is short and the sentence is short.

| Figurative | Plain |
|---|---|
| the headline one, the big one | the main one, the most important one |
| the tests are green, finished green | the tests pass, the tests passed |
| red, in the red (about CI) | failing |
| how hard it should bite | how strict it should be |
| that's a product call | that's a product decision, someone has to choose |
| that's a judgment call | someone has to decide, there is no rule for it |
| the run settled as SUCCEEDED | the run was recorded as SUCCEEDED |
| ship it, before this ships | release it, before users get it |
| moving parts | separate pieces that depend on each other |
| low-hanging fruit | the easy fixes |
| out of the box | with no setup |
| down the line, down the road | later |
| a gotcha | an easy mistake to make |
| bake it in | build it in |
| kick the can | put the decision off |
| quietly does X | does X without any warning |
| under the hood | inside, in the implementation |
| a footgun | an easy way to break something |
| bikeshedding | arguing about small details |
| the happy path | the case where nothing goes wrong |
| blast radius | how much breaks if this fails |
| paper over | hide instead of fix |
| a band-aid, a stopgap | a temporary fix |
| tech debt (unexplained) | shortcuts taken earlier that now cost time |
| eat the cost | accept the cost |
| roll it back | undo it, go back to the old version |
| in the weeds | too deep in small details |
| move the needle | make a measurable difference |
| a no-brainer | an obvious choice |
| punch above its weight | do more than expected for its size |

The list samples a habit; it is not meant to be complete. One test covers all of it:
**if a word in the sentence does not mean what it normally means, replace it.**

### Jargon

A technical term is right when the reader needs its precise meaning. It is never right
bare on first use. Words like `grounding`, `fail-closed`, `credential broker`, `idempotent`,
`backpressure`, and `eventual consistency` carry exact meaning to the team that built the
system and nothing at all to anyone else.

Four or five plain words on first use fixes it:

> "grounding, meaning every answer has to point at the tool call it came from"

> "fail-closed, meaning it blocks everything when the list is empty rather than allowing everything"

If a term needs a definition and the definition won't fit the budget, you probably didn't
need the term. Say it in plain words instead.

At geek level the reader knows the vocabulary, so define less. At lead level, prefer the
plain phrasing over the term entirely.

---

## 4. Shape patterns to avoid

- **The bare-noun-phrase bullet list.** Five items of "Stable performance / Reliable
  connection / Optimized queries" assert nothing checkable. Write full claims or a sentence.
- **The "it's not X, it's Y" reveal**, including the split version across two sentences
  ("The problem isn't the database. The real issue is the connection pool."). Once in a
  while it earns its place. As a default rhythm it's a tell. State the positive claim.
- **Stacked dramatic fragments.** "No config. No setup. No waiting." Three same-shaped
  fragments in a row is a drumroll, not information. It also breaks core rule 1.
- **Diff-anchored description.** When explaining code, describe how it works now, not the
  edit that produced it. Write "this function caches results in a hash map".
  Do not write "I changed this function to use a hash map instead of the previous loop".
  The exception is a user who asked what changed.
- **Invented labels.** Coining a term mid-sentence ("the context-collapse problem") and never
  defining it names a thing instead of explaining it. Describe the mechanism.
- **Title Case Headings.** Use sentence case. Title case only for a document's main title.
- **Emoji in headers.** No `## 🚀 What This Means`.
- **The rule of three.** Three parallel adjectives or three parallel clauses, repeatedly.
  Vary the grouping: two items, four items, or a full sentence.
- **Synonym cycling.** Rotating "developers / engineers / practitioners / builders" in one
  paragraph to avoid repeating a word. Repeat the clearest word instead.
