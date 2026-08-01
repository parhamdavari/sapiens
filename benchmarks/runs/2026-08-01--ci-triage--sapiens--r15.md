---
scenario: ci-triage
arm: sapiens
run: 15
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:16:06.524Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It is the only one of the three that is a real bug.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships to users as a crash on the empty-cart page. It came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default and the 3 tests in `Checkout.test.tsx` should pass.

The other 15 failures are test problems, not product problems. In `packages/api`, 14 tests in `billing.test.ts` fail because a shared fixture calls `Date.now()` while the global setup now freezes the clock. One-line fix in `test/setup.ts`. In `packages/worker`, `retry.test.ts` is flaky at roughly 1 run in 5. It asserts a retry within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer.

So: web for the user-facing crash, then api to unblock CI, then worker whenever you get to it.
