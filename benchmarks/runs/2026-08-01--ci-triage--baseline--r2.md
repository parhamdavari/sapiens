---
scenario: ci-triage
arm: baseline
run: 2
model: claude-fable-5
skill_version: n/a
generated: 2026-08-01T14:06:20.078Z
generator: benchmarks/generate.mjs
---

18 failing tests, 3 packages. Only one real bug.

**Fix first: `packages/web`.** Real regression, ships to users. `useCart()` now returns `undefined` for empty cart instead of `[]`, so `cart.length` throws. Crash on empty-cart page. Introduced in commit `a3f91c2` ("simplify cart hook"). Fix: restore empty-array default. 3 tests in `Checkout.test.tsx` confirm it.

**Second: `packages/api`.** 14 failures in `billing.test.ts`, all one root cause. Test-only, not product bug. Global setup froze clock last week, but shared fixture still calls `Date.now()` directly, so every invoice-timestamp assertion fails. One-line fix in `test/setup.ts`. Biggest chunk of red, cheapest fix.

**Third: `packages/worker`.** 1 flaky test, `retry.test.ts`, fails ~1 in 5 runs. Asserts retry "within 100ms", slow CI runners miss it. No product impact. Fix: widen tolerance or use fake timer.

Order logic: web first because it's the only user-facing bug. Api next because one line clears 14 tests. Worker last, flake only.

Want me to make these fixes?
