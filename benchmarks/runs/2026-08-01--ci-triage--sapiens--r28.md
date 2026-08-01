---
scenario: ci-triage
arm: sapiens
run: 28
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:10:29.851Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws and the empty-cart page crashes for users. It came in with commit `a3f91c2` ("simplify cart hook"). The fix is to restore the empty-array default.

The other 15 failures are test problems, not product problems.

`packages/api` has 14 failures, all in `billing.test.ts`. A shared fixture calls `Date.now()`, and a change last week froze the clock in the global setup. Every invoice timestamp assertion fails as a result. One-line fix in `test/setup.ts`.

`packages/worker` has 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms, and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer.

Order I'd go with: web, then api since it clears most of the red for one line, then worker whenever you feel like it.
