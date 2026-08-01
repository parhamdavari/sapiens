---
scenario: ci-triage
arm: sapiens
run: 20
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:59:31.236Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. It came from commit `a3f91c2`, and the fix is to restore the empty-array default.

The other 15 failures are test problems, not product bugs:

- `api`, 14 tests in `billing.test.ts`. A shared fixture calls `Date.now()`, but the global setup froze the clock last week, so every timestamp assertion fails. One line in `test/setup.ts`.
- `worker`, 1 test in `retry.test.ts`, flaky at roughly 1 run in 5. The "within 100ms" assertion is too tight for slow CI runners. Widen the tolerance or use a fake timer.
