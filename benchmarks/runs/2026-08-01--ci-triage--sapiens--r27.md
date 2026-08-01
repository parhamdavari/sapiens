---
scenario: ci-triage
arm: sapiens
run: 27
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:10:09.103Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other 15 failures are test problems, not product problems.

`packages/api` is 14 tests in `billing.test.ts`. A shared fixture calls `Date.now()`, and last week's change froze the clock in the global setup, so every invoice timestamp assertion fails. One line in `test/setup.ts`. Do this second, it clears most of the red.

`packages/worker` is one flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Lowest priority.
