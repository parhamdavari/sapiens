# Sapiens evals

Two files, two layers.

- `evals.json` tests **behavior**: given the skill is active (every prompt carries a mode
  phrase), does the reply follow the rules? Each entry has `id`, `prompt`,
  `expected_output`, `assertions` (empty for now), `files` (fixtures the prompt needs),
  and `baseline`.
- `trigger-evals.json` tests **activation**: does the description alone fire the skill,
  with no mode phrase? It includes near-miss negatives, prompts that share vocabulary with
  the triggers but belong to other skills. A failure in one file never implicates the
  other layer.

## Run every behavior eval twice

Once with the skill loaded, once without. Record the without-skill result in `baseline`
(`null` until you have run it). The comparison is the point: a rule the model already
follows without the skill is a rule that is not earning its tokens, and a rule the model
breaks in the baseline but follows with the skill is proof the tokens pay for themselves.

`counterweight-weak-finding-survives` is the one to watch. It checks that a real but
weak finding survives length pressure, which is the skill's most likely failure mode.
