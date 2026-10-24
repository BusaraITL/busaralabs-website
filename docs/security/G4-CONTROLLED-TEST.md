# G4 controlled test

Run this only after the owner has applied the rulesets and environment rules in `github-protection-payloads.json`. Do not run it before that. This review did not run it. On 2026-10-24 the ruleset list was empty, both environment objects had no protection rules, and classic branch protection returned 403 (`administration=read`). A successful `Validate` workflow is not proof that any of the blocks below exist.

Branch names under test are `main` and `staging`. The candidate branch is `cursor/v2-staging-rc-6f86`. The exposure branch is `cursor/prod-exposure-guard-6f86`. Neither is a protected branch. The required check context is exactly `Validate`.

Use a GitHub account that can open a pull request and cannot bypass the ruleset. Do not use a token with Administration Write for the attempt itself.

## Expected blocks

Use a token with Contents Write on a throwaway fork or a non-admin user. Do not use Administration Write for the attempts. `bypass_actors` in the payload is empty, and `enforce_admins` is true on the classic payload, so an admin must be rejected too. If an admin push succeeds, G4 stays FAIL.

1. Direct push: `git push origin main` and `git push origin staging` from a commit that has no pull request. Expected: rejected. `origin/main` and `origin/staging` stay `a2bdcba` until a reviewed merge.
2. Force push: `git push --force origin main` and the same for `staging`. Expected: rejected (`non_fast_forward`).
3. Pull request review: open a pull request that changes `.github/workflows/deploy.yml`. Expected: merge is blocked until one approving review from `@CompBusaraLabs` and the `Validate` check is green. The author's review does not count. `CODEOWNERS` covers `/.github/workflows/` only on the candidate branch. `main` has no CODEOWNERS file, so this block is not meaningful on `main` until that file is there.
4. Required CI: a pull request whose `Validate` check is failing or missing. Expected: merge is blocked. A green `Validate` on a branch that is not `main` or `staging` must not start `Deploy — Staging` or `Deploy — Production`.
5. Admin bypass: repeat item 1 with an admin account that is not in `bypass_actors`. Expected: rejected.
6. Environment protection: push a commit that would deploy, after a merge that the ruleset allowed, and do not approve the GitHub environment. Expected: `Deploy — Production` waits for reviewer id 279621574 and does not call Wrangler. `Deploy — Staging` waits for the same reviewer. The production environment accepts only `main`. The staging environment accepts only `staging`.
7. Secrets and untrusted code: the validate job log for a pull request from a fork does not list `STAGING_CLOUDFLARE_API_TOKEN`, `PRODUCTION_CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_API_TOKEN`, or `CLOUDFLARE_ACCOUNT_ID` as set. Do not print values. The candidate workflow has no `pull_request_target`. SHA pins on the candidate are `actions/checkout@11d5960a326750d5838078e36cf38b85af677262`, `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`, and `cloudflare/wrangler-action@9acf94ace14e7dc412b076f2c5c20b8ce93c79cd`. PR #3 still uses version tags and the shared secret names; do not treat that workflow as the isolated one.
8. Separate authorization: an approval on the staging environment does not approve production, and the reverse. Expected: each environment has its own required reviewer and its own branch policy.

Record the rejection text for each attempt. If any push, merge, or deploy starts without the matching approval, G4 stays FAIL and the release stays NO-GO.

Required permission to confirm the rules after the test: a fine-grained personal access token on `BusaraITL/busaralabs-website` only, Administration Read, Contents Read, Actions Read, Metadata Read. No Administration Write on the token that performs the push attempts.
