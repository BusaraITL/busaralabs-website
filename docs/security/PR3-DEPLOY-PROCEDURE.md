# PR #3 deploy and post-deploy verification

Do not run this procedure as part of the review that wrote it. Production exposure stays FAIL until an owner-authorized deploy of this branch is followed by the live checks below.

This branch is `cursor/prod-exposure-guard-6f86`. Its pull request is draft PR #3, base `main`. Do not merge PR #2 in the same action. The two pull requests both change `wrangler.toml`, `build.js`, `.github/workflows/deploy.yml`, and `scripts/assert-public-artifact.js`, and this branch also changes `functions/api/contact.js` and `workers/queue-consumer.js`. Merging both without a manual resolution will conflict.

## Authorization this procedure does not grant

- No merge of PR #2 or PR #3 is implied.
- No rollback to `a2bdcba`. That deployment publishes the repository root and the June contact handler.
- No Cloudflare Access, DNS, binding, or secret change.
- No GitHub branch protection and no secret creation or rotation.
- Do not sign `RELEASE-RECORD.md`. A blank approver is not approval.
- Do not print response bodies. Record status, final URL, content type, and length only.

## Before a deploy the owner chooses

1. Confirm the head SHA of `cursor/prod-exposure-guard-6f86` with `git rev-parse origin/cursor/prod-exposure-guard-6f86`.
2. On a clean checkout of that SHA, run `npm ci`, `node build.js`, and `npm test`. Expected: exit 0, and `public/` does not contain `wrangler.toml`, `HANDOVER.md`, `package.json`, `package-lock.json`, `build.js`, or `workers/`.
3. Confirm `package.json` `deploy` is `wrangler pages deploy public` and the workflow smoke steps call `https://busaralabs.com` and `https://staging.busaralabs.com` directly.
4. Pages Git integration on this repository has failed closed with "Build failed" when the output directory is `public` and the connected build does not run `node build.js`. Permission to read that log: Cloudflare Pages Read on the one account. Expected evidence: the failed deployment was not promoted, and the build command is `npm ci && node build.js` with output directory `public`. Do not retry a failed Git build until that command is set. Do not paste the dashboard URL into git; it contains an account id.

## Deploy, only after a separate written authorization

Minimum permission: the existing production Pages deploy token already stored for this workflow (`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`). This pull request does not rename those secrets. Creating `STAGING_` or `PRODUCTION_` names is a later change on PR #2 and would make this workflow fail.

The deploy command, run by the owner and not by this review:

```bash
npm ci
node build.js
node scripts/assert-public-artifact.js public
npx wrangler pages deploy public --project-name=busaralabs-website --branch=main
```

Deploy staging only with the same `public` directory and `--branch=staging`, and only if the owner wants the preview alias updated in the same window. Do not pass `.` as the directory.

## Post-deploy verification

Use a browser user agent. Methods: GET and HEAD only. No POST body.

Hosts: `https://busaralabs.com`, `https://www.busaralabs.com`, `https://staging.busaralabs.com`, `https://busaralabs-website.pages.dev`, `https://staging.busaralabs-website.pages.dev`, plus any deployment-specific `https://<id>.busaralabs-website.pages.dev` shown in the deploy output.

Paths: `/wrangler.toml`, `/HANDOVER.md`, `/workers/_worker.js`, `/package.json`, `/package-lock.json`, `/build.js`, `/wrangler%2etoml`, `/WRANGLER.TOML`, `/.git/HEAD`, `/workers/wrangler.worker.toml`.

Expected: none of those paths returns 200. `/` still returns 200. `OPTIONS /api/contact` returns 403 with `Cache-Control: no-store` and a JSON body that says collection is disabled. `GET /api/contact` returns 405. No email is sent by these checks.

```bash
UA='Mozilla/5.0 (compatible; BusaraExposureCheck/1.0)'
for host in busaralabs.com www.busaralabs.com staging.busaralabs.com busaralabs-website.pages.dev staging.busaralabs-website.pages.dev; do
  for path in /wrangler.toml /HANDOVER.md /workers/_worker.js /package.json /package-lock.json /build.js /wrangler%2etoml; do
    curl -sI -A "$UA" -o /dev/null -w "%{http_code} %{url_effective} %{content_type}\n" "https://$host$path"
  done
done
curl -sI -A "$UA" -X OPTIONS -o /dev/null -w "%{http_code} %{content_type}\n" https://busaralabs.com/api/contact
```

Record the status lines. If any operational path is still 200, the deploy did not replace the root upload. Leave G1 as FAIL and do not roll back to `a2bdcba`.

Hash-specific Pages deployment URLs are not discoverable without the deploy output or Pages Read. If the owner has that output, repeat the same path list against that host. Expected: the same non-200 results. A 200 on a stale deployment URL means that deployment is still an old root upload; do not promote it.

## What stays unverified after a successful file check

Access, D1, KV, queue bindings, and GitHub rules are not changed by this deploy. G2, G3, G4, G6, and G7 stay at their current results until their own procedures are run.
