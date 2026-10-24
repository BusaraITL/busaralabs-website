# Hard gates

Governing rule: any mandatory control that is FAIL or NOT VERIFIED is a NO-GO. There is no average and no waiver. NOT APPLICABLE — NOT IMPLEMENTED is used only when the component does not exist and no placeholder points at production.

Principles: isolation by default, deny by default, verify from outside, no release by assumption.

Recheck date: 2026-10-24. Prior write-ups are evidence to re-test, not a standing result.

| Ref | SHA | Role |
|---|---|---|
| `origin/main` and `origin/staging` | `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26` | What is live. Do not roll back to this SHA. |
| PR #2 head before this recheck | `768f6bb532f3807e176f5f84aa02353961ba89c7` | Draft, base `staging`. V2 candidate. |
| PR #3 head before this recheck | `39af07fbfe5c0ece3daa67eb4054a643496913f3` | Draft, base `main`. Exposure guard only. |
| This recheck | `git rev-parse HEAD` on `cursor/v2-staging-rc-6f86` and on `cursor/prod-exposure-guard-6f86` | The heads to review after this commit. |

PR #3 does not depend on PR #2. Both change `wrangler.toml`, `build.js`, `.github/workflows/deploy.yml`, and `scripts/assert-public-artifact.js`. PR #3 also changes `functions/api/contact.js`, `workers/queue-consumer.js`, and `package.json` on top of `main`. Those files differ from the candidate, so the pull requests conflict if both merge. Do not merge them together.

| Gate | Control | Status |
|---|---|---|
| G0 Freeze | No unauthorized merge or deploy | PASS for this run |
| G1 Public exposure | Artifact safe; live production closed only after an authorized deploy and a live re-test | FAIL |
| G2 Access boundary | Staging and every preview protected; origin bypass tested | FAIL |
| G3 Isolation | Actual bindings and permissions verified | NOT VERIFIED |
| G4 Pipeline | Protections applied by the operator and controlled tests passed | FAIL |
| G5 Runtime | Correct handler, server-side kill switch, and abuse protection on the serving host | FAIL |
| G6 Operations | A restore was actually run | NOT VERIFIED |
| G7 Release review | A separate, explicit human authorization | FAIL |

Decision: **NO-GO**.

## G0 Freeze

PASS for this run. PR #2 and PR #3 stayed drafts. No merge. No deploy. No push to `main` or `staging`. `origin/main` and `origin/staging` remained `a2bdcba`. Cloudflare settings, DNS, Access, bindings, secrets, and GitHub protections were not changed. `RELEASE-RECORD.md` was not signed.

GitHub Actions on both previous heads: `Validate` succeeded, `Deploy — Staging` and `Deploy — Production` were skipped. The Cloudflare Pages check concluded failure. That is not a deploy and not a retry authorization. The dashboard log was not read.

## G1 Public exposure

FAIL on the live hosts. The artifact check on this branch passes, and that does not clear the live gate.

On 2026-10-24, read-only GET and HEAD from all five hosts (`busaralabs.com`, `www.busaralabs.com`, `staging.busaralabs.com`, `busaralabs-website.pages.dev`, `staging.busaralabs-website.pages.dev`) returned the same bytes for the operational paths. Final URL host matched the requested host. No `www-authenticate` and no `cf-access` header.

| Path | Status | Content type | Length | SHA-256 prefix | Safe class |
|---|---|---|---|---|---|
| `/wrangler.toml` | 200 | `application/toml` | 2849 | `c0b9f50c090147d3` | config document |
| `/wrangler%2etoml` | 200 | `application/toml` | 2849 | `c0b9f50c090147d3` | same object as the row above |
| `/HANDOVER.md` | 200 | `text/markdown` | 28082 | `96f975cb76d3c5a1` | markdown document |
| `/workers/_worker.js` | 200 | `application/javascript` | 3631 | `3ea7f5d1cd68b58c` | javascript |
| `/workers/wrangler.worker.toml` | 200 | `application/toml` | 4498 | not recorded | config document |
| `/package.json` | 200 | `application/json` | 654 | `7ea7ec7bd4682e7b` | json |
| `/package-lock.json` | 200 | `application/json` | 61767 | `959edc81991f6eae` | json |
| `/build.js` | 200 | `application/javascript` | 2385 | `a92e5ea45b88591b` | javascript |

Those six SHA-256 values match `git show a2bdcba:<path>`. The live toml assigns `pages_build_output_dir = "."` and does not assign `COLLECTION_ENABLED`. A scan of the bodies found no private-key marker and no token assignment. Resource identifiers in that file are already public. This is not a must-rotate finding. Do not print the bodies.

Also rechecked: `/WRANGLER.TOML` and `/Handover.md` 404, `/%2e%2e/wrangler.toml` 400, `/.git/HEAD` 404, `/.env` 404, `/docs/environment.md` 404, `/scripts/assemble-site.js` 404, `/node_modules/wrangler/package.json` 404, `/assets/js/main.js.map` and `/assets/js/main.bundle.js.map` 404. `/site.webmanifest` is 200 `application/manifest+json` (481 bytes) and had no credential marker; it is a public manifest. `/` is 200 HTML. Hash-specific `*.pages.dev` deployment URLs were not listed. That list is NOT VERIFIED without Pages Read.

`/workers/_worker.js` is served as a static file. `GET /api/contact` is 404 HTML and `OPTIONS /api/contact` is 204, which is Pages Functions behavior, not an advanced-mode worker at the upload root.

The candidate allowlist rejects those operational names, including a once- or twice-encoded `wrangler.toml`, a `_worker.js` entry, and `.map` files. `node build.js` publishes `public/` only. PR #3's `scripts/publish-public.js` refuses to use the repository root as the output directory and copies HTML, the five site-root files, `assets/`, and `functions/` only. Its `package.json` deploy script is `wrangler pages deploy public`.

Production exposure stays FAIL until the owner runs `docs/security/PR3-DEPLOY-PROCEDURE.md` and the live paths above are no longer 200.

## G2 Access boundary

FAIL. Anonymous GET of staging, both pages.dev aliases, and production returned 200 with no Access header. `noindex` on `staging.busaralabs-website.pages.dev` is a platform tag and is not authentication. The candidate middleware noindex is not what is live.

Hostname inventory, the anonymous / unauthorized / authorized matrix, and the dashboard steps are in `ACCESS-AND-IDENTITY.md`. Nothing was changed in Cloudflare.

## G3 Isolation

NOT VERIFIED. Wrangler on `a2bdcba` and on the candidate names distinct D1, KV, and queue ids. The live site serves that toml, so the ids are public configuration. The Pages and Worker bindings were not read. Distinct ids are not proof of which binding is attached.

| Component | Status | Reason |
|---|---|---|
| R2 | NOT APPLICABLE — NOT IMPLEMENTED | No `r2_buckets` block. The release check fails if one appears. |
| Service bindings | NOT APPLICABLE — NOT IMPLEMENTED | No `services` block. The release check fails if one appears. |
| User accounts | NOT APPLICABLE — NOT IMPLEMENTED | No login or session store. |
| Admin routes | NOT APPLICABLE — NOT IMPLEMENTED | Live `GET /api/admin` was not re-probed this pass. `GET /api/contact` is 404 HTML. The candidate exports no admin function. |
| Analytics binding | NOT APPLICABLE — NOT IMPLEMENTED | No analytics binding. Live CSP still names `static.cloudflareinsights.com` because the June deploy is what is running. |

Operator commands, permissions, and safe evidence are in `ISOLATION-MATRIX.md` and `OPERATOR-CHECKLIST.md`. Preview and staging share one Wrangler resource set because Pages has a single preview environment. That sharing is not verified at runtime, and the live handler does not contain the candidate resource guard.

## G4 Pipeline

FAIL. Observed on 2026-10-24:

- Repository rulesets: `[]`.
- Classic branch protection on `main` and `staging`: GET returned 403, `X-Accepted-Github-Permissions: administration=read`. That is NOT VERIFIED, not proof that protection is absent, and not permission to apply it.
- Environments `production` (`16495237394`) and `staging` (`16363690587`): `protection_rules` length 0, `deployment_branch_policy` null, `can_admins_bypass` true.
- Actions secret list: 403, accepted permission `secrets=read`. Secret names and values were not read.

The candidate workflow is `contents: read`, SHA-pinned, with no `pull_request_target`, and it uses `STAGING_` and `PRODUCTION_` secret names. PR #3 still uses `secrets.CLOUDFLARE_API_TOKEN` on its deploy jobs so an authorized exposure deploy does not depend on secrets that have not been created. PR #3 smoke tests now call the canonical hosts and no longer select the first `pages.dev` URL. PR #3 action uses are still major-version tags. A green `Validate` run is not proof that an unauthorized push or deploy is rejected.

Corrected payloads are in `github-protection-payloads.json`. The controlled test in `G4-CONTROLLED-TEST.md` was not run. `CODEOWNERS` on this branch names `@CompBusaraLabs` and is not enforced while the ruleset is absent. `main` does not contain that file.

## G5 Runtime

FAIL on every live host. Candidate unit tests pass and do not prove the live property.

Live `OPTIONS /api/contact` is 204 with `Access-Control-Allow-Origin: https://busaralabs.com` on `busaralabs.com`, `www.busaralabs.com`, and `busaralabs-website.pages.dev`, and `https://staging.busaralabs.com` on the two staging hosts. No `Cache-Control: no-store`. That is the June handler. The candidate and the updated PR #3 handler return 403 for POST and OPTIONS when `COLLECTION_ENABLED` is not exactly `on`, before the body is read, and the queue consumer acks without reading or calling SendGrid. Neither handler is deployed.

No POST was sent. Tests use synthetic fixtures and a fetch stub. They do not collect, store, queue, or send mail.

`/api/contact` rate limiting in the candidate runs while collection is off, fails closed when KV throws or is missing, and skips KV when the resource guard rejects the environment so a mis-bound request cannot write the other environment's key. The zone rule in `OPERATOR-CHECKLIST.md` is not applied. It would not cover `*.pages.dev`. The in-worker limit would, once this code is what serves those hosts. Today it does not.

`POSTMARK_API_TOKEN` is not read by candidate JavaScript or by the updated PR #3 handler. Whether the token exists in Cloudflare is NOT VERIFIED. Delete it if it exists. Deleting a comment does not rotate it.

## G6 Operations

NOT VERIFIED. No backup was listed and no restore was run. D1 Time Travel, KV, and the queues need an isolated drill that never targets `busaralabs-prod-db` or the production KV and queues. The procedure is in `BACKUP-AND-RESTORE.md`. Rollback to the Pages deployment of `a2bdcba` is forbidden: it is the root upload and the June handler.

## G7 Release review

FAIL. No owner has signed `RELEASE-RECORD.md`. A blank approver is not approval. `github.actor` on a future workflow run is the pusher, not this approval.
