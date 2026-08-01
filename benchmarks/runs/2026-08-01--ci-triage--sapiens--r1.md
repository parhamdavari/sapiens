---
scenario: ci-triage
arm: sapiens
run: 1
model: claude-fable-5
skill_version: 3.4.0
generated: 2026-08-01T14:06:55.518Z
generator: benchmarks/generate.mjs
---

All 18 failures are diagnosed. Only one is a real product bug, so here's the order:

1. **`packages/web` first.** This is a real regression: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. It shipped in commit `a3f91c2` and crashes the empty-cart page for users. Restore the empty-array default in the hook.
2. **`packages/api` second.** All 14 failures in `billing.test.ts` come from one test-infra issue: the global setup froze the clock last week, and a shared fixture still calls `Date.now()`. One-line fix in `test/setup.ts`. Not a product bug, but it clears most of the red.
3. **`packages/worker` last.** `retry.test.ts` is flaky (fails about 1 in 5 runs) because it asserts a retry happens within 100ms and CI runners are sometimes slow. Widen the tolerance or use a fake timer whenever convenient.

Want me to make the web fix now?
