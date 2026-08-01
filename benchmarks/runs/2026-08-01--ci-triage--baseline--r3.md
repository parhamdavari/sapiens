---
scenario: ci-triage
arm: baseline
run: 3
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:06:40.590Z
generator: benchmarks/generate.mjs
---

All three agents done. 18 failures, but only one real bug.

**Fix first: `packages/web`.** Real regression from commit `a3f91c2` ("simplify cart hook"). `useCart()` now returns `undefined` for empty cart instead of `[]`, so `cart.length` throws. Ships to users as crash on empty-cart page. Fix: restore empty-array default. 3 failing tests in `Checkout.test.tsx` confirm it.

**Second: `packages/api`.** 14 failures in `billing.test.ts`, all one root cause: shared fixture calls `Date.now()` directly, and last week's change froze clock in global setup. Every invoice-timestamp assertion breaks. One-line fix in `test/setup.ts`. Test infra only, not product bug.

**Third: `packages/worker`.** 1 flaky test, `retry.test.ts`, fails ~1 in 5 runs. Asserts retry happens "within 100ms"; CI runners sometimes slower. No product impact. Fix: widen tolerance or use fake timer.

Order is by user impact: web crash is live, api fix unblocks most of red CI in one line, worker flake can wait.
