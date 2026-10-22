# Architecture

Recorded 2026-10-22 from the repository and from read-only HTTP and DNS checks. Classifications are Verified, Failed, or Not Verified.

## What is deployed

| Item | Evidence | Result |
|---|---|---|
| Production and staging Git commit | GitHub deployments API: both environments are SHA `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26`, created 2026-06-22. `origin/main` and `origin/staging` are that SHA. | Verified |
| Candidate | Branch `cursor/v2-staging-rc-6f86`. Starting SHA `be5a996`. Not present on `main` or `staging`. | Verified |
| Live pages are the June site | `GET https://staging.busaralabs.com/` returned the pre-V2 homepage (title and CSP still allow `static.cloudflareinsights.com`). | Verified |
| Candidate is not live | The V2 pages and the collection gate are not what those hosts returned. | Verified |

## Request path

```text
browser
  -> Cloudflare DNS (kristin.ns.cloudflare.com, jasper.ns.cloudflare.com)
  -> proxied A records 104.21.72.238 and 172.67.187.213
  -> Cloudflare Pages project busaralabs-website
       preview branch staging  -> staging.busaralabs.com
       production branch main  -> busaralabs.com and www.busaralabs.com
  -> static files from the uploaded directory
  -> Pages Function functions/api/contact.js for /api/contact
```

A second Worker, `busaralabs-queue-consumer`, is configured in `workers/wrangler.worker.toml`. Pages does not deploy it. Whether that Worker is deployed at all is Not Verified.

There is no R2 bucket in either Wrangler file.

## Why operational files are public

`origin/main` sets `pages_build_output_dir = "."` and the workflow runs `wrangler pages deploy .`. Cloudflare Pages serves every file in the uploaded directory. Nothing copies `HANDOVER.md` or `wrangler.toml` through a special route. The repository root is the site.

The candidate builds `public/` and deploys that directory only. That change is not deployed.

## Hostnames checked

| Host | `GET /` | `/wrangler.toml` | `/HANDOVER.md` | Access challenge |
|---|---|---|---|---|
| `staging.busaralabs.com` | 200 | 200 | 200 | none |
| `busaralabs.com` | 200 | 200 | 200 | none |
| `www.busaralabs.com` |  |  | 200 | none |
| `busaralabs-website.pages.dev` | 200 | 200 | 200 | none |
| `staging.busaralabs-website.pages.dev` |  | 200, `X-Robots-Tag: noindex` |  | none |
| `main.busaralabs-website.pages.dev` | 403, 17-byte body, no Access header |  |  | none |

`http://` on the custom hosts returned 301 to the same path on `https://`. That is TLS redirection, not an access policy.

`OPTIONS /api/contact` returned 204 on both custom hosts. The CORS origin was `https://staging.busaralabs.com` on staging and `https://busaralabs.com` on production. That shows the two deployments carry different `CORS_ORIGIN` values. It does not show that their databases differ.

`GET /api/admin` returned 404 on both custom hosts. `GET /.env` returned 404 on staging.

## Bindings named in config

Preview and the staging Worker use D1 `busaralabs-staging-db`, KV id `9133b26c873640f7af02b15e8b9a54a8`, queue `contact-staging`, DLQ `contact-staging-dlq`.

Production uses D1 `busaralabs-prod-db`, KV id `e0f93da5591d40d3938b6c938e7c8d2a`, queue `contact-production`, DLQ `contact-production-dlq`.

These identifiers are config. The live binding is Not Verified. The same identifiers are currently world-readable at `/wrangler.toml` and `/workers/wrangler.worker.toml`.

No Cloudflare account id value is stored in the file. The comment says it is injected as `CLOUDFLARE_ACCOUNT_ID`.

## Deploy identity

The workflow deploys only on `push` to `staging` or `main`. Pull requests run the validate job, which does not reference a Cloudflare secret. GitHub environments `staging` (id `16363690587`) and `production` (id `16495237394`) were readable and had `protection_rules: []`, so the workflow comment that production has a manual gate is false. The token used for this review cannot change that (`administration` is required).

The only collaborator returned was `CompBusaraLabs` (user id `279621574`, role maintain, `admin: false`). `gh api user` returned 403, so the authenticated login was Not Verified.
