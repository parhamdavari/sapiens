---
scenario: ci-triage
arm: sapiens
run: 9
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:08:51.621Z
generator: benchmarks/generate.mjs
---

Only one of the three is a real bug. Fix order:

1. `packages/web` (3 tests, `Checkout.test.tsx`). Real regression. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. It came in with `a3f91c2` ("simplify cart hook"), and it ships to users as a crash on the empty-cart page. Restore the empty-array default.

2. `packages/api` (14 tests, `billing.test.ts`). Not a product bug. A shared fixture calls `Date.now()` directly, and last week's change froze the clock in the global setup, so every invoice timestamp assertion fails. One line in `test/setup.ts` clears all 14.

3. `packages/worker` (1 test, `retry.test.ts`). Flaky, about 1 run in 5. The test asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. No product impact.

If you only want CI green fast, the api fix is the cheapest and clears the most tests. The web bug is the one that matters. Want me to start there?
