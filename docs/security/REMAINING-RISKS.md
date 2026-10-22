# Remaining risks

Release decision: **NO-GO**. The gate table in `GATES.md` is the governing record.

| Risk | Status |
|---|---|
| Anonymous users can open staging and every pages.dev alias | Open. Access was not applied. |
| `HANDOVER.md` and `wrangler.toml` are on production | Open. A production deploy is required and was not done. |
| Live contact preflight is 204 | Open. The kill switch is in the candidate only. |
| Dashboard bindings may not match Wrangler | Open. Not Verified. The Worker cannot see the binding id. |
| GitHub environments have no reviewers | Open. Token lacked `administration`. |
| Branch protection | Open. Rulesets were empty. Classic protection was not readable. |
| Secret inventory | Open. List API returned 403. |
| `POSTMARK_API_TOKEN` may still exist in Cloudflare | Open. Code does not read it. Owner deletes it if present. |
| Backups and a restore drill | Open. Not Verified. |
| Staging mail | Closed in the candidate: non-production never calls SendGrid. Not deployed. |
| Production URL fallback in the smoke test | Closed in the candidate workflow. Not deployed. |
| Shared Cloudflare secret name in the workflow | Closed in the candidate: jobs use environment-specific names. The stored secrets themselves were not moved. |
| Collection flag default | Closed in the candidate: anything other than exact `on` stays off, and production also needs the acknowledgement. Not deployed. |

Resource ids are in git history as well as on the live site. Removing the live file does not remove the git history. They are identifiers, not API tokens. Rewriting git history was not done.
