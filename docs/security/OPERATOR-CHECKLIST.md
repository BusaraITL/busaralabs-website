# Operator checklist

Grouped by gate. Each unreachable setting lists the setting, the minimum permission, the expected value, and how to verify it. Do not create an account-wide token. Do not grant edit, deploy, or secret-read permissions for a verification pass.

Tokens are separate so a read of Access cannot also edit D1.

## Token definitions

Account: the single Cloudflare account that owns `busaralabs-website`. Zone, where a zone permission is required: `busaralabs.com` only.

| Token | Permissions | Not included |
|---|---|---|
| G2 read | Account → Access: Apps and Policies → Read. Account → Access: Organizations, Identity Providers, and Groups → Read. Account → Cloudflare Pages → Read. | No Access Edit, no Pages Edit, no D1, no KV, no Queues, no Account Settings |
| G3 data read | Account → D1 → Read. Account → Workers KV Storage → Read. Account → Queues → Read. | No D1 Edit, no KV Edit, no Queues Edit, no Workers Scripts Edit |
| G5 zone read | Zone → Zone → Read. Zone → WAF → Read. Zone resource: `busaralabs.com` only. | No WAF Write, no Firewall Edit, no other zones |
| GitHub verify | Fine-grained, this repository only. Administration Read. Actions Read. Contents Read. Metadata Read. | No Administration Write, no Secrets, no all-repositories |

A later read-only verification of G2 and G3 can use the G2 token and the G3 token. This review did not ask for them and did not use them.

## G0 Freeze

No console change. Expected: `origin/main` and `origin/staging` are `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26`. Verify with `git rev-parse origin/main origin/staging`.

## G1 Public exposure

After the owner deploys PR #3, repeat the GET list in `GATES.md` on all five hosts. Expected: every operational path is not 200, including `/wrangler%2etoml`, `/package.json`, `/build.js`, and `/workers/wrangler.worker.toml`.

Permission to confirm the active Pages deployment: G2 token, Cloudflare Pages Read. Expected deployment commit is the exposure-guard SHA, and the upload directory is `public`.

## G2 Access

Setting: Zero Trust → Access → Applications → self-hosted application `Busara staging and preview`.

Expected hostnames: `staging.busaralabs.com`, `*.busaralabs-website.pages.dev`. Policy Allow lists named Busara emails only. A second policy Blocks everyone else. Session 24 hours. MFA is required by the identity provider. No bypass and no service token.

Permission to verify: G2 token. API: `GET /accounts/{account_id}/access/apps` and the policy endpoint for that app. Expected: the hostnames above and no include-everyone rule.

Proof from outside, without a token: the curls in `ACCESS-AND-IDENTITY.md`. Expected: anonymous requests are not HTTP 200.

## G3 Isolation

Setting: Pages project `busaralabs-website` → preview bindings, and Worker `busaralabs-queue-consumer-staging`.

Expected preview and staging Worker: D1 `0bf0fbac-152e-4427-9f1a-47e4873d23db`, KV `9133b26c873640f7af02b15e8b9a54a8`, queue `contact-staging`. Production bindings use `27a86a12-f597-4a23-9835-ee4f3e889185`, KV `e0f93da5591d40d3938b6c938e7c8d2a`, queue `contact-production`. No R2. No service binding.

Permission: G3 data read, plus Pages Read on the G2 token for the Pages binding screen. Verify with `GET` on the D1 database list and the Pages project. Expected ids match the table and the two sets are disjoint.

Secrets, names only, environment scoped: staging holds `STAGING_CLOUDFLARE_API_TOKEN` and `STAGING_CLOUDFLARE_ACCOUNT_ID`. Production holds the `PRODUCTION_` pair. Repository-level `CLOUDFLARE_API_TOKEN` is absent. Permission to see names: a GitHub token with Administration Read still cannot list Actions secrets unless the org allows it. If the list API returns 403, record NOT VERIFIED. Do not grant a token that can read secret values.

## G4 Pipeline

Apply `github-protection-payloads.json` with a separate Administration Write token, then discard that token. Verify with the GitHub verify token.

Expected for `main` and `staging`: one approving review, code-owner review, status check `Validate`, no force-push, no deletion, no bypass actor. Production environment: required reviewer `CompBusaraLabs` after the owner confirms that login, deployment branch `main` only. Staging environment: deployment branch `staging` only.

Then run `G4-CONTROLLED-TEST.md`.

## G5 Runtime and abuse

Setting: zone `busaralabs.com` → Security → WAF → Rate limiting rules → custom rule `contact-endpoint`.

Expression: `(http.host in {"busaralabs.com" "www.busaralabs.com" "staging.busaralabs.com"} and http.request.uri.path eq "/api/contact")`.

Characteristic: IP. Threshold: 10 requests per 60 seconds. Action: Block. Period of mitigation: 60 seconds.

This rule does not cover `*.pages.dev`. Those hostnames are not in this zone. Access in G2 is the control for them.

Permission to create the rule: Zone → WAF → Write on `busaralabs.com` only, used once by the owner. Permission to verify: G5 zone read. Expected: the rule is enabled and the expression matches the path above.

Candidate code already rate-limits `/api/contact` while collection is off. That code is not live until a reviewed deploy.

`OPTIONS /api/contact` after a deploy that contains the gate, with both collection variables unset. Expected: 403 and `Cache-Control: no-store`. Today it is 204.

## G6 Operations

Run the non-production restore drill in `BACKUP-AND-RESTORE.md` against `busaralabs-staging-db` only. Expected: a recorded export and restore. Permission: do not use the read token for the drill; the owner uses their existing D1 console session and does not paste the export into git.

Rollback: do not activate the Pages deployment of `a2bdcba`. Expected active deployment passes `node scripts/assert-release-safe.js`.

## G7 Release review

The owner writes their name, the SHA, and the artifact hash into a copy of `RELEASE-RECORD.md` before any staging deploy. Expected before deploy: `approver` is the owner and `deploy_result` is still `not-started`. This review left that blank.
