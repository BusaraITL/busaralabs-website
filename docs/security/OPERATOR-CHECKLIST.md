# Operator checklist

Run these in the Cloudflare and GitHub consoles. Do not paste tokens, account ids, or database exports into issues or commits. Expected results are the secure state, not the state observed on 2026-10-22.

## Cloudflare Access

1. Open Zero Trust → Access → Applications. Expected: one self-hosted application covering `staging.busaralabs.com` and `*.busaralabs-website.pages.dev`.
2. Open that application's policies. Expected: Allow only the named Busara emails, MFA required by the identity provider, session length 24 hours, and a Block rule for everyone else. No bypass and no service-token bypass.
3. From a private window, run the curls in `ACCESS-AND-IDENTITY.md`. Expected: no HTTP 200 for an anonymous client on those hosts.
4. Sign in as an address that is not on the list. Expected: Access deny page, not the site and not `wrangler.toml`.

## Bindings

5. Pages project `busaralabs-website` → Settings → Functions → preview bindings. Expected D1 id `0bf0fbac-152e-4427-9f1a-47e4873d23db`, KV `9133b26c873640f7af02b15e8b9a54a8`, queue `contact-staging`.
6. The same project, production bindings. Expected D1 id `27a86a12-f597-4a23-9835-ee4f3e889185`, KV `e0f93da5591d40d3938b6c938e7c8d2a`, queue `contact-production`.
7. Worker `busaralabs-queue-consumer-staging`. Expected the same staging ids and consumer queue `contact-staging`. Expected cron does not target the production database.
8. Worker `busaralabs-queue-consumer-production`. Expected the production ids only.
9. Confirm there is no R2 bucket bound to either Worker. Expected: none.

## Secrets

10. GitHub → Settings → Secrets and variables → Actions, repository secrets. Expected: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are absent.
11. Environment `staging`. Expected secrets: `STAGING_CLOUDFLARE_API_TOKEN`, `STAGING_CLOUDFLARE_ACCOUNT_ID`. No production token.
12. Environment `production`. Expected secrets: `PRODUCTION_CLOUDFLARE_API_TOKEN`, `PRODUCTION_CLOUDFLARE_ACCOUNT_ID`. No staging token.
13. Cloudflare Pages and both Workers. Expected secret names, per environment: `SENDGRID_API_KEY`, `QUEUE_ENCRYPTION_KEY`, `NOTIFY_EMAIL`, `TURNSTILE_SECRET_KEY`. Expected `POSTMARK_API_TOKEN` absent. Expected `COLLECTION_ENABLED` and `COLLECTION_PRODUCTION_ACK` unset.
14. `gh api repos/BusaraITL/busaralabs-website/actions/secrets` and the environment equivalents with an admin token. Expected: the names in steps 10–12, and no extra deploy tokens.

## GitHub rules

15. Apply `github-protection-payloads.json` with an admin token. Expected for `main` and `staging`: pull request required, one approval, code owner review, status check `Validate`, no force-push, no deletion, no bypass actor.
16. Environment `production`. Expected: required reviewer user `CompBusaraLabs` (id `279621574`) after the owner confirms that login, prevent self-review, deployment branch `main` only.
17. Environment `staging`. Expected: deployment branch `staging` only.
18. `gh api repos/BusaraITL/busaralabs-website/branches/main/protection` with an admin token. Expected: `allow_force_pushes.enabled` false and `required_pull_request_reviews` present. This review's token received HTTP 403 with `X-Accepted-Github-Permissions: administration=read`.

## Exposure and collection

19. After the owner deploys the exposure-guard commit, `GET` `/wrangler.toml`, `/HANDOVER.md`, and `/workers/wrangler.worker.toml` on `busaralabs.com`, `www.busaralabs.com`, `staging.busaralabs.com`, `busaralabs-website.pages.dev`, and `staging.busaralabs-website.pages.dev`. Expected: not 200.
20. `OPTIONS /api/contact` on production after a release that contains the gate, with collection unset. Expected: 403 and `Cache-Control: no-store`. Today the expected failure is 204, and that is what this review observed.

## Backup

21. Run the non-production drill in `BACKUP-AND-RESTORE.md`. Expected: a recorded export and restore of `busaralabs-staging-db` only.

## Attempt from this review

Ruleset list returned an empty array (readable). `GET` and `PUT` of classic branch protection returned 403 `Resource not accessible by integration` (`administration=read`). The PUT did not apply. Secret lists returned 403. No protection change was applied. No deploy was started.
