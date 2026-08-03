# Raw outputs

These are the replies behind the numbers in `docs/HONEST-NUMBERS.md`, kept so a stranger can recount them. This is a research history, not a clean matrix.

- `baseline/`: 8 replies with no skill loaded, one per probe in `probes/`.
- `skill/`: 6 replies under version 3.6.0.
- `skill-v37/`: 4 replies under the first 3.7.0 draft.
- `skill-final/`: 2 replies under the shipped 3.7.0, both regression checks for evals 5 and 7.

Only `baseline/` covers all eight probes. The later directories are partial re-runs targeting specific changes, so most probes have no reply under the shipped skill text.

The only complete pairing is:

```
python scripts/measure.py out/baseline out/skill
```

Any other pairing compares a full baseline against a partial re-run, and the totals will mislead.
