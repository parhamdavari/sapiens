---
scenario: ci-triage
arm: sapiens
run: 23
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T19:00:21.645Z
generator: benchmarks/generate.mjs
---

18 failing tests across 3 packages, but only one is a real bug.

**Fix first: `packages/web`.** `useCart()` returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page. Came from commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default. 3 tests in `Checkout.test.tsx` go green with it.

**Then `packages/api`.** 14 failures in `billing.test.ts`, all noise. A shared fixture calls `Date.now()` directly, and the global setup froze the clock last week, so every invoice timestamp assertion fails. One line in `test/setup.ts`. It is most of the red, but no product impact, so it goes second.

**Last, `packages/worker`.** `retry.test.ts` is flaky, fails about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. Widen the tolerance or switch to a fake timer.

Want me to start on the web fix?
