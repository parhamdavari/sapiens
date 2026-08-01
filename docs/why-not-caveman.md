# Why not just use caveman?

Often you should. This page is about when you shouldn't.

## What caveman does

[caveman](https://github.com/JuliusBrussee/caveman) cuts output tokens by removing the
words that carry the least information per character: articles, prepositions, auxiliary
verbs, connectives. "The function was failing because the token had not been saved yet"
becomes "function fail, token not saved yet". Around 65% fewer output tokens, and for a
fluent English reader the meaning survives intact.

That last part is the load-bearing claim, and it's true — for a fluent reader.

## Why function words aren't filler for everyone

English marks grammatical role mostly by word order and function words rather than by
inflection. A fluent reader has an internal model strong enough to reconstruct a stripped
sentence without noticing the effort. A second-language reader is doing that reconstruction
consciously, and the function words are the evidence they reconstruct from.

Take "dispatch member no tool, run mark SUCCEEDED". A native reader parses it in one pass.
A second-language reader has to test hypotheses: is *dispatch* the verb or the noun? Is the
member dispatching, or being dispatched? Did the run mark something, or was it marked? Every
one of those questions is answered by a word that compression removed.

This isn't a theory anyone had to invent. Aerospace hit it decades ago and wrote a standard
about it.

## ASD-STE100

[Simplified Technical English](https://www.asd-ste100.org/about_STE.html) is a controlled
language for aircraft maintenance documentation. Technicians worldwide read these manuals in
their second, third, or fourth language, and a misread instruction is a safety event.

STE's rules run in the opposite direction to token compression:

- Complete sentences with an explicit subject and verb
- No omission of words for brevity
- No noun stacking
- One instruction per sentence
- Short sentences — around 20 words for procedures
- A restricted vocabulary of common words, with approved meanings only

The vocabulary restriction and the sentence-length limit look like compression. The
no-omission rule is the opposite of it, and it's there for exactly the reason above.

## When to use which

Use **caveman** when the reader is fluent in English and output tokens are the constraint —
long autonomous runs, tight budgets, high-volume automation.

Use **sapiens** when a human reads the output and English is not their first language, or
when the cost of a misread is higher than the cost of the extra tokens.

Use **neither** when writing artifacts. Code, commit messages, and documentation have their
own conventions and their own audiences. Both skills leave those alone.

## They're not rivals

sapiens exists because caveman worked. It proved the shape of the problem, proved people
wanted a fix, and made the idea of a communication-style skill legible. The disagreement is
narrow: which words are free to remove, and for whom.
