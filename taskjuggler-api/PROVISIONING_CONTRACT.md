# AI Platform Provisioning Contract (for the Command Center CRM)

**Status: LIVE** (built June 11, 2026). Mirrors the Multisite publishing-platform contract.

## Endpoint

```
POST {TASKJUGGLER_API_URL}/api/provision/subscription
```

## Authentication

Header: `X-Provisioning-Secret: <shared secret>`

- Set `PROVISIONING_SECRET` in the taskjuggler-api Railway environment.
- Set the same value in the Command Center's outbound config.
- Compared with `hash_equals`; missing/wrong secret → `401`.

## Request payload

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string (email) | yes | Account owner; user is found-or-created by email |
| `business_name` | string | yes | Used as the team name (and `"<name> Admin"` for a new user) |
| `crm_order_id` | string | yes | Command Center order id, stored for reconciliation |
| `plan_tier` | string | yes | One of: `free`, `starter`, `pro`, `business`, `enterprise` (gates modules — see below) |
| `subscription_id` | string | yes | Command Center ServiceSubscription id |
| `stripe_subscription_id` | string | no | Stripe subscription reference |
| `app` | string | no | Which AI app was sold (`taskjuggler`, `projects`, `processes`, `urpa`, `4calls`, `sitehealth`) — stored in metadata |
| `started_at` | date | yes | Period start |
| `expires_at` | date | yes | Period end |

### Plan tier → enabled modules (config/modules.php)

| Tier | Modules |
|---|---|
| free / starter | core, tasks |
| pro | core, tasks, processes |
| business / enterprise | core, tasks, processes, projects |

## Behavior

1. Finds or creates the **user** by email (random hashed password; user resets via email flow).
2. Finds or creates the **team** owned by that user (the platform's business analog); makes the user an admin member and sets it as their current team.
3. Creates or updates the team's **active subscription**: plan, period, Stripe id, and metadata `{crm_order_id, crm_subscription_id, app, provisioned_via}`.

Idempotent-ish: re-posting for the same email updates the existing active subscription rather than duplicating.

## Responses

- `200` — `{"success": true, "user_id": "<uuid>", "team_id": "<uuid>", "subscription_id": "<uuid>", "message": "..."}`
  - Store `team_id` on the CRM order (it is the AI platform's external reference, analogous to Multisite's `business_id`).
- `401` — bad/missing secret
- `422` — `{"errors": {...}}` validation failures
- `500` — internal failure (logged on this side)

## Differences from the Multisite contract

- Path is `/api/provision/subscription` (no `/v1`).
- Response returns `team_id` instead of `business_id`.
- Extra optional `app` field; `plan_tier` is validated against the AI platform's tiers above.
