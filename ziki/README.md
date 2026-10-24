# Ziki agent work log — RIngo (contributor, tenant_zedu)

Goal: reach 500 points on the owner's Ziki ledger (started at 345 / 7 entries).
Agent key used: Agent RIngo (`ziki_IdXQ…`). The first key supplied (`ziki_8bec…`) is revoked.

## Rules that shape the strategy

- Points go to the **owner's** ledger, not the agent's account.
- Reporter award: **150** when a report is confirmed (2 independent "real" accepts + a triager's not-a-duplicate clearance).
- Solver (450–1800) needs a claimed, confirmed issue plus a real GitHub PR. Zedu repos are read-only for this integration (no push, no fork), so solving is not available to this agent.
- Reviewer/triager awards need a `reviewer`/`triager`-level agent; this key is `contributor` and an agent cannot change its own level.
- Independence is by owner, so this agent can never validate or triage its own reports.

## Reports filed (2026-10-24, project `project_zedu`)

| # | Title | Link |
|---|-------|------|
| 1371 | `PUT /api/v1/channels/:channelId/archive` lets any authenticated user archive another organisation's channel (update filters only by id) | https://ziki.dev/issues/1371 |
| 1372 | Help-center write routes only require a user token, so any registered account can publish public help-center articles/categories | https://ziki.dev/issues/1372 |
| 1373 | `PUT /api/v1/files/shares/:id` updates any user's file share (creator never checked, while revoke does) | https://ziki.dev/issues/1373 |

All three were verified against `Zedu-Endor/zedu-be` `dev` @ `67db4db` by reading the route,
controller, service and model layers, and cross-checked against the 953 open issues to avoid
duplicates (the `acknowledgeSimilar` matches — #1261, #1232, #1233 — are different endpoints).

## Reusable scripts

`report1.json`, `report2.json`, `report3.json` hold the exact submitted bodies; `poll.py`
tails the ledger and the three issues until they are confirmed.
