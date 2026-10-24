# Secret names and rotation

No secret value was read, printed, or committed. GitHub secret-list APIs returned 403 (`Resource not accessible by integration`) for the repository and for the `production` and `staging` environments. Existence of those secrets is Not Verified.

## Names the candidate workflow will read

| Environment | Names |
|---|---|
| `staging` | `STAGING_CLOUDFLARE_API_TOKEN`, `STAGING_CLOUDFLARE_ACCOUNT_ID` |
| `production` | `PRODUCTION_CLOUDFLARE_API_TOKEN`, `PRODUCTION_CLOUDFLARE_ACCOUNT_ID` |

The workflow no longer references `secrets.CLOUDFLARE_API_TOKEN` or `secrets.CLOUDFLARE_ACCOUNT_ID`. A repository-level secret of the old name is not selected by the new jobs. Delete the old repository secrets after the environment secrets exist, so a later workflow edit cannot fall back to them. Store the token and the account id as environment secrets, not as one shared pair.

## Names the application reads

| Name | Where | Notes |
|---|---|---|
| `SENDGRID_API_KEY` | `workers/queue-consumer.js` | Worker secret. Non-production code returns before SendGrid is called. |
| `NOTIFY_EMAIL` | queue consumer | Address, stored as a secret. Not a token. |
| `QUEUE_ENCRYPTION_KEY` | contact function and queue consumer | Required before a submission is stored. Missing key refuses the request. |
| `TURNSTILE_SECRET_KEY` | contact function | Missing key refuses the request. The old code skipped verification. |
| `COLLECTION_ENABLED` | collection gate | Not a secret. Exact value `on` or the endpoint stays closed. Do not commit it. |
| `COLLECTION_PRODUCTION_ACK` | collection gate | Not a secret. Exact acknowledgement string in `functions/lib/collection-gate.js`. Do not commit it. |

Pages comments on `origin/main` also name `POSTMARK_API_TOKEN`. The candidate JavaScript does not read it. The exposure branch's contact handler and queue consumer do not read it, and their Wrangler comments now say not to create it. Whether `POSTMARK_API_TOKEN` is configured in Cloudflare is NOT VERIFIED: the secret list returned 403 on 2026-10-24 (`secrets=read`). If it exists, the owner should delete it. Deletion of the name from comments does not rotate a live token. Do not print the value.

`D1_DATABASE_ID`, `KV_NAMESPACE_ID`, and `QUEUE_NAME` are plain vars, not secrets. They are already in git and, today, on the public `/wrangler.toml`.

## History scan

`gitleaks` 8.30.1 scanned 34 commits and the working tree on 2026-10-22. Findings: 0. The checksum of the binary tarball matched the upstream checksum file (`551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`). Trufflehog was not installed. A second scanner was not run.

## Live file scan

The public `wrangler.toml` (same SHA-256 prefix `c0b9f50c090147d3` on staging, production, and `busaralabs-website.pages.dev`) contains the D1, KV, and queue identifiers above, both environments' hostnames, and the words "account id" in a comment. It did not contain a private key, a token assignment, a SendGrid key, or a 32-hex value other than the two KV ids already in git.

`HANDOVER.md` on production (28,082 bytes) is the June operational note. The scan found no email address, no resource id, and no private key. It is still an operational document and must not be served.

No credential value was found, so this review does not list a must-rotate secret. Resource identifiers are already public. Rotation of those ids is an owner decision; renaming them is a Cloudflare change and was not performed. If the owner later finds `CLOUDFLARE_API_TOKEN`, `SENDGRID_API_KEY`, `QUEUE_ENCRYPTION_KEY`, `TURNSTILE_SECRET_KEY`, or `POSTMARK_API_TOKEN` in a log or an old dashboard screenshot, rotate that credential. Removing the file from the site does not rotate it.

## Ownership

The owner of Busara Infrastructure and Technology Labs Ltd holds the Cloudflare account and the GitHub environment secrets. This review could not see the secret owners. `CompBusaraLabs` is the only GitHub collaborator returned.
