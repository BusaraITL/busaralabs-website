# Test evidence

Local suite: `npm test` on 2026-10-22, 32 tests, 0 failures. `node build.js` wrote `public/` and the artifact guard passed. `gitleaks` 8.30.1 reported 0 findings across 34 commits.

Live checks were `GET`, `HEAD`, or `OPTIONS` only. No form body was posted. No production row was written.

| # | Test | Result | Evidence |
|---|---|---|---|
| 1 | Anonymous staging access | FAIL | `GET https://staging.busaralabs.com/` returned 200 and the June homepage. No Access header. |
| 2 | Unauthorized identity | NOT VERIFIED | No Access application exists to present a wrong identity to. Operator curls are in `ACCESS-AND-IDENTITY.md`. |
| 3 | Origin and alternate hostname | FAIL | `GET https://busaralabs-website.pages.dev/wrangler.toml` and `GET https://staging.busaralabs-website.pages.dev/wrangler.toml` returned 200 with no Access redirect. `http://staging.busaralabs.com/wrangler.toml` returned 301 to HTTPS, then the file. |
| 4 | `/wrangler.toml` | FAIL live / PASS artifact | Live 200 on staging, production, and the pages.dev hosts. `public/wrangler.toml` is absent and the guard fails if it is added. |
| 5 | `HANDOVER.md` and similar files | FAIL live / PASS artifact | Live 200 for `HANDOVER.md` on production, www, staging, and `busaralabs-website.pages.dev`. Live 200 for `workers/wrangler.worker.toml` on staging. Live 404 for `/.env`. The guard rejects `.md`, `.env*`, `workers/`, and key files. |
| 6 | Secrets in source, artifacts, bundles, logs | PASS for the repo scan / NOT VERIFIED for platform logs | gitleaks 0. Live toml and handover had no private key and no token assignment. Resource ids are public. Cloudflare log storage was not readable. |
| 7 | Staging credentials against the production database | NOT VERIFIED | Config ids differ. The candidate refuses when the plain vars match production. The dashboard binding was not readable. No production credential was used. |
| 8 | Staging read or write of production data | NOT VERIFIED | No query was sent. The candidate cron does not `DELETE` unless the production vars match, and the contact handler returns 403 before the body when the database var is the production id (`tests/isolation.test.mjs`). The live site is still the old SHA. |
| 9 | Staging versus production storage and queues | NOT VERIFIED at runtime | Distinct names in Wrangler only. No R2 binding. Queue depth was not listed. |
| 10 | Unapproved deploy | FAIL as a control / PASS as an action | This work did not push `main` or `staging` and did not deploy. The GitHub environments have no protection rules, so a push to those branches would still deploy. |
| 11 | Pull request reaching production secrets | PASS for the workflow shape / NOT VERIFIED for stored secrets | No `pull_request_target`. Validate has no secret references. Deploy jobs use `STAGING_` or `PRODUCTION_` names and run only on push of those branches. Secret inventory API returned 403. Branch protection is not enforced, so a same-repo pull request can still change the workflow. |
| 12 | Unauthorized workflow change | NOT VERIFIED | `CODEOWNERS` is present and not enforced. Rulesets length 0. Classic protection GET returned 403. |
| 13 | Public admin endpoints | PASS | `functions/api/` contains only `contact.js`. `GET /api/admin` returned 404 on staging and production. The success response test does not return an email or a row id. |
| 14 | Kill switch | PASS in candidate / FAIL on the live host | Unit tests reject missing and lookalike flags before the body. Live `OPTIONS /api/contact` returned 204 on both hosts, which is the pre-gate handler. Collection was not enabled, and the candidate was not deployed. |
| 15 | Cross-environment mail and deletes | PASS in unit tests / NOT VERIFIED live | Staging config discards the queue without `fetch` and without reading the body. Cron does not call the database off production. No mail was sent. The live Worker binding was not listed. |
| 16 | Backup and rollback | NOT VERIFIED | No backup configuration is in the repo. No restore was performed. Git history can point a future deploy at `a2bdcba` or `8f778a9`. That is a code pointer, not a database backup. |

Commands, with bodies discarded:

```bash
curl -sI -A 'Mozilla/5.0' --max-redirs 0 https://staging.busaralabs.com/
curl -s -o /dev/null -w '%{http_code}\n' -A 'Mozilla/5.0' https://staging.busaralabs.com/wrangler.toml
curl -s -o /dev/null -w '%{http_code}\n' -A 'Mozilla/5.0' https://busaralabs.com/HANDOVER.md
curl -sI -A 'Mozilla/5.0' -X OPTIONS https://busaralabs.com/api/contact
curl -sI -A 'Mozilla/5.0' https://busaralabs.com/api/admin
gitleaks detect --source . --redact --exit-code 1
npm test
node scripts/assert-public-artifact.js public
```
