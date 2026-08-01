---
scenario: ci-triage
arm: sapiens
run: 3
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:07:38.667Z
generator: benchmarks/generate.mjs
---

All three are diagnosed. Only one is a real bug.

**Fix first: `packages/web`.** Commit `a3f91c2` ("simplify cart hook") made `useCart()` return `undefined` for an empty cart instead of `[]`, so `cart.length` throws. That ships as a crash on the empty-cart page for real users. Restore the empty-array default; the 3 failures in `Checkout.test.tsx` will clear.

The other 15 failures are test-only problems:

- **`packages/api`** (14 failures in `billing.test.ts`): a shared fixture calls `Date.now()` directly, and last week's change froze the clock in global setup, so every invoice-timestamp assertion fails. One-line fix in `test/setup.ts`. No product impact.
- **`packages/worker`** (1 flaky failure in `retry.test.ts`): asserts a retry happens "within 100ms", and slow CI runners miss that about 1 run in 5. Widen the tolerance or use a fake timer.

So: web fix now, api setup fix right after since it's cheap and clears most of the red, worker whenever.
