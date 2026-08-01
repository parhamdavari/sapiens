---
scenario: ci-triage
arm: sapiens
run: 14
model: claude-opus-5[1m]
skill_version: 3.5.0
generated: 2026-08-01T15:15:43.878Z
generator: benchmarks/generate.mjs
---

Fix `packages/web` first. It's the only real bug: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws on the empty-cart page. That's a user-facing crash, and it came from commit `a3f91c2`. Restore the empty-array default.

The other 15 failures are noise. `api` has 14 tests failing in `billing.test.ts` because the global setup froze the clock and a shared fixture still calls `Date.now()` directly. One line in `test/setup.ts` fixes all 14, so do it second to get CI mostly green.

`worker` is a flaky timing test in `retry.test.ts`, failing about 1 run in 5. It asserts a retry happens within 100ms and CI runners sometimes miss that. Widen the tolerance or use a fake timer whenever you get to it.

Want me to start on the `web` fix?
