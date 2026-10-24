# Evidence by gate

## 2026-10-24 recheck

Live calls were GET, HEAD, and OPTIONS with no request body. No POST. Bodies were classified and hashed, not stored in git. Details are in `GATES.md`.

| Gate | Evidence this pass | Result |
|---|---|---|
| G0 | `origin/main` and `origin/staging` still `a2bdcba`. Both pull requests still drafts. Deploy jobs skipped. No merge. | PASS for this run |
| G1 | Five hosts, GET and HEAD, 200 for the seven operational paths. SHA-256 of the served files matches `a2bdcba` for `wrangler.toml`, `HANDOVER.md`, `package.json`, `package-lock.json`, `build.js`, and `workers/_worker.js`. No credential marker. Allowlist unit tests pass. Live site unchanged. | FAIL |
| G2 | Anonymous 200, no Access header, on staging and both pages.dev aliases. | FAIL |
| G3 | Environment and binding APIs were not called. Secret list 403. | NOT VERIFIED |
| G4 | Rulesets empty. Classic protection 403. Environments unprotected. Controlled test not run. | FAIL |
| G5 | `OPTIONS /api/contact` is 204 on all five hosts. Candidate tests cover the kill switch, encoded names, KV failure, and no outbound fetch. | FAIL live |
| G6 | No restore command was run. | NOT VERIFIED |
| G7 | Approver still blank. | FAIL |

Unit tests do not prove a live property.

Commands on the candidate checkout, 2026-10-24:

| Command | Exit |
|---|---|
| `node --experimental-default-type=module --test tests/*.mjs` | 0 (40 passed) |
| `node build.js` before `npm ci` | 1 (`esbuild` missing) |
| `npm ci` | 0 |
| `node build.js` | 0 |
| `node scripts/assert-public-artifact.js public` | 0 |
| `node scripts/assert-release-safe.js` | 0 |
| `node --experimental-default-type=module --check` on `functions/api/contact.js`, `functions/lib/collection-gate.js`, `functions/lib/abuse-controls.js`, `workers/queue-consumer.js`, and `scripts/assert-public-artifact.js` | 0 |
| `npm audit --audit-level=critical` | 0 |

`npm audit` without the critical floor reports 6 vulnerabilities (1 moderate, 5 high) in wrangler's `undici` and `ws`. `npm audit fix` was not run.

Commands on `cursor/prod-exposure-guard-6f86`:

| Command | Exit |
|---|---|
| `npm ci` | 0 |
| `node --check` on `scripts/publish-public.js` and `scripts/assert-public-artifact.js` | 0 |
| `node --experimental-default-type=module --check` on `functions/api/contact.js`, `functions/lib/collection-gate.js`, and `workers/queue-consumer.js` | 0 |
| `node build.js` | 0 (13 HTML files, allowlist passed) |
| `npm test` | 0 (6 passed after the fail-closed KV and Turnstile checks) |
| `npm audit --audit-level=critical` | 0 |

Same high-severity advisory set. No fix was applied. The generated `public/` directory had no `wrangler.toml`, `HANDOVER.md`, `package.json`, `build.js`, `_worker.js`, or `.map` file.

## 2026-10-22

Live calls were GET only. No request body was posted. Details and the NO-GO rule are in `GATES.md`.

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
