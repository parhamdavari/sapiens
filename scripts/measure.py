#!/usr/bin/env python3
"""Compare sapiens replies against baseline replies.

Reads two directories of plain-text replies with matching filenames:

    out/baseline/p1.md   out/skill/p1.md
    out/baseline/p2.md   out/skill/p2.md   ...

Reports the shape metrics the skill actually claims to change. It does not
judge content: whether a finding was dropped, or whether the first sentence
answers the question, has to be read by a person. See evals/README.md.

Usage:  python scripts/measure.py [baseline_dir] [skill_dir]
"""
import os
import re
import sys

# Sentences over this length are the rule that slips most often.
SENTENCE_WORD_CEILING = 25

BANNED = [
    "Great question", "Certainly!", "Let's dive", "I've gone ahead",
    "I hope this helps", "Let me know if you have any questions", "In conclusion",
    "Let me think step by step", "Breaking this down", "You're asking about",
    "To answer your question", "It's worth noting", "Here's the interesting part",
    "The catch?", "The real question is", "quite frankly", "could potentially",
    "may eventually", "Experts believe", "Studies show", "Research suggests",
]
SWAPS = [
    "leverage", "utilize", "delve", "deep dive", "robust", "seamless",
    "subsequently", "serves as", "functions as", "boasts", "is capable of",
    "facilitate", "myriad", "plethora", "holistic", "paradigm",
]
FIGURATIVE = [
    "headline", "tests are green", "product call", "low-hanging fruit",
    "under the hood", "quietly", "sweet spot", "out of the box",
    "move the needle", "heavy lifting", "in the weeds",
]


def sentences_of(prose):
    # Split line-first: a bullet, heading or bolded lead-in with no period is
    # its own unit, not part of the sentence on the next line. Splitting the
    # raw text on punctuation alone merged whole lists into one fake sentence.
    sentences = []
    for line in prose.splitlines():
        if line.lstrip().startswith("|"):                   # table rows are not prose
            continue
        line = re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "", line)   # list markers
        line = re.sub(r"^#{1,6}\s+", "", line)              # heading markers
        line = re.sub(r"^\s*>\s?", "", line)                # blockquote markers
        line = line.replace("**", "").replace("`", "")
        line = line.strip()
        if not line:
            continue
        sentences.extend(s for s in re.split(r"(?<=[.!?])\s+", line) if s.strip())
    return sentences


def analyse(text):
    # Code blocks follow their own conventions and are out of scope. YAML
    # frontmatter is metadata: a comma-separated description field is a keyword
    # list, not a sentence.
    prose = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)
    prose = re.sub(r"```.*?```", "", prose, flags=re.S)
    sentences = sentences_of(prose)
    lengths = [len(s.split()) for s in sentences] or [0]
    return {
        "words": len(text.split()),
        "longest_sentence": max(lengths),
        "over_ceiling": sum(1 for n in lengths if n > SENTENCE_WORD_CEILING),
        "headers": len(re.findall(r"^#{1,6} ", text, re.M)),
        "bullets": len(re.findall(r"^\s*[-*] ", text, re.M)),
        "bold": len(re.findall(r"\*\*[^*]+\*\*", text)),
        "em_dashes": text.count("—"),
        "messages": len(re.findall(r"-{2,}\s*MESSAGE", text, re.I)) or 1,
        "banned": [p for p in BANNED if p.lower() in text.lower()],
        "swaps": [w for w in SWAPS if re.search(r"\b" + re.escape(w), text, re.I)],
        "figurative": [w for w in FIGURATIVE if re.search(r"\b" + re.escape(w), text, re.I)],
    }


def load(directory):
    if not os.path.isdir(directory):
        sys.exit("No such directory: %s" % directory)
    out = {}
    for name in sorted(os.listdir(directory)):
        if name.startswith("."):
            continue
        with open(os.path.join(directory, name)) as handle:
            out[os.path.splitext(name)[0]] = analyse(handle.read())
    return out


def main():
    baseline_dir = sys.argv[1] if len(sys.argv) > 1 else "out/baseline"
    skill_dir = sys.argv[2] if len(sys.argv) > 2 else "out/skill"
    base, skill = load(baseline_dir), load(skill_dir)

    shared = sorted(set(base) & set(skill))
    if not shared:
        sys.exit("No probes with the same filename in both directories.")
    missing = sorted((set(base) ^ set(skill)))
    if missing:
        print("Skipped, present in only one condition: %s\n" % ", ".join(missing))

    print("%-14s %-22s %-22s" % ("probe", "baseline", "with skill"))
    print("%-14s %-22s %-22s" % ("", "words / maxSent / >25", "words / maxSent / >25"))
    print("-" * 60)
    for probe in shared:
        b, s = base[probe], skill[probe]
        print("%-14s %-22s %-22s" % (
            probe,
            "%d / %d / %d" % (b["words"], b["longest_sentence"], b["over_ceiling"]),
            "%d / %d / %d" % (s["words"], s["longest_sentence"], s["over_ceiling"]),
        ))

    def total(rows, key):
        return sum(rows[p][key] for p in shared)

    print("\nTotals across %d probes" % len(shared))
    print("%-26s %10s %10s %10s" % ("metric", "baseline", "skill", "change"))
    for label, key in [
        ("words", "words"),
        ("sentences over %d words" % SENTENCE_WORD_CEILING, "over_ceiling"),
        ("em dashes", "em_dashes"),
        ("bullets", "bullets"),
        ("bold spans", "bold"),
        ("headers", "headers"),
        ("messages sent", "messages"),
    ]:
        b, s = total(base, key), total(skill, key)
        change = "n/a" if b == 0 else "%+d%%" % round((s - b) * 100.0 / b)
        print("%-26s %10d %10d %10s" % (label, b, s, change))

    print("\nLexical tells (a rule with no baseline hits is not earning its tokens)")
    for label, key in [("banned phrases", "banned"), ("vocabulary swaps", "swaps"),
                       ("figurative words", "figurative")]:
        b = sum(len(base[p][key]) for p in shared)
        s = sum(len(skill[p][key]) for p in shared)
        print("  %-18s baseline %d, skill %d" % (label, b, s))


if __name__ == "__main__":
    main()
