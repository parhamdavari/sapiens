---MESSAGE--- (after user's request, before any tools run)
NONE

---MESSAGE--- (after the 3 agents are launched)
NONE

---MESSAGE--- (when the api agent finishes)
NONE

---MESSAGE--- (when the web agent finishes)
NONE

---MESSAGE--- (when the worker agent finishes — the final answer)
Fix `packages/web` first. It is the only real bug of the three. `useCart()` now returns `undefined` for an empty cart instead of `[]`, so `cart.length` throws. The empty-cart page crashes for users. It came in with commit `a3f91c2` ("simplify cart hook"). Restoring the empty-array default clears the 3 tests in `Checkout.test.tsx`.

The 14 failures in `packages/api` are all test setup. A shared fixture calls `Date.now()`, but the global setup file froze the clock last week, so every invoice timestamp assertion fails. One line in `test/setup.ts` fixes all 14.

The last one, `retry.test.ts` in `packages/worker`, is flaky. It asserts that a retry happens within 100ms, and CI runners are sometimes slower, so it fails about 1 run in 5. Widen the tolerance or use a fake timer. No product impact.
