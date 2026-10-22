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

## Operator restore drill (non-production only)

1. In the Cloudflare dashboard, open D1 `busaralabs-staging-db` and confirm the id is `0bf0fbac-152e-4427-9f1a-47e4873d23db`. Stop if the id is the production id.
2. Export that database to a file that stays off the site and off git.
3. Insert one synthetic row in a copy, not in production. Restore the export over the copy.
4. Confirm the synthetic row is gone and the exported rows are back.
5. Record the time and the database id. Do not paste the export into the repository.

Until that drill is recorded, backup and rollback stay Not Verified and the release stays NO-GO.

The candidate cron will not delete rows unless `ENVIRONMENT` is `production` and the three plain vars match the production ids. That reduces the chance of a staging Worker emptying a database. It is not a backup.
