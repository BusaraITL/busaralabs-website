# G4 controlled test

Run this only after the owner has applied the rulesets and environment rules in `github-protection-payloads.json`. Do not run it before that. This review did not run it.

Use a GitHub account that can open a pull request and cannot bypass the ruleset. Do not use a token with Administration Write for the attempt itself.

## Expected blocks

1. From a fork or a branch that is not `staging`, open a pull request that changes `.github/workflows/deploy.yml`. Expected: merge is blocked until `CompBusaraLabs` approves and the `Validate` check is green. A review from the pull request author does not count if prevent-self-review is on for that environment. The pull request must not start `Deploy — Staging` or `Deploy — Production`.
2. Attempt `git push --force origin main` with a non-bypass token. Expected: rejected. `origin/main` remains `a2bdcba` until a reviewed merge.
3. Attempt `git push origin staging` from a commit that has no pull request. Expected: rejected.
4. Merge the workflow pull request without a code-owner review. Expected: GitHub refuses the merge.
5. After a clean merge to a throwaway branch that is not `main` or `staging`, confirm the Actions run has no `STAGING_CLOUDFLARE_API_TOKEN` or `PRODUCTION_CLOUDFLARE_API_TOKEN` in the validate job. Expected: the validate log does not list those names as set. Do not print values.

Record the four HTTP or GitHub error texts in the release record. If any push or merge succeeds, G4 stays FAIL and the release stays NO-GO.

Required permission to confirm the rules after the test: a fine-grained personal access token on `BusaraITL/busaralabs-website` only, Administration Read, Contents Read, Actions Read, Metadata Read. No Administration Write on the token that performs the push attempts.
