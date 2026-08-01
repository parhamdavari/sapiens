---
scenario: ci-triage
arm: sapiens
run: 21
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T18:59:47.744Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug of the 18 failures. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default and the 3 tests in `Checkout.test.tsx` should pass.

The other two packages are test problems, not product problems.

- `packages/api`, 14 failures in `billing.test.ts`. The global setup file froze the clock last week, but a shared fixture still calls `Date.now()`. Every invoice timestamp assertion fails as a result. One-line fix in `test/setup.ts`.
- `packages/worker`, 1 failure in `retry.test.ts`. Flaky, roughly 1 run in 5. The test asserts a retry happens within 100ms and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer.
