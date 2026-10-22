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

## Fail-closed behavior in the candidate

`functions/lib/resource-guard.js` compares `ENVIRONMENT`, `CORS_ORIGIN`, and the three plain id vars.

- Staging or preview continues only when all three vars equal the staging ids and the origin is `https://staging.busaralabs.com`.
- Any production id or the production origin on a non-production environment refuses before the body is read.
- Missing vars refuse. The Worker cannot see the real binding id, so a var that still says "staging" while the dashboard binding points at production is not detectable. That remains an operator check.
- Non-production sets `email` and `destructive` to false. The queue consumer acks without reading and does not call SendGrid. The cron handler does not run `DELETE`.
- Production cron runs `DELETE` only when all three vars equal the production ids and the origin is a production origin.

`ENVIRONMENT || "production"` and `CORS_ORIGIN || "https://busaralabs.com"` were removed from `functions/api/contact.js`.
