---
scenario: ci-triage
arm: sapiens
run: 11
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:14:53.608Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix `packages/web` first.

`useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That's the 3 failures in `Checkout.test.tsx`. It came in with commit `a3f91c2` ("simplify cart hook"), and it ships to users as a crash on the empty-cart page. Restore the empty-array default.

Second, `packages/api`. All 14 failures are in `billing.test.ts` and they share one cause. A shared fixture calls `Date.now()` directly, and last week's change froze the clock in the global setup. So every invoice timestamp assertion fails. One line in `test/setup.ts` fixes it. Not a product bug.

Last, `packages/worker`. One flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms, and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer.

18 failing tests, one actual bug. Want me to start on the web fix?
