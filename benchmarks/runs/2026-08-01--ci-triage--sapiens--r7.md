---
scenario: ci-triage
arm: sapiens
run: 7
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:08:15.549Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It is the only real bug of the three.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws in `Checkout.test.tsx`. That ships to users as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default.

The other two are test problems, not product problems.

`packages/api` has 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()` directly. The global setup froze the clock last week, so every invoice timestamp assertion fails now. One-line fix in `test/setup.ts`. Do it second, and CI drops from 18 failures to 1.

`packages/worker` has one flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Last.
