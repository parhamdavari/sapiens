---
scenario: ci-triage
arm: sapiens
run: 25
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:09:37.445Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug, so fix `packages/web` first.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That's the 3 failures in `Checkout.test.tsx`. It came in with commit `a3f91c2` ("simplify cart hook") and ships to users as a crash on the empty-cart page. Restore the empty-array default.

The other two are test problems, not product problems.

`packages/api` has 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and the global setup now freezes the clock, so every invoice timestamp assertion fails. One line in `test/setup.ts` clears all 14, so do it second.

`packages/worker` has one flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer whenever you get to it.
