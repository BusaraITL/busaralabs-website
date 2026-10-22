# Hard gates

Governing rule for PR #2: any mandatory control that is FAIL or NOT VERIFIED is a NO-GO. NOT APPLICABLE — NOT IMPLEMENTED is used only when the component does not exist and no placeholder points at production.

Principles: isolation by default, deny by default, verify from outside, no release by assumption.

Review start SHA: `c1f453dc38b4994d0105d005550c1abb4d30d9d4` on `cursor/v2-staging-rc-6f86`. Live production and staging remain `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26`. This file is committed on the candidate branch. The SHA to record for G0 is `git rev-parse HEAD` after that commit. `origin/main` must stay `a2bdcba`.

| Gate | Control | Status |
|---|---|---|
| G0 Freeze | SHA recorded, no merge, no deploy, production unchanged | PASS for this run |
| G1 Public exposure | Internal files absent from the deployed artifact; no unaddressed exposed credential | FAIL |
| G2 Access boundary | Staging and previews restricted; origin bypass tested | FAIL |
| G3 Isolation | DB, storage, queues, secrets, and deploy identities verified independently | NOT VERIFIED |
| G4 Pipeline | Branch controls, workflow permissions, and environment approvals tested | FAIL |
| G5 Runtime | Headers, access control, kill switch, and abuse controls tested | FAIL on the live host; PASS in the candidate suite |
| G6 Operations | Backup restore, monitoring, rollback, and credential response | NOT VERIFIED |
| G7 Release review | Owner explicitly approves the staging deploy | FAIL |

Decision: **NO-GO**.

## G0 Freeze

PASS for this work. No merge. No deploy. No push to `main` or `staging`. Collection flags are unset in the candidate. The live contact preflight is still the June handler because the candidate was not deployed. That live fact is G5, not a change made here.

## G1 Public exposure

FAIL. On 2026-10-22, read-only GET against `busaralabs.com`, `www.busaralabs.com`, `staging.busaralabs.com`, `busaralabs-website.pages.dev`, and `staging.busaralabs-website.pages.dev` returned 200 for `/wrangler.toml`, `/wrangler%2etoml`, `/HANDOVER.md`, `/package.json`, `/package-lock.json`, `/build.js`, `/workers/wrangler.worker.toml`, and `/workers/_worker.js`.

404, which does not clear the canonical 200s: `/WRANGLER.TOML`, `/Handover.md`, `/wrangler.toml/`, `/.git/HEAD`, `/.git/config`, `/node_modules/wrangler/package.json`, `/scripts/assemble-site.js`, `/docs/environment.md`, `/assets/js/main.js.map`, `/assets/js/main.bundle.js.map`. Encoded `/%2e%2e/wrangler.toml` returned 400.

No private key or token assignment was found in the earlier body scan. Resource identifiers in the toml are already public. There is no must-rotate credential from these responses. Deleting the files does not rotate a token.

The candidate guard is now an allowlist (`scripts/assert-public-artifact.js`). `npm test` rejects case variants, source maps, `.git/`, `node_modules/`, `docs/`, `scripts/`, `workers/`, `package.json`, and `build.js`. The built `public/` passes. That artifact is not deployed.

PR #3 carries the same allowlist for the current site. It is not merged.

## G2 Access boundary

FAIL. Anonymous GET of staging and both pages.dev hosts returned 200 with no `www-authenticate` and no Access redirect. `http://` to `https://` is a 301 only. `staging.busaralabs-website.pages.dev` sends `X-Robots-Tag: noindex`, which is not authentication.

The exact Access application, the named allow-list, and the proof curls are in `ACCESS-AND-IDENTITY.md`. Required token: one account, Access Apps and Policies Read, Access Organizations Read, and Cloudflare Pages Read. No write, no account-settings edit.

## G3 Isolation

NOT VERIFIED. Wrangler gives distinct D1, KV, and queue ids. The candidate refuses a non-production environment whose plain vars match a production id, and it refuses when the vars are missing. The Worker cannot see the dashboard binding. No Cloudflare read token was available, and none was requested beyond the scoped definition in `OPERATOR-CHECKLIST.md`.

| Component | Status | Reason |
|---|---|---|
| R2 | NOT APPLICABLE — NOT IMPLEMENTED | No `r2_buckets` block. The release check fails if one appears. |
| Service bindings | NOT APPLICABLE — NOT IMPLEMENTED | No `services` block. The release check fails if one appears. |
| User accounts | NOT APPLICABLE — NOT IMPLEMENTED | The site has no login or session store. |
| Admin routes | NOT APPLICABLE — NOT IMPLEMENTED | `functions/api/` contains only `contact.js`. Live `GET /api/admin` was 404. |
| Analytics product | NOT APPLICABLE — NOT IMPLEMENTED | No analytics binding. The live CSP still names `static.cloudflareinsights.com` because the June deploy is what is running. |

Preview bindings do not contain the production D1 id, KV id, or `contact-production`. That is config evidence, not runtime proof.

## G4 Pipeline

FAIL. Workflow shape on the candidate is `contents: read`, SHA-pinned actions, no `pull_request_target`, and environment-specific secret names. Environments still have zero protection rules. Branch protection GET and PUT returned 403. Required scope is repository Administration Read to verify and Administration Write to apply, on `BusaraITL/busaralabs-website` only. The owner test is `G4-CONTROLLED-TEST.md`. It has not been run, because the protections are not applied.

## G5 Runtime

Candidate unit tests PASS (38). Live host FAIL.

Live home responses send HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, and Permissions-Policy. Their CSP is `script-src 'self' 'nonce-…' https://static.cloudflareinsights.com`. There is no `X-Robots-Tag` on the custom domains.

The candidate `public/_headers` and middleware set `script-src 'self'` with no nonce and no `unsafe-inline`. `X-Robots-Tag` is set by middleware for non-production hosts only, because a static tag would also cover `busaralabs.com`.

`/api/contact` rate-limits declared bursts and oversized `Content-Length` values while collection is off, and it does not read the body. KV is touched only when the resource guard accepts the environment. A zone rate-limit rule is still required and is not verified. Live `OPTIONS /api/contact` remains 204.

Collection in the candidate stays off unless `COLLECTION_ENABLED` is exactly `on`. Production also needs the acknowledgement. Neither is set.

## G6 Operations

NOT VERIFIED. No backup export and no restore drill. Monitoring is not visible from this token. Rollback to the Pages deployment of `a2bdcba` would serve the repository root again. `scripts/assert-release-safe.js` blocks a workflow that deploys `.` or assigns the collection switch. It cannot block a dashboard rollback. The allowed rollback is a forward deploy of a commit that passes that script. See `RELEASE-RECORD.md`.

No credential value was exposed in the scanned responses, so there is no rotation list. If a later check finds `CLOUDFLARE_API_TOKEN`, `SENDGRID_API_KEY`, `QUEUE_ENCRYPTION_KEY`, `TURNSTILE_SECRET_KEY`, or `POSTMARK_API_TOKEN`, rotate that name. `POSTMARK_API_TOKEN` is unused by the candidate and should be deleted if it still exists.

## G7 Release review

FAIL. No owner approval is recorded. The release template leaves the approver blank on purpose. `github.actor` in a future workflow log is not this approval.
