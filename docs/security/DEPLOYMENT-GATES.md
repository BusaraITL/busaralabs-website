# Deployment gates

Decision for this candidate: **NO-GO**.

Nothing in this branch authorises a deploy. Production and staging were not pushed.

## Gates that must all be true before a deploy

1. Cloudflare Access denies anonymous and non-allow-listed users on `staging.busaralabs.com` and every `*.pages.dev` hostname. Status: Not Verified. Live anonymous requests returned 200.
2. The uploaded directory is `public/` and a fetch of `/wrangler.toml` and `/HANDOVER.md` is not 200. Status: true in the candidate artifact, Failed on the live hosts.
3. Dashboard bindings for preview and the staging Worker match the staging ids, and production matches the production ids. Status: Not Verified.
4. `STAGING_*` and `PRODUCTION_*` Cloudflare secrets exist only on their GitHub environments. The old shared names are absent. Status: Not Verified (secret API 403).
5. `main` and `staging` require a pull request, the `Validate` check, and a code owner review. Force-push and deletion are off. Status: not applied. Rulesets length was 0. Classic protection GET returned 403.
6. The `production` environment requires the owner as a reviewer and can deploy only from `main`. The `staging` environment can deploy only from `staging`. Status: not applied. Both environments had empty protection rules.
7. Collection remains off. `COLLECTION_ENABLED` is unset. The production acknowledgement is unset. Status: true in the candidate source. Failed on the live contact preflight, which still returns 204.
8. A non-production restore drill has been run, or the owner accepts that rollback of data is unproven. Status: Not Verified.

## What the workflow does

Validate runs on pull requests and on pushes. It has `permissions: contents: read`, does not receive a Cloudflare secret, pins checkout, setup-node, and wrangler-action to commit SHAs, and fails the build if `public/` contains operational files.

Deploy jobs run only when the event is `push` and the ref is `refs/heads/staging` or `refs/heads/main`. There is no `pull_request_target`. The production smoke test no longer falls back to the first `pages.dev` URL. Each job reads only its own environment secret names.

Pushing this branch does not match `main`, `staging`, or `feature/**`, so the current workflow will not deploy it. Opening a pull request runs validate only.

## Payload files

`github-protection-payloads.json` is the body the owner (or a token with `administration`) sends. The attempt from this token is recorded in `OPERATOR-CHECKLIST.md`.
