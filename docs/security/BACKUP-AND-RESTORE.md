# Backup and restore

No backup product is configured in this repository. Wrangler does not declare a D1 export, an R2 bucket, or a KV backup. GitHub deployments list the site SHAs. They do not list database snapshots.

| Item | State |
|---|---|
| Code rollback pointer | Verified as git history. Current live SHA `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26`. Earlier same-day deployments include `8f778a9` and `e3dfb6a`. |
| Pages deployment history | Not Verified. Needs the Cloudflare dashboard. The GitHub deployment objects only store the SHA and the environment name. |
| D1 backup | Not Verified. No export was run. |
| KV backup | Not Verified. |
| Queue replay | Not Verified. Dead-letter queues are named in the Worker config and were not inspected. |
| Restore test | Not Verified. A restore against production data was not attempted. A restore against a synthetic non-production database was also not attempted, because this environment has no Cloudflare credentials. |

## What has to be covered

| Resource | Backup that would count | Observed |
|---|---|---|
| D1 `busaralabs-staging-db` and `busaralabs-prod-db` | Time Travel bookmark, or an export stored off the site | NOT VERIFIED. No `wrangler d1 time-travel info` and no export was run. |
| KV `9133b26c873640f7af02b15e8b9a54a8` and `e0f93da5591d40d3938b6c938e7c8d2a` | A namespace export or a provider backup | NOT VERIFIED. KV has no backup declaration in the repo. Do not list keys: the June handler used `ip:` and `email:` key names. |
| Queues `contact-staging`, `contact-production`, and both DLQs | Not a durable backup. A depth reading is an inventory, not a restore. | NOT VERIFIED. Do not replay or dump messages. |

No restore has been run. G6 stays NOT VERIFIED until the drill below is recorded. Creating the drill database can be a billable action. This review did not create one.

## Isolated restore drill (owner runs it; do not touch production)

Minimum permission: the owner's existing D1 console session, or a token with D1 Edit limited to creating one new database. Do not use a token that can edit `busaralabs-prod-db`. Do not run `wrangler d1 time-travel restore` against `busaralabs-prod-db` or against `busaralabs-staging-db`. Time Travel restore mutates the named database.

1. Read-only age check. `npx wrangler d1 time-travel info busaralabs-staging-db`. Expected: the id is `0bf0fbac-152e-4427-9f1a-47e4873d23db`. Stop if the id is `27a86a12-f597-4a23-9835-ee4f3e889185`. Record the bookmark timestamp and how old it is. Safe evidence: database name, id, and bookmark time. No SQL rows.
2. Export the staging database to a file outside the repo: `npx wrangler d1 export busaralabs-staging-db --remote --output /tmp/busara-staging-export.sql`. Do not commit the file.
3. Create an isolated destination named `busaralabs-restore-drill`. Confirm its id is neither production nor staging.
4. Import the export into `busaralabs-restore-drill` only.
5. Integrity: `SELECT COUNT(*)` per table on the drill database. Do not `SELECT` message, email, or name columns. Compare counts to a count-only query on staging if the owner accepts that read. Expected: counts match, and a synthetic row inserted only in the drill database is not required to exist on staging.
6. Record resource, backup used, backup age, destination id, checks, outcome, and elapsed time in the release notes. Then drop `busaralabs-restore-drill`.
7. KV and queues: in the dashboard, record whether a backup product is enabled. Expected today: none. A key list or a message dump is not the evidence to bring back. Missing control: there is no restorable KV or queue snapshot until the owner creates one that does not store the export on the site.

Until that record exists, G6 stays NOT VERIFIED and the release stays NO-GO.

The candidate cron will not delete rows unless `ENVIRONMENT` is `production` and the three plain vars match the production ids. That reduces the chance of a staging Worker emptying a database. It is not a backup.
