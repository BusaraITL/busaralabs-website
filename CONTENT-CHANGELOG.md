# Content change log

Source of the visual system: the founder-approved Concept A prototype in the handoff (`site/prototype.html` after the edits below). Wording that was not in the prototype or in CONTENT-REVIEW §7 was not invented. Each row is an issue, the resolution, the source, and the reason.

| Issue | Resolution | Source | Reason |
|---|---|---|---|
| Doctrine drawing and layer heading said "What we have actually built." | Both now say "Initiatives we are developing." The layer name stays "Initiatives". | CONTENT-REVIEW §7.1 items 1–2 | Founder-approved. Avoids reading Paamoja or Foundry as built. |
| Drawing tag then read "Initiatives / Initiatives we are developing." | Drawing tag is "What we are developing." The layer heading below the drawing stays "Initiatives we are developing." | VISUAL-REVIEW §9.5 | The approved sentence repeated the layer name. The shorter tag keeps the meaning and matches the length of the other layer tags. |
| Hero "At a glance" said Paamoja was in validation. | "Paamoja — in development · Formal validation pending" | §7.1 item 3 | Founder-approved status. |
| Home initiatives panel said "What it builds" and "in the validation stage in Nairobi". | Heading "What it is developing". Body: in development, formal validation pending, nothing for sale, no service currently operating. The place name was removed from this sentence. | §7.4 item 3 and §7.5 | "Builds" reads as delivery. The journal entries do not name Nairobi. |
| Doctrine L1 said "Busara Labs builds infrastructure — Paamoja, and whatever follows it." | "Busara Labs is developing infrastructure — beginning with Paamoja, and whatever follows it." | §7.4 item 1 | Present-tense "builds" beside Paamoja reads as a completed product. |
| Paamoja lead said Busara Labs "turns an observed problem in Nairobi’s economy into trustworthy infrastructure". | "is working to turn an observed problem into trustworthy infrastructure", plus the approved pending-validation and not-operating sentences. | §7.4 item 2 and §7.5 | The original reads as a conversion already happening, and the entries do not support the Nairobi claim. |
| Paamoja problem said "Nairobi’s informal economy is large and active" and that commerce, logistics, and payments happen. | Replaced with the limits the entries actually record: fragmented trade, personal assurance, inconsistent stock, uncertain delivery, payment risk for whoever moves first. | §7.5 and `data-journal.js` Entry 01 | No sizing evidence. Do not present payments or logistics as a live Paamoja service. |
| Our Work Paamoja row placed the initiative "in the validation stage in Nairobi". | "in development; formal validation is pending. No service is currently operating." | §7.1 item 5 and §7.5 | Founder-approved status, without the unsupported place claim. |
| Institutional Infrastructure was "Active development" while journey stages 04 and 05 are Ahead. | Domain status is Planned. The text names stages 04 and 05 as ahead and not started, and says neither is complete. The journey on the Paamoja page is unchanged: 01 and 02 Recorded, 03 Pending, 04–09 Ahead. | §7.4 item 4 | Project status and stage indicators are different. No stage is marked complete without an entry. |
| Identity & Trust said it was "Studied as part of the Paamoja inquiry." | "No separate initiative. The Research Journal entries do not record an identity study." Status stays Exploratory research. | §7.4 item 5 and §7.5 | Entries 01–02 record trust gaps, not an identity study. |
| Four elements (HuruMarket, Duka, Tuma, e-pay), including "Nairobi’s merchants". | Kept as a labelled proposal. Copy states they are not recorded in the journal and are not built, operating, or taking payment. "Nairobi’s merchants" became "merchants". | §7.5 | Removing the drawing would hide the founder-approved "current vision" sheet. The limit stops them reading as progress. |
| Contact route 03 said organisations build or operate infrastructure "alongside us". | "Organisations building or operating infrastructure who want to work with us." | §7.4 item 6 | The old line can be read as Busara Labs operating infrastructure. |
| Journal entries used a green "Completed" badge beside "Phase one". | Badge text is "Entry recorded", in navy rather than the Released green. A line above the entries says the marker describes the entry only. `data-journal.js` status is `Recorded`, and the page is rendered from that file. | §7.4 item 7 | The green badge matched Released and could be read as the phase being complete. |
| Entry 02 said the observation was "validated" as a collective problem. | "identified as a shared problem through early conversations; formal validation is pending" | §1d, §7.1, and the prototype’s later Entry 02 text | The data file had drifted behind the approved prototype. Published copy is not evidence of validation. |
| Paamoja status block | Kept exactly: Status In development; Milestone 03 Formal validation pending; Operational status No service is currently operating; Progress record Research Journal, linked to the entries. | §7.1 item 8 | Founder-approved. |
| Journey stage 03 tag "Current" and the old key | Tag Pending. Key: solid recorded, hatched next milestone formal validation pending, dashed ahead. | §7.1 items 9–10 | Do not mark validation as the current completed stage. |
| Handover band | Kept "in development · formal validation pending". Sheet ranges A-01 to A-08 and P-01 to P-03 stay visible. | §7.1 item 6 and §7.3 | Founder-approved. |
| Sheet numbers A-01–A-11 and P-01–P-03 | Not renumbered. See the numbering note below. | §7.3 | The founder kept the two families. |
| Privacy, cookie, and disclaimer pages | Rewritten to match disabled collection, no analytics script in this release, SendGrid named only as dormant code, Postmark named as an unused comment, no retention period, no ODPC clearance. | SECURITY-PRIVACY.md and the code | The previous privacy page said the site had no forms while `POST /api/contact` stored submissions. |
| Terms | Substance kept. The initiatives paragraph no longer reads as an operating service. | Existing terms | Legal pages had to keep working. |
| Footer line "Operating under the Kenya Data Protection Act" | Removed. Footer says the company is registered in Kenya and that the website does not collect form data. | Prototype and SECURITY-PRIVACY.md | That line was read as a compliance claim. |
| Waitlist and paamoja.com link | Not carried forward. | Prototype §3 exclusions | Do not invite collection or present a product site. |

## Sheet numbering

Established from CONTENT-REVIEW §7.3, not invented:

- Family A is the institution: A-01 through A-11, in that order, each once.
- Family P is Paamoja: P-01, P-02, P-03, in that order.
- "A-01 of A-11" means sheet 1 of the 11-sheet A family. It is not a position in a combined A+P sequence.
- Reading order in the prototype is A-01..A-08, the handover, P-01..P-03, then A-09 Journal, A-10 Careers, A-11 Contact. On the multi-page site that is the same order as the primary navigation.
- The handover cites A-01 to A-08 because those are the institution sheets before the Paamoja sheets. Journal, Careers, and Contact remain A-09..A-11.
- Revisions are Rev. A and Rev. B. They are not numbered P-01 and P-02.
- The footer index is "A-01 to A-11 · P-01 to P-03".

## Multi-page decision

The prototype is one scrolling document with `data-page` markers. CHANGE-PLAN Phase 1 splits those markers into the existing URLs, and the legal pages have to keep working at their own addresses. The site is therefore multi-page. Primary navigation uses those URLs and `aria-current="page"`. `scrollspy.js` is still loaded; it only marks `href="#…"` links, which the primary navigation no longer uses. The handover band is on the Paamoja page, once, because the prototype introduces the Paamoja sheets with it.

## Left unchanged on purpose

- Hero lead "We build the digital institutions…" — §7.4 item 8 called this a mission statement and acceptable.
- Our Work title "What exists, what is being built, and what is still a question." — existing register title. It is not a claim that Paamoja is built.
- Organisation lines "Nairobi, Kenya" — the company’s place, not a claim about where the journal inquiry was conducted.
- Digital Commerce Infrastructure remains "Active development" because that is the prototype’s label for the Paamoja domain. Whether it should move to Planned, as Institutional Infrastructure did, is an owner decision.
- The three published process models, and the Doctrine line that technology is the second-to-last stage, were not given an approved replacement.
