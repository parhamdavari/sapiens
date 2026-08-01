---
scenario: ci-triage
arm: baseline
run: 1
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:05:58.272Z
generator: benchmarks/generate.mjs
---

All three packages triaged. Only one is a real product bug.

**Fix first: `packages/web`.** Three failures in `Checkout.test.tsx` come from a real regression. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. It came in with commit `a3f91c2` ("simplify cart hook") and it crashes the empty-cart page for real users. Restore the empty-array default in the hook.

**Second: `packages/api`.** All 14 failures in `billing.test.ts` share one cause. A change last week froze the clock in global setup, and a shared fixture still calls `Date.now()`, so every invoice timestamp assertion fails. Not a product bug. One-line fix in `test/setup.ts`, and it clears 14 of the 18 red tests.

**Last: `packages/worker`.** One flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens "within 100ms" and slow CI runners miss that window. No product impact. Widen the tolerance or use a fake timer.

So: 18 failing tests, but only the web one ships a crash. Fix the cart hook, then the api fixture, then deflake the worker test. Want me to start on the cart fix?
