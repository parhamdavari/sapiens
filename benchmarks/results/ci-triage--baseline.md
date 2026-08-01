---MESSAGE--- (after user's request, before any tools run)
I'll run the full test suite first to see which packages are failing, then dig into each one.

---MESSAGE--- (after the 3 agents are launched)
18 failures across three packages: `api` (14), `web` (3), `worker` (1). I've launched an agent per package to find the root cause of each in parallel — I'll report back as they land.

---MESSAGE--- (when the api agent finishes)
`packages/api` is back — all 14 failures are in `billing.test.ts` and it's a test-harness problem, not a product bug. A shared fixture calls `Date.now()` directly, but a change last week froze the clock in the global setup file, so every assertion comparing an invoice timestamp now fails. One-line fix in `test/setup.ts`.

Biggest failure count, but nothing is actually broken in the product. Still waiting on `web` and `worker`.

---MESSAGE--- (when the web agent finishes)
`packages/web` is the real one. 3 failures in `Checkout.test.tsx`, and the root cause is a genuine regression: `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. Introduced in `a3f91c2` ("simplify cart hook").

This isn't just a test failure — it ships to users as a crash on the empty-cart page. Fix is to restore the empty-array default. Waiting on `worker`.

---MESSAGE--- (when the worker agent finishes — the final answer)
All three back. Here's the picture:

**Fix first — `packages/web`, real user-facing bug.** 3 failures in `Checkout.test.tsx`. `useCart()` returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. Introduced in `a3f91c2` ("simplify cart hook"). This is a crash on the empty-cart page for real users. Restore the empty-array default.

**Second — `packages/api`, broken test harness.** 14 failures in `billing.test.ts`, all from one cause: a shared fixture calls `Date.now()` directly while the global setup file now freezes the clock (changed last week), so every invoice-timestamp assertion fails. One-line fix in `test/setup.ts`. Loud but harmless — worth doing next only because it's cheap and it's hiding real signal in CI.

**Third — `packages/worker`, flaky.** 1 failure in `retry.test.ts`, fails about 1 run in 5. It asserts a retry happens within 100ms and CI runners are sometimes slower. No product impact. Widen the tolerance or switch to a fake timer whenever you get to it.

So: 18 failing tests, 3 packages, but only one of them is a bug your users can see. Want me to start on the `web` fix?
