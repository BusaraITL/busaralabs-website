# Access and identity

Cloudflare Access was not configured from this environment. No Cloudflare token was available, and none was requested. The notes below are the operator runbook.

## Hostname inventory (observed 2026-10-24)

| Host | Role | Anonymous result | Access header | Notes |
|---|---|---|---|---|
| `busaralabs.com` | Production custom domain | 200, no login redirect | none | Do not put this host in the staging application unless the owner decides that separately. |
| `www.busaralabs.com` | Production custom domain | 200 | none | Same CORS origin as `busaralabs.com` on `OPTIONS /api/contact`. |
| `staging.busaralabs.com` | Preview custom domain | 200 | none | Must be in the Access application. |
| `busaralabs-website.pages.dev` | Production pages.dev alias | 200 | none | Direct origin. CORS origin is `https://busaralabs.com`. |
| `staging.busaralabs-website.pages.dev` | Preview pages.dev alias | 200 | none | Direct origin. Platform `X-Robots-Tag: noindex` on several files. That tag is not Access. |
| `https://<deployment>.busaralabs-website.pages.dev` | Per-deployment alias | NOT VERIFIED | NOT VERIFIED | Needs Pages Read. A failed Pages check is not a hostname inventory. |
| `<other-branch>.busaralabs-website.pages.dev` | Branch preview hosts | NOT VERIFIED | NOT VERIFIED | The wildcard below is what has to cover them. |

## Access test matrix

| Actor | `staging.busaralabs.com` | `*.busaralabs-website.pages.dev` and the production alias | `busaralabs.com` / `www` |
|---|---|---|---|
| Anonymous | Observed 200. Expected after the application exists: not 200, Location is the Access login. | Observed 200 on both aliases tested. Same expected result. | Observed 200. Leave unchanged until a separate production decision. |
| Authenticated, not on the allow-list | NOT VERIFIED. No IdP session was available. Expected: Access deny, not the site. | Same. | Not part of this application. |
| Named reviewer with MFA | NOT VERIFIED. Expected: 200 only after Access and MFA. | Same, including a deployment alias and a branch preview host. | Not part of this application. |

MFA is required on the identity provider. A one-time PIN to any address is not an allow-list. No bypass policy, no service token, and no exception for preview hostnames. `noindex` stays a secondary control only.

## What was observed

Anonymous `GET` on 2026-10-24 of staging, both pages.dev aliases, and production returned HTTP 200. Response headers did not include `www-authenticate`, `cf-access-authenticated-user-email`, or a redirect to a `cloudflareaccess.com` login. A burst of default Python requests on an earlier day received HTTP 403 with a short `text/plain` body and no Access header. A later single request to the same URL returned 200. That 403 is not evidence of Access.

`X-Robots-Tag` on the candidate is a supplementary control for every host other than `busaralabs.com` and `www.busaralabs.com`. It is not authentication. The live custom domains do not send it. The `staging.*.pages.dev` alias sent `X-Robots-Tag: noindex`, which is the platform default for that hostname and still served `wrangler.toml`.

## Application to create

In Cloudflare Zero Trust, create one Access application of type self-hosted.

Name: `Busara staging and preview`.

Session duration: 24 hours.

Include every public hostname that can serve a preview:

- `staging.busaralabs.com`
- `*.busaralabs-website.pages.dev`
- the project alias `busaralabs-website.pages.dev` if it serves preview or production content without Access
- any custom preview alias later attached to the Pages project

Do not attach this application to `busaralabs.com` or `www.busaralabs.com` until the owner decides production should sit behind Access. This runbook is for non-production.

Identity: the existing Busara identity provider. If the account has no IdP yet, add one that the named operators already use, then require MFA on that IdP. Access must require a passing IdP authentication. A one-time PIN mailed to any address is not an allow-list.

Policy name: `Named Busara operators`.

Action: Allow.

Include: emails of the named Busara operators, listed explicitly. The only GitHub login visible to this review was `CompBusaraLabs`. That is not proof of the Cloudflare identity. The owner types the real email addresses. Everyone else is denied. Add a second policy, action Block, for everyone, so a later default-allow change has to be deliberate.

Service tokens are out of scope. Do not create a bypass policy for the deploy smoke test. The smoke test in the candidate workflow only checks the canonical host after deploy; it is not a substitute for Access.

## Proofs the owner runs after saving the application

Use a normal browser user agent. Expect `302` or `401`/`403` to the Access login, and no response body that contains `pages_build_output_dir` or the site HTML.

```bash
UA='Mozilla/5.0 (compatible; BusaraAccessCheck/1.0)'
for u in \
  https://staging.busaralabs.com/ \
  https://staging.busaralabs.com/wrangler.toml \
  https://busaralabs-website.pages.dev/ \
  https://staging.busaralabs-website.pages.dev/wrangler.toml \
  https://busaralabs-website.pages.dev/HANDOVER.md
do
  curl -sI -A "$UA" --max-redirs 0 "$u" | awk 'BEGIN{IGNORECASE=1} /^HTTP|^location:|^www-authenticate:|^cf-access/'
done
curl -sI -A "$UA" --max-redirs 0 http://staging.busaralabs.com/ | awk 'BEGIN{IGNORECASE=1} /^HTTP|^location:/'
```

Expected:

- anonymous HTTPS requests do not return 200
- the `Location` is the Access login, not the origin content
- `http://` is `301` to `https://`, and the HTTPS request then hits Access
- a logged-in identity that is not on the allow-list receives Access deny, not the site
- a named operator with MFA receives 200
- repeating the checks against `https://busaralabs.com/` is a separate decision; today it returns 200 to anonymous clients and must stay unchanged until the owner authorises a production change

## GitHub identity

`CODEOWNERS` names `@CompBusaraLabs` for workflows, Wrangler files, `functions/`, `workers/`, and `docs/security/`. Code owners do nothing until a ruleset requires their review. Applying that ruleset was not permitted. See `OPERATOR-CHECKLIST.md`.
