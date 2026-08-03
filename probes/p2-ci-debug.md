USER MESSAGE:

hey, test_checkout_flow.py keeps failing on CI but passes fine on my machine. been stuck since standup, can you figure out why?

CONTEXT AVAILABLE TO YOU (you already gathered this; do not go looking for more):

`tests/test_checkout_flow.py`, the failing test:

```python
def test_order_totals_are_grouped_by_day():
    seed_orders()
    result = checkout.daily_totals()
    assert result[0]["day"] == "2026-03-01"
```

`checkout.daily_totals()` does:

```python
rows = db.query("SELECT DATE(created_at) AS day, SUM(total) FROM orders GROUP BY day ORDER BY day")
```

`seed_orders()` inserts three orders with `created_at` values `2026-03-01T23:30:00Z`, `2026-03-02T00:15:00Z`, `2026-03-02T04:00:00Z`.

CI runs in a container with `TZ` unset, so it defaults to UTC. The developer's laptop is set to `Europe/Amsterdam` (UTC+1 in March).

CI failure output: `AssertionError: assert '2026-03-02' == '2026-03-01'`
