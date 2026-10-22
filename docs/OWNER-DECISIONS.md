# Owner decisions still open

These are decisions this branch does not make. Everything else in `CONTENT-CHANGELOG.md` was taken from the approved prototype or from CONTENT-REVIEW §7.

1. **Integration branch.** There is no `dev` branch. `main` and `staging` both point at `a2bdcba4aafa91a0c237d8e7c3c68f180d21fe26`. This pull request targets `staging`. Creating a `dev` branch, and protecting `main` and `staging`, is an owner action.

2. **Staging access.** The owner stated on 2026-10-19 that staging is isolated. A header check on 2026-10-22 found `https://staging.busaralabs.com/` publicly reachable, with no `X-Robots-Tag` and with `OPTIONS /api/contact` returning 204. This branch adds noindex for non-production hosts and a default-off collection switch, but it does not enable Cloudflare Access. Access is an account change and was not authorised here. See `docs/environment.md`.

3. **Live bindings and secrets.** `wrangler.toml` names separate preview and production D1, KV, and queue ids. The live CORS origins differ (`staging.busaralabs.com` versus `busaralabs.com`). That does not prove the preview deployment uses the staging database or separate secrets. No Cloudflare token was available. Confirm the preview bindings and secrets in the Cloudflare dashboard before any deploy.

4. **Digital Commerce status.** Institutional Infrastructure was moved to Planned because its journey stages are Ahead. Digital Commerce is still "Active development", which is the prototype's label. Confirm or change it.

5. **The four proposed elements.** They stay on sheet P-03, labelled as a proposal that the journal does not record. Remove them until an entry exists, or keep the limit. This branch kept the limit.

6. **Where the inquiry happened.** Organisation lines still say Nairobi, Kenya. Sentences that placed the informal-economy inquiry in Nairobi, or called it large and active, were removed because Entries 01–02 do not say that. Supply an approved place sentence if one should be published.

7. **Doctrine L6 drawing tag.** The heading is the approved "Initiatives we are developing." The drawing tag is "What we are developing." so the layer name is not repeated. Restore the long tag if the repetition is preferred.

8. **Process models.** The Doctrine's seven-stage loop, the Home six-stage method, and the Paamoja nine-stage journey are all still published. The Doctrine still says technology is the second-to-last stage of its loop, while Home says technology comes last. No approved replacement was in the handoff.

9. **Wordmark.** The header mark still uses a live "B" in DM Serif Display, as the prototype did. Outlined master SVGs were requested and were not in the handoff.

10. **Production release.** Not authorised. Requires the prerequisites in the pull request: ODPC position, approved notices, tested endpoints, least-privilege secrets, backups and rollback, monitoring and an incident owner, a final check of the staged site, and a separate explicit instruction to deploy production. Collection remains off until that instruction sets the switches in `docs/environment.md`.
