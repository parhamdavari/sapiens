// Readability formulas. Three of them, because they fail differently.
//
//   Flesch-Kincaid   words per sentence + syllables per word. Depends on the
//                    syllable counter below, which is a heuristic.
//   Coleman-Liau     characters per word + sentences per word. No syllables,
//                    so no guessing step.
//   ARI              characters per word + words per sentence. No syllables.
//
// The headline grade is the median of the three. When the spread between the
// highest and lowest exceeds 2 grades, the caller should surface a warning:
// large disagreement usually means the tokenizer was confused by the input,
// not that the text sits between the values.
//
// Calibration: tests/formulas.test.mjs holds hand-counted micro-fixtures
// asserted exactly, and four public-domain passages asserted within one grade
// of reference values computed by textstat (an independent implementation).
// See tests/fixtures/calibration.json for provenance.

export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  let n = 0, prev = false;
  for (const ch of w) {
    const isVowel = "aeiouy".includes(ch);
    if (isVowel && !prev) n++;
    prev = isVowel;
  }
  // Silent final e ("make", "close") is not a syllable. A final consonant+le
  // ("table", "little") is one, so it is exempt from the subtraction.
  if (w.endsWith("e") && !w.endsWith("le") && n > 1) n--;
  return Math.max(n, 1);
}

// Letters and digits, the character definition both CLI and ARI were fitted on.
function chars(word) {
  return word.replace(/[^a-zA-Z0-9]/g, "").length;
}

export function grades(words, sentences) {
  const W = Math.max(words.length, 1);
  const S = Math.max(sentences.length, 1);
  const SY = words.reduce((a, w) => a + syllables(w), 0);
  const C = words.reduce((a, w) => a + chars(w), 0);

  const fleschKincaid = 0.39 * (W / S) + 11.8 * (SY / W) - 15.59;
  const colemanLiau = 0.0588 * ((C / W) * 100) - 0.296 * ((S / W) * 100) - 15.8;
  const ari = 4.71 * (C / W) + 0.5 * (W / S) - 21.43;

  const all = [fleschKincaid, colemanLiau, ari];
  const sorted = [...all].sort((a, b) => a - b);

  return {
    fleschKincaid: +fleschKincaid.toFixed(1),
    colemanLiau: +colemanLiau.toFixed(1),
    ari: +ari.toFixed(1),
    grade: +sorted[1].toFixed(1),                 // median of the three
    spread: +(sorted[2] - sorted[0]).toFixed(1),  // caller warns when > 2
  };
}
