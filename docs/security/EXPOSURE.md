# Exposure findings

## Cause

Live production and staging deploy SHA `a2bdcba`, whose workflow runs `wrangler pages deploy .` and whose `wrangler.toml` sets `pages_build_output_dir = "."`. Pages publishes the repository root. `/wrangler.toml`, `/HANDOVER.md`, and `/workers/wrangler.worker.toml` are ordinary files in that root. They are not copied by a build step and they are not given a special route.

## What the files contain

`/wrangler.toml` on staging, production, and `busaralabs-website.pages.dev` is the same 2,849-byte file. It contains both environments' D1 ids, KV ids, queue names, and hostnames. It does not contain an account id value, a private key, or a token assignment.

`/workers/wrangler.worker.toml` on staging also contains the DLQ names.

`/HANDOVER.md` on `busaralabs.com`, `www.busaralabs.com`, `staging.busaralabs.com`, and `busaralabs-website.pages.dev` is the June handover (28,082 bytes). It describes the old site. The scan found no credential and no resource id. It is still an internal runbook and is public.

`/.env` returned 404. `/api/admin` returned 404.

## Candidate remediation

`scripts/assert-public-artifact.js` fails the build when `public/` contains `wrangler.toml`, any `.md`, `.env*`, `workers/`, `src/`, `.github/`, `.git/`, key or certificate extensions, or a file whose first bytes include `PRIVATE KEY`. `node build.js` runs that check. The workflow runs it again before either deploy. `npm test` includes the guard.

Verified locally after `node build.js`: the guard passed on `public/`.

## Live status

Failed and open. This branch was not deployed. Removing the files from `busaralabs.com` requires a production deploy, which this work does not perform.

A separate branch, `cursor/prod-exposure-guard-6f86`, changes only the publish directory and the guard on top of `main`. It does not change the contact handler, the page copy, or the collection behavior. Merging it is an owner decision. Until that release, production exposure remains **FAIL / OPEN**.

## Rotation

No live credential value was found, so there is no must-rotate secret from this scan. The resource ids are already public. Deleting the files does not rotate a token that was never in them. If `POSTMARK_API_TOKEN` still exists in Cloudflare from the old comments, delete it; the code does not use it.
