---
scenario: ci-triage
arm: sapiens
run: 2
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:07:14.011Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real product bug: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws and the empty-cart page crashes for users. Came in with commit `a3f91c2` ("simplify cart hook"). Restore the empty-array default and the 3 `Checkout.test.tsx` failures go away.

The other two are test-only problems:

- `packages/api` (14 failures): a shared fixture calls `Date.now()`, but last week's change froze the clock in the global setup. Every invoice-timestamp assertion fails. One-line fix in `test/setup.ts`. This clears most of the red.
- `packages/worker` (1 failure): `retry.test.ts` is flaky, failing about 1 run in 5 because it asserts a retry lands within 100ms and CI runners are sometimes slower. Widen the tolerance or use a fake timer. Lowest priority.

So: ship the web fix, then the setup.ts fix for volume, then deflake the worker test.
