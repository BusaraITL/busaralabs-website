# Incident and rollback

This file is the procedure. It was not executed. Production was not changed.

## If operational files are still public

They are. Treat the D1 ids, KV ids, and queue names as known. Do not publish the Cloudflare API token while cleaning this up.

The code rollback is a deploy of a commit whose upload directory is `public/` and whose guard passes. The prepared change is `cursor/prod-exposure-guard-6f86`. Deploying it is an owner action. This review did not deploy it.

After that deploy, `GET /wrangler.toml` and `GET /HANDOVER.md` on `busaralabs.com`, `www.busaralabs.com`, `staging.busaralabs.com`, and both pages.dev hosts must not return 200. Access is a separate control and is still required for staging.

## If a submission arrives while collection should be off

The live `OPTIONS /api/contact` returns 204, so the running function is the June handler, not the candidate gate. Do not probe it with a real personal-data body.

To close it, the owner deploys a commit that contains the gate, with `COLLECTION_ENABLED` unset and `COLLECTION_PRODUCTION_ACK` unset. Confirm with `OPTIONS /api/contact` expecting 403 and `Cache-Control: no-store`. Do not send a POST body as the test.

## If staging is suspected of using production data

1. Do not run the retention cron.
2. Compare the Pages preview bindings and the Worker `env.staging` bindings to the staging ids in `ISOLATION-MATRIX.md`.
3. If any binding is the production id, remove the binding before the next deploy. Do not "fix" it by pointing the staging vars at the production ids. The candidate code would then refuse, but the live June code would not.
4. Export nothing from the production database into the repository.

## Rollback of a bad Pages deploy

Cloudflare Pages can activate an older deployment from the dashboard. The known-good code SHA currently serving is `a2bdcba`. Rolling back to it restores the operational-file exposure. Prefer a forward deploy of the exposure-guard commit once the owner has accepted it. If a V2 deploy goes out and must be reversed, activate the previous Pages deployment and do not force-push `main`.

GitHub environment protection, once applied, is what stops the next unapproved push from deploying again.
