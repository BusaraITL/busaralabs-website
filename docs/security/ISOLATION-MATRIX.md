# Environment resource matrix

Identifiers below are copied from `wrangler.toml` and `workers/wrangler.worker.toml`. They are config evidence. A matching row does not prove the Cloudflare dashboard binding. Owner, credential values, backups, and logs were not visible from this token.

| Resource | Preview / staging | Production | Owner | Credential names | Evidence |
|---|---|---|---|---|---|
| Pages project | `busaralabs-website`, branch `staging` | `busaralabs-website`, branch `main` | Not Verified | `STAGING_CLOUDFLARE_API_TOKEN`, `STAGING_CLOUDFLARE_ACCOUNT_ID` / `PRODUCTION_` equivalents | Config + live hosts. Dashboard project id Not Verified |
| Hostname | `staging.busaralabs.com`, `staging.busaralabs-website.pages.dev` | `busaralabs.com`, `www.busaralabs.com`, `busaralabs-website.pages.dev` | Not Verified | none in repo | DNS and HTTP, 2026-10-22 |
| D1 | `busaralabs-staging-db` `0bf0fbac-152e-4427-9f1a-47e4873d23db` | `busaralabs-prod-db` `27a86a12-f597-4a23-9835-ee4f3e889185` | Not Verified | binding `DB` | Config only. Runtime Not Verified |
| KV | `9133b26c873640f7af02b15e8b9a54a8` | `e0f93da5591d40d3938b6c938e7c8d2a` | Not Verified | binding `RATE_LIMIT_KV` | Config only. Runtime Not Verified |
| Queue producer | `contact-staging` | `contact-production` | Not Verified | binding `CONTACT_QUEUE` | Config only. Runtime Not Verified |
| Queue consumer and DLQ | `contact-staging` / `contact-staging-dlq` | `contact-production` / `contact-production-dlq` | Not Verified | Worker deploy token, not wired in GitHub Actions | Config only. Worker deploy Not Verified |
| R2 | none | none |  |  | No binding in config |
| Service bindings | none | none |  |  | No binding in config |
| Durable object | `RateLimiter` on the Worker | `RateLimiter` on the Worker | Not Verified | none | Config only |
| Plain id vars | `D1_DATABASE_ID`, `KV_NAMESPACE_ID`, `QUEUE_NAME` set to the staging ids | same names set to the production ids | repository | not secrets | Candidate config. Absent on the live SHA |
| Secrets | separate names required by the candidate workflow | separate names | Not Verified | see `SECRETS.md` | Names only. Values not read. API list returned 403 |
| Email | code refuses SendGrid | code allows SendGrid only when collection and the production id vars all match | Not Verified | `SENDGRID_API_KEY`, `NOTIFY_EMAIL` | Unit test. Live delivery Not Verified |
| Analytics | candidate CSP does not allow Cloudflare Insights | live CSP still allows `static.cloudflareinsights.com` | Not Verified | none in repo | Live response header |
| Backups | none in repo | none in repo | Not Verified |  | Not Verified |
| Logs | Workers logs not readable here | same | Not Verified |  | Not Verified |
| Deploy identity | GitHub environment `staging` | GitHub environment `production` | `CompBusaraLabs` is the only visible collaborator | environment token names above | Environment objects have no protection rules |

Preview and staging share one resource set in Wrangler. There is no third database.

| Component | Status | Reason |
|---|---|---|
| R2 | NOT APPLICABLE — NOT IMPLEMENTED | No `r2_buckets` binding. `assert-release-safe.js` fails if one is added. |
| Service bindings | NOT APPLICABLE — NOT IMPLEMENTED | No `services` binding. The same check fails if one is added. |
| User accounts | NOT APPLICABLE — NOT IMPLEMENTED | No account table, session store, or login route. |
| Admin routes | NOT APPLICABLE — NOT IMPLEMENTED | Only `functions/api/contact.js`. |
| Analytics binding | NOT APPLICABLE — NOT IMPLEMENTED | No analytics binding in Wrangler. |

The preview half of `wrangler.toml`, above `[env.production]`, does not contain the production D1 id, the production KV id, or `contact-production`. The same is true of the staging half of the Worker file. That is a source check, not a dashboard check.

## Recheck 2026-10-24 — expected, observed, result

Different ids in git are not proof of the binding Cloudflare is using. Live state is NOT VERIFIED unless the evidence column is an actual read.

| Resource | Expected identity | Observed | Who can reach it | Evidence | Result |
|---|---|---|---|---|---|
| D1 | Staging/preview `busaralabs-staging-db` `0bf0fbac-152e-4427-9f1a-47e4873d23db`. Production `busaralabs-prod-db` `27a86a12-f597-4a23-9835-ee4f3e889185`. | Those ids are in the live toml and in git at `a2bdcba`. The attached binding was not read. | NOT VERIFIED | Config file served over HTTP. Dashboard not opened. | NOT VERIFIED |
| KV | Staging `9133b26c873640f7af02b15e8b9a54a8`. Production `e0f93da5591d40d3938b6c938e7c8d2a`. | Same, as config. | NOT VERIFIED | Same. Do not list keys. | NOT VERIFIED |
| Queues and consumers | `contact-staging` plus `contact-staging-dlq`. Production pair `contact-production` and `contact-production-dlq`. Worker `busaralabs-queue-consumer` is a separate deploy from Pages. | Names are in the served worker toml. Consumer deployment was not listed. | NOT VERIFIED | HTTP config file. | NOT VERIFIED |
| R2 / storage | None. | No `r2_buckets` block in the candidate or in `a2bdcba`. | Nobody, if the dashboard matches. | Source. Dashboard NOT VERIFIED. | NOT APPLICABLE — NOT IMPLEMENTED in source |
| Worker and service bindings | No service bindings. Durable object `RateLimiter` is declared on the queue worker only. | Source only. | NOT VERIFIED | `workers/wrangler.worker.toml` | NOT VERIFIED for the object. Service bindings NOT APPLICABLE — NOT IMPLEMENTED |
| Secrets and env vars | Names only: `SENDGRID_API_KEY`, `NOTIFY_EMAIL`, `QUEUE_ENCRYPTION_KEY`, `TURNSTILE_SECRET_KEY`, `COLLECTION_ENABLED`, `COLLECTION_PRODUCTION_ACK`, `D1_DATABASE_ID`, `KV_NAMESPACE_ID`, `QUEUE_NAME`. | `COLLECTION_ENABLED` is not assigned in the live toml. Other names were not listed. `POSTMARK_API_TOKEN` is not read by the candidate. | NOT VERIFIED | Secret list API 403. No values read. | NOT VERIFIED |
| API credentials | `STAGING_CLOUDFLARE_API_TOKEN` and `PRODUCTION_CLOUDFLARE_API_TOKEN` on the candidate. PR #3 still references `CLOUDFLARE_API_TOKEN`. | Existence NOT VERIFIED. | A push to `main` or `staging` can use them because environment reviewers are empty. | Workflow source. Environment object has no protection rules. | NOT VERIFIED, and the empty reviewer list is observed |
| Email | SendGrid only after the candidate gate and resource guard. No Postmark call. | Live OPTIONS 204 does not send mail. A live POST was not sent. | NOT VERIFIED | Unit tests stub `fetch`. | NOT VERIFIED live |
| Logs, monitoring, backups | Separate per environment, no production export on the site. | No backup product is declared. Logs were not opened. | NOT VERIFIED | Repo has no backup job. | NOT VERIFIED |
| Deploy identities | GitHub environment `staging` deploys only `staging`. `production` deploys only `main`. | Both environments have `deployment_branch_policy: null` and `can_admins_bypass: true`. | Any actor who can push those branches, which is NOT VERIFIED while classic protection returns 403. | GitHub environment API, 2026-10-24. | FAIL as a control. Binding target NOT VERIFIED |

Shared by design in Wrangler: preview and the `staging` branch use one D1, one KV, and one queue, because Pages exposes one preview environment. Restriction that exists only in the candidate: `functions/lib/resource-guard.js` refuses production ids on preview. That code is not live. The June handler on `a2bdcba` does not contain it.

Operator procedure when a read token exists. Minimum permission is the G3 data-read token in `OPERATOR-CHECKLIST.md` (D1 Read, KV Read, Queues Read) plus Pages Read. No edit.

- `npx wrangler d1 list` — expected names and ids as in the table, and no extra database shared with production. Safe evidence: name and id lines.
- `npx wrangler kv namespace list` — expected the two ids. Do not list keys.
- `npx wrangler queues list` — expected the four queue names. Safe evidence: names and message counts, never bodies.
- Pages project `busaralabs-website` → Settings → Bindings, Production and Preview. Expected: preview bindings are the staging ids only. Safe evidence: binding name and resource name.

## Fail-closed behavior in the candidate

`functions/lib/resource-guard.js` compares `ENVIRONMENT`, `CORS_ORIGIN`, and the three plain id vars.

- Staging or preview continues only when all three vars equal the staging ids and the origin is `https://staging.busaralabs.com`.
- Any production id or the production origin on a non-production environment refuses before the body is read.
- Missing vars refuse. The Worker cannot see the real binding id, so a var that still says "staging" while the dashboard binding points at production is not detectable. That remains an operator check.
- Non-production sets `email` and `destructive` to false. The queue consumer acks without reading and does not call SendGrid. The cron handler does not run `DELETE`.
- Production cron runs `DELETE` only when all three vars equal the production ids and the origin is a production origin.

`ENVIRONMENT || "production"` and `CORS_ORIGIN || "https://busaralabs.com"` were removed from `functions/api/contact.js`.
