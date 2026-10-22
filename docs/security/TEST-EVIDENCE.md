# Evidence by gate

Date: 2026-10-22. Live calls were GET only. No request body was posted. Details and the NO-GO rule are in `GATES.md`.

| Gate | Evidence | Result |
|---|---|---|
| G0 | `origin/main` and `origin/staging` are `a2bdcba`. PR #2 and PR #3 are drafts. No deploy job was started. | PASS |
| G1 | Five hosts returned 200 for `/wrangler.toml`, `/wrangler%2etoml`, `/HANDOVER.md`, `/package.json`, `/package-lock.json`, `/build.js`, `/workers/wrangler.worker.toml`, `/workers/_worker.js`. Case variants and `.git/` were 404. Source maps were 404. Allowlist tests pass on the candidate artifact. | FAIL live |
| G2 | Anonymous GET returned 200 on staging and both pages.dev hosts. No Access header. | FAIL |
| G3 | Distinct ids in Wrangler. No R2 or service binding. Dashboard not read. Secret list API 403. | NOT VERIFIED |
| G4 | Candidate workflow permissions and pins. Environment `protection_rules` length 0. Protection GET/PUT 403. Controlled test not run. | FAIL |
| G5 | `npm test` 38 passed, including closed-endpoint rate limit, 413 on oversized Content-Length, header allowlist, and release-safety. Live CSP still allows a nonce and `static.cloudflareinsights.com`. Live OPTIONS `/api/contact` is 204. | FAIL live |
| G6 | No restore. Rollback to `a2bdcba` would republish the root. `assert-release-safe.js` passes on the candidate and cannot see the dashboard. | NOT VERIFIED |
| G7 | Release template approver is blank. | FAIL |

`gitleaks` 8.30.1 on the earlier scan of 34 commits: 0 findings. Re-run it in CI on the next validate. This environment did not print secret values.
