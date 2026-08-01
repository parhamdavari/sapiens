---
scenario: ci-triage
arm: sapiens
run: 12
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:15:11.095Z
generator: benchmarks/generate.mjs
---

18 failing tests, but only one is a real bug. Fix `packages/web` first.

**`packages/web`**, 3 failures in `Checkout.test.tsx`. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. It came in with `a3f91c2` ("simplify cart hook"). This ships to users as a crash on the empty-cart page. Restore the empty-array default.

**`packages/api`**, 14 failures in `billing.test.ts`. A shared fixture calls `Date.now()` directly, and the global setup file now freezes the clock, so every invoice timestamp assertion fails. One-line fix in `test/setup.ts`. Biggest number, smallest problem, and not a product bug.

**`packages/worker`**, 1 flaky test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower than that. Widen the tolerance or use a fake timer.

So: ship the web fix, then the api one-liner to get CI green again, then the worker test whenever you get to it.
