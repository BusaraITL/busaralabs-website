/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-infrastructure.js — Infrastructure Domains (Our Work)
   ------------------------------------------------------------
   Drives the Our Work VerticalExplorer. These are enduring
   DOMAINS in which Busara Labs works — not products, services,
   or technologies. Initiatives (such as Paamoja) emerge from
   these domains; they do not define them. Technology appears
   only as one implementation layer, never the starting point.
     id            two-digit label
     title         domain name
     role          one-line descriptor (the spine label)
     deps          related domains (drives the connection reveal)
     challenge     what challenge exists
     matters       why this domain matters
     infrastructure what infrastructure enables meaningful progress
     connects      how it connects to neighbouring domains
     initiatives   the kinds of initiatives that emerge from it
     paamoja       optional — Paamoja's current status in this domain
   To change the domains, edit ONLY this file.
   Version: 2.0 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_INFRASTRUCTURE = [
  {
    id: '01',
    title: 'Institutional Infrastructure',
    role: 'How systems are governed',
    deps: [],
    challenge: 'Many systems fail not because the technology is weak, but because the institution beneath them was never designed \u2014 no clear purpose, membership, or accountability.',
    matters: 'Institutions are what endure. A well-designed institution outlasts any application built on top of it, and decides whether people can trust what it produces.',
    infrastructure: 'Constitutions, governance models, membership and ownership structures, and the decision records that keep them accountable. Software is only how these are eventually operated.',
    connects: 'It sits beneath every other domain \u2014 identity, commerce, knowledge and operations all inherit their accountability from the institution that governs them.',
    initiatives: 'Cooperative ownership structures, governance constitutions, and accountable operating bodies.',
    paamoja: 'Paamoja \u00b7 cooperative ownership and governance being designed \u00b7 In active development.'
  },
  {
    id: '02',
    title: 'Digital Commerce Infrastructure',
    role: 'Where value changes hands',
    deps: ['01', '03', '05'],
    challenge: 'Commerce in informal and emerging markets is active but fragmented \u2014 buyers, sellers and couriers transacting through disconnected, low-trust channels.',
    matters: 'A trusted place to transact is the difference between an economy that participates digitally and one locked out of it.',
    infrastructure: 'Marketplace architecture, escrow and settlement models, and the coordination rails between the parties to a transaction. The technology implements rules the institution has already set.',
    connects: 'It depends on identity and trust to know who is transacting, and on operational infrastructure to move goods and confirm delivery.',
    initiatives: 'Multi-sided marketplaces, guaranteed-payment systems, and merchant networks.',
    paamoja: 'Paamoja \u00b7 a multi-sided commerce platform \u00b7 In active development.'
  },
  {
    id: '03',
    title: 'Identity & Trust Infrastructure',
    role: 'Knowing who is who',
    deps: ['01'],
    challenge: 'Without portable, trustworthy identity, people cannot carry their reputation between roles or systems \u2014 and strangers have no basis to trust one another.',
    matters: 'Trust between people who do not know each other is the precondition for almost everything else. Identity is how that trust becomes portable.',
    infrastructure: 'Progressive verification, multi-role identity records, and the consent and data-protection structures around them. Cryptography is a means; the trust model is the point.',
    connects: 'It draws its accountability from institutional infrastructure, and makes commerce and operations possible above it.',
    initiatives: 'Portable identity systems, progressive verification, and reputation that moves with the person.',
    paamoja: 'Paamoja \u00b7 one identity across courier, buyer and merchant roles \u00b7 In active development.'
  },
  {
    id: '04',
    title: 'Knowledge & Research Systems',
    role: 'How understanding is built',
    deps: ['01'],
    challenge: 'Decisions are too often made on assumption. Without systems to gather, structure and revisit evidence, organisations repeat the same misunderstandings.',
    matters: 'Evidence is what separates infrastructure that earns trust from infrastructure that merely claims it. Knowledge systems make understanding cumulative.',
    infrastructure: 'Research practices, evidence repositories, structured field methods, and the feedback loops that turn observation into design decisions.',
    connects: 'It feeds every other domain \u2014 and informs the intelligence systems that reason over what is collected.',
    initiatives: 'Field research programmes, evidence repositories, and validation frameworks.'
  },
  {
    id: '05',
    title: 'Operational Infrastructure',
    role: 'How things actually run',
    deps: ['01', '03'],
    challenge: 'Promises break at the operational layer \u2014 goods that do not arrive, processes that cannot be audited, work that cannot be coordinated reliably.',
    matters: 'Infrastructure people can rely on is infrastructure that behaves the same way every time. Operations are where trust is kept or lost in practice.',
    infrastructure: 'Logistics and custody-chain design, process and compliance engineering, and monitoring that makes operations accountable. The tooling serves the operational guarantee.',
    connects: 'It depends on identity to know its participants, and delivers on the transactions that commerce infrastructure originates.',
    initiatives: 'Logistics rails, custody-chain systems, and compliance-by-design operations.',
    paamoja: 'Paamoja \u00b7 reliable courier logistics and custody \u00b7 In active development.'
  },
  {
    id: '06',
    title: 'Intelligence Infrastructure',
    role: 'Governed reasoning',
    deps: ['01', '04'],
    challenge: 'Automated decisions increasingly shape people\u2019s lives \u2014 often without accountability, audit, or constraint.',
    matters: 'If systems are going to reason and decide at scale, they must do so under the same standards as the institutions they serve.',
    infrastructure: 'Audit trails, constitutional constraints on automated decisions, and oversight frameworks. The models are an implementation detail; the governance around them is the infrastructure.',
    connects: 'It reasons over what knowledge systems collect, and holds the decisions made across every other domain to account.',
    initiatives: 'Governed automation, cryptographic audit systems, and oversight frameworks.'
  }
];
