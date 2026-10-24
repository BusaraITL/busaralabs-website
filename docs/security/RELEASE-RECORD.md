# Release record

Copy this template for every staging or production release. Leave fields blank until the owner fills them. Do not invent an approver.

```text
release_id:
target: staging | production
git_sha:
branch:
artifact_sha256:
output_dir: public
collection_enabled: unset
collection_production_ack: unset
approver:
approved_at:
deploy_result: not-started | smoke-checked | failed
wrangler_toml_status: not 200
handover_status: not 200
```

The workflow writes `sha`, `artifact_sha256`, `approver` (`github.actor`), `output_dir`, `collection`, and `deploy_result` to the job summary only when a deploy job runs. That job runs on a push to `staging` or `main`. This review did not push those branches, so no summary was produced. `github.actor` is the pusher, not G7 approval. G7 stays fail until the owner writes their name in a record like the one above.

## Rollback

A Cloudflare Pages "rollback" to the deployment of `a2bdcba` restores `wrangler pages deploy .`. That upload serves `wrangler.toml`, `HANDOVER.md`, `package.json`, and `workers/`. It also restores the June contact handler, whose preflight is 204.

That rollback is forbidden.

The allowed recovery is a new deploy of a commit for which `node scripts/assert-release-safe.js` passes. The script fails if the output directory is the repository root, if the workflow contains `pages deploy .`, or if either Wrangler file assigns `COLLECTION_ENABLED` or `COLLECTION_PRODUCTION_ACK`. It also fails if the preview or staging blocks contain the production D1 id, KV id, or `contact-production`.

The script does not run inside the Cloudflare dashboard. The owner confirms the active deployment id is a commit that passed the script before promoting it.
