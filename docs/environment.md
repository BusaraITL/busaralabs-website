# Environment and collection

Busara Infrastructure & Technology Labs Ltd. This file describes the switches in the repository. It does not mean they are set in Cloudflare, and it does not authorise turning collection on.

## Deploy directory

`wrangler.toml` sets `pages_build_output_dir = "public"`. The GitHub Actions deploy commands are `wrangler pages deploy public`. `node build.js` writes `public/` from `site/` and copies `functions/`.

`public/` contains HTML, assets, Pages Functions, `_headers`, and `_redirects`. It does not contain `HANDOVER.md`, `wrangler.toml`, `workers/`, or `src/`.

The live site checked on 2026-10-22 still serves `/wrangler.toml` and `/HANDOVER.md` with HTTP 200. That is the current deployment, which uploads the repository root. This branch does not change the live site until someone deploys it.

Resource identifiers, Access, secrets, and the release gates are recorded in `docs/security/`. Staging and preview refuse side effects when their plain resource vars match a production id. That check does not prove the Cloudflare binding. Non-production never sends mail and never runs the retention delete.

## Collection switch

Every submission path calls `evaluateCollectionGate` in `functions/lib/collection-gate.js` before it reads a body:

- `functions/api/contact.js` (`POST` and `OPTIONS`)
- `workers/queue-consumer.js` (queue batch)

The switch is off unless both of these are true:

| Variable | Required value | If missing or different |
|---|---|---|
| `COLLECTION_ENABLED` | exactly `on` | rejected |
| `ENVIRONMENT` | `staging`, `preview`, or `production` | rejected |

`true`, `1`, `yes`, `ON`, and an empty value do not enable collection.

Production has a second switch. When `ENVIRONMENT` is `production`, collection stays off unless `COLLECTION_PRODUCTION_ACK` is exactly:

```text
I-ACKNOWLEDGE-PRODUCTION-COLLECTION
```

That string is an acknowledgement, not a credential. Copying `COLLECTION_ENABLED=on` into production does not start collection. Do not put either variable in `wrangler.toml` or in a committed env file. This release does not set them.

While the switch is off:

- the contact function returns HTTP 403 and does not read the body, write the database, or enqueue mail;
- the queue consumer acknowledges the batch without reading payloads and does not call SendGrid;
- the contact page says collection is disabled and does not claim a message was received;
- the demonstration form has no `action`, is hidden without JavaScript, and only clears its own fields.

The code that would run if the switch were later turned on still names SendGrid (`SENDGRID_API_KEY` in `workers/queue-consumer.js`). Older comments named Postmark. Postmark is not called. Neither processor is used while the switch is off. No retention period is published. `RETENTION_DAYS` in `wrangler.toml` is configuration, not a notice.

## Hosts and indexing

`functions/_middleware.js` sends `X-Robots-Tag: noindex, nofollow` for every host other than `busaralabs.com` and `www.busaralabs.com`, and it replaces `/robots.txt` on those hosts with `Disallow: /`. The committed `robots.txt` allows crawling so a future production deploy of this branch is not accidentally de-indexed.

This is not Cloudflare Access. A noindex header does not stop a person from opening the hostname.

## What was verified on the current host, 2026-10-22

These requests were headers and an empty `OPTIONS`. No form body was sent.

- `https://staging.busaralabs.com/` returned HTTP 200 with no access challenge and no `X-Robots-Tag`.
- `https://staging.busaralabs.com/robots.txt` returned HTTP 200.
- `https://staging.busaralabs.com/wrangler.toml` returned HTTP 200.
- `OPTIONS https://staging.busaralabs.com/api/contact` returned HTTP 204 with `Access-Control-Allow-Origin: https://staging.busaralabs.com`.
- `OPTIONS https://busaralabs.com/api/contact` returned HTTP 204 with `Access-Control-Allow-Origin: https://busaralabs.com`.
- `https://busaralabs.com/HANDOVER.md` returned HTTP 200.
- This environment has no `CLOUDFLARE_API_TOKEN` and no `CLOUDFLARE_ACCOUNT_ID`.

`wrangler.toml` declares different preview and production D1, KV, and queue ids. The different CORS origins above match that split for `CORS_ORIGIN`. They do not prove the live preview deployment is bound to the staging database, or that preview secrets differ from production secrets. GitHub rulesets for this repository returned an empty list. The staging and production GitHub environments have no protection rules. The classic branch-protection endpoint returned HTTP 403 to this token, so it was not fully readable.

Owner assertion recorded: "Staging is isolated" (2026-10-19). The checks above contradict public isolation. This branch was not deployed.
