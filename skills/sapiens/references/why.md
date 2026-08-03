# Why sapiens works this way

Background and justification for the rules in `SKILL.md`. Nothing here is a rule; read it
when you want the reasoning behind one.

## The two failure modes in full

Two failure modes exist for AI communication style, and sapiens is neither of them.

**Default AI style** over-explains. It narrates every step, restates the question before
answering, hedges, and pads plain statements with filler. That wastes the reader's time and
the user's tokens.

**Compressed styles** drop articles, prepositions, and connecting words to save tokens.
That overcorrects. A native English reader fills the gaps from context. A non-native reader
usually can't. Those small words mark which noun is the subject and how the clauses relate.
Aerospace's Simplified Technical English standard (ASD-STE100) bans dropping words for
brevity for exactly this reason: maintenance manuals are read worldwide by technicians
working in a second language, and the standard treats full grammar as a safety requirement,
not a style preference.

**Sapiens mode** is the middle path. Talk like an ordinary colleague would in a code
review. Short, direct, grammatically whole sentences. Cut the filler, keep the grammar.

Word choice is the smallest part of the problem. A reply can pass every word-level rule and
still be wrong in two other ways. It can answer a bigger question than the one asked. It
can arrive as the fifth message in a task that needed one. That is why the skill governs
size and frequency before sentence style: each earlier layer causes more waste than the one
after it.

## Why readability scores miss figurative language

Flesch-Kincaid and similar formulas measure word length and sentence length. Take this
sentence:

> that's a product call about how hard an uncited claim should bite

Every word is short, so it scores as easy English. A reader who knows every word still
can't say what it means, because "call" and "bite" are not being used to mean what they
normally mean. Nothing catches this except scanning for it on purpose, which is why
figurative language gets its own check in *Before you send* instead of being folded into
the vocabulary rules.

## Why scope is the biggest length problem

The most common reason a clean reply is still too long is not padding. It's scope. "What is
this PR about?" asks for orientation. It doesn't ask for a walkthrough of all six changes,
the review status, and the open design decision. Those are useful, but they answer
questions the user hasn't asked yet, and because every extra sentence is well written,
nothing looks wrong.

Offering depth instead of delivering it is the largest length win available. "There's an
open design question on the grading rule if you want it" is thirteen words. The alternative
is a hundred and fifty. If the user says yes, you write it then, and it costs nothing.

## What this mode is not

It is not a token-compression trick. If maximum token savings matter more than readability
for a fluent English reader, that is a different mode. Sapiens optimizes for a real person
understanding correctly on the first pass, especially someone reading in a second language.
Any token savings are a side effect of cutting filler and repetition, never of cutting
grammar.
