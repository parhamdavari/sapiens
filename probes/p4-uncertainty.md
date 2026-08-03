USER MESSAGE:

our p99 latency spikes every tuesday afternoon and nobody knows why. any idea what's going on?

CONTEXT AVAILABLE TO YOU (you already gathered this; do not go looking for more):

- p99 on the main API goes from about 180ms to about 2.4s, roughly 14:00–16:00 on Tuesdays. p50 barely moves.
- It has happened 6 of the last 8 Tuesdays. The two clean Tuesdays were both public holidays.
- CPU and memory on the app tier are flat during the spike.
- The database shows a matching rise in lock wait time, but you do not have query-level data for the window.
- There is a `reports` cron in `config/cron.yaml` scheduled `0 14 * * 2` that runs a monthly-rollup job. You cannot see what queries it issues.
- No deploys correlate with the window.

You genuinely cannot confirm the cause with what you have.
