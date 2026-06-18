/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   journey-data.js — The Institutional Development Journey
   ------------------------------------------------------------
   The single source of truth for the Paamoja journey component.
   The component logic in main.js renders ENTIRELY from this data.
   To update progress, evidence, or status, edit ONLY this file —
   never the component logic.

   Each stage supports:
     id          two-digit string, used as the node label
     title       stage name
     role        one-line descriptor (the spine label)
     status      'complete' | 'active' | 'upcoming'
     progress    0–100 (rendered subtly; optional)
     purpose     why this stage exists
     questions[] what we are trying to understand
     methods[]   how understanding is developed
     participants[] who contributed (or will)
     evidence[]  what this stage produced
     decisions   how the evidence influenced design decisions
     lessons     what changed — assumptions confirmed or rejected
     outputs     what became possible after this stage
     date        optional soft phase label

   Voice rule: the company and its research are stated plainly;
   the product stays future-oriented. No fabricated counts, no
   pilot targets, no dates that do not yet exist.
   Version: 1.1 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_JOURNEY = [
  {
    id: '01',
    title: 'Issue Identification',
    role: 'The observed problem',
    status: 'complete',
    progress: 100,
    purpose: 'Establish that a real, important problem exists — observed in the world, not assumed from a technology in search of a use.',
    questions: [
      'What problem are people actually experiencing?',
      'Who experiences it, and how often?',
      'Why have existing solutions failed to resolve it?',
      'Is this a problem worth an institution\u2019s long-term commitment?'
    ],
    methods: [
      'Field observation in Nairobi markets',
      'Ecosystem mapping',
      'Review of existing platforms and their gaps',
      'Informal conversations with merchants and couriers'
    ],
    participants: [
      'Nairobi merchants and shopkeepers',
      'Bodaboda couriers',
      'Everyday buyers',
      'Busara Labs founding team'
    ],
    evidence: [
      'A written problem statement',
      'An ecosystem map of fragmented commerce, logistics and payment',
      'A catalogue of observed points where trust breaks down'
    ],
    decisions: 'The observed fragmentation \u2014 commerce, logistics and payment happening in disconnected, low-trust ways \u2014 became the problem Busara Labs committed to. Technology was deliberately left undecided at this stage.',
    lessons: 'Confirmed: the problem is structural, not the absence of any single app. Rejected: the assumption that merchants simply needed \u201Canother marketplace.\u201D',
    outputs: 'A clearly stated, evidence-grounded problem \u2014 the mandate for everything that follows.',
    date: 'Phase one'
  },
  {
    id: '02',
    title: 'Discovery & Listening',
    role: 'Understanding people',
    status: 'complete',
    progress: 100,
    purpose: 'Understand the people and institutions living inside the problem before proposing anything to solve it.',
    questions: [
      'How do merchants, couriers and buyers actually work today?',
      'Where, specifically, does trust break down between them?',
      'What do they already rely on, and why does it work?',
      'What would they need in order to participate in a digital economy?'
    ],
    methods: [
      'Stakeholder interviews',
      'Community workshops',
      'Field observations',
      'Expert consultations',
      'Structured interviews'
    ],
    participants: [
      'Merchants across formal and informal markets',
      'Courier networks',
      'Buyers',
      'Payment and regulatory experts',
      'Community organisers'
    ],
    evidence: [
      'Interview summaries',
      'Community insights',
      'Research notes',
      'A map of where trust fails along a transaction'
    ],
    decisions: 'Listening reframed the problem from \u201Caccess to a marketplace\u201D to \u201Ctrust between strangers transacting at a distance.\u201D That shift moved payment escrow and identity to the centre of all later design.',
    lessons: 'Confirmed: existing mobile-money rails are already trusted and widely used. Rejected: the assumption that a new wallet was needed. Changed: a guarantee of payment, not product discovery, emerged as the deciding need.',
    outputs: 'A grounded understanding of how Nairobi\u2019s economy actually works \u2014 and exactly where trust fails.',
    date: 'Phase one'
  },
  {
    id: '03',
    title: 'Validation',
    role: 'Testing the need',
    status: 'active',
    progress: 45,
    purpose: 'Test whether the understanding holds \u2014 validate the need and the proposed direction against evidence before committing to design.',
    questions: [
      'Is the trust problem the one worth solving first?',
      'Would merchants, couriers and buyers adopt a platform built around guaranteed payment?',
      'Which of our assumptions are we still carrying untested?'
    ],
    methods: [
      'Validation workshops',
      'Structured interviews',
      'Qualitative coding',
      'Pattern identification',
      'Concept testing'
    ],
    participants: [
      'Returning merchants and couriers from discovery',
      'New buyers',
      'Domain advisors'
    ],
    evidence: [
      'Validation workshop notes',
      'Coded interview patterns',
      'A refined problem statement'
    ],
    decisions: 'Validation findings are actively shaping which capabilities enter the first institutional design \u2014 and which are deferred until the evidence is stronger.',
    lessons: 'In progress. Assumptions are being confirmed or set aside as evidence is collected; this record will be updated as the stage closes.',
    outputs: 'A validated direction \u2014 or the discipline to revise it \u2014 before any institution is designed.',
    date: 'Current stage'
  },
  {
    id: '04',
    title: 'Institutional Design',
    role: 'Designing the institution',
    status: 'upcoming',
    progress: 0,
    purpose: 'Design the institution \u2014 its purpose, its membership, and the relationships between the people it serves \u2014 before designing any system.',
    questions: [
      'What kind of institution does this problem require?',
      'Who are its members, and what do they owe one another?',
      'How does it stay accountable over decades, not quarters?'
    ],
    methods: [
      'Institutional modelling',
      'Cooperative-structure design',
      'Stakeholder review'
    ],
    participants: [
      'To include members, advisors and Busara Labs governance'
    ],
    evidence: [],
    decisions: 'Pending. Design decisions here will be informed directly by the evidence produced in validation.',
    lessons: 'Not yet reached.',
    outputs: 'The institution Paamoja will be \u2014 defined before the platform is built.',
    date: 'Ahead'
  },
  {
    id: '05',
    title: 'Governance Design',
    role: 'How decisions are made',
    status: 'upcoming',
    progress: 0,
    purpose: 'Define how the institution governs itself \u2014 how major decisions are made, documented, and held accountable to its members.',
    questions: [
      'How are major decisions made and recorded?',
      'How do members hold the institution accountable?',
      'What is constitutionally fixed, and what is allowed to evolve?'
    ],
    methods: [
      'Constitutional drafting',
      'Governance modelling',
      'Legal and regulatory review'
    ],
    participants: [
      'To include legal counsel, advisors and Busara Labs governance'
    ],
    evidence: [],
    decisions: 'Pending.',
    lessons: 'Not yet reached.',
    outputs: 'A governance constitution the platform will operate under.',
    date: 'Ahead'
  },
  {
    id: '06',
    title: 'System Architecture',
    role: 'Where technology begins',
    status: 'upcoming',
    progress: 0,
    purpose: 'Only now does technology enter. Design the systems that implement the validated, governed institution \u2014 not the other way around.',
    questions: [
      'Which infrastructure layers must exist for the institution to function?',
      'How do identity, payment, logistics and data depend on one another?',
      'How is compliance built in from the foundation?'
    ],
    methods: [
      'Infrastructure layer design',
      'Compliance-by-design review',
      'Architecture validation'
    ],
    participants: [
      'Busara Labs engineering and Busara Labs governance'
    ],
    evidence: [],
    decisions: 'Pending. The infrastructure layers shown on Our Work are the architectural vocabulary this stage will draw from.',
    lessons: 'Not yet reached.',
    outputs: 'An architecture that serves the institution \u2014 designed last, on purpose.',
    date: 'Ahead'
  },
  {
    id: '07',
    title: 'Pilot Implementation',
    role: 'First contact with reality',
    status: 'upcoming',
    progress: 0,
    purpose: 'Build and test the first working implementation with real participants, in a bounded setting, before any wider operation.',
    questions: [
      'Does the system behave as designed under real use?',
      'Where does the design meet reality and need revision?'
    ],
    methods: [
      'Bounded pilot',
      'Field monitoring',
      'Participant feedback loops'
    ],
    participants: [
      'A limited group of merchants, couriers and buyers'
    ],
    evidence: [],
    decisions: 'Pending.',
    lessons: 'Not yet reached.',
    outputs: 'Evidence from real use to refine the platform before it operates at scale.',
    date: 'Ahead'
  },
  {
    id: '08',
    title: 'Operational Platform',
    role: 'Trusted operation',
    status: 'upcoming',
    progress: 0,
    purpose: 'Operate the platform as durable infrastructure \u2014 reliable, accountable, and owned in part by the people who use it.',
    questions: [
      'Does the platform hold trust beyond the pilot?',
      'Are members participating in its returns as the institution intended?'
    ],
    methods: [
      'Operational monitoring',
      'Member surplus distribution',
      'Ongoing compliance'
    ],
    participants: [
      'Members \u2014 merchants, couriers and buyers \u2014 and Busara Labs'
    ],
    evidence: [],
    decisions: 'Pending.',
    lessons: 'Not yet reached.',
    outputs: 'Working infrastructure Nairobi\u2019s economy can rely on.',
    date: 'Ahead'
  },
  {
    id: '09',
    title: 'Continuous Improvement',
    role: 'Evidence never stops',
    status: 'upcoming',
    progress: 0,
    purpose: 'Treat the platform as a living institution \u2014 continuously observed, evaluated, and improved on evidence rather than assumption.',
    questions: [
      'What is the platform teaching us now?',
      'Which earlier assumptions need revisiting?',
      'What should expand to the next city?'
    ],
    methods: [
      'Continuous research',
      'Impact evaluation',
      'Quantitative analysis'
    ],
    participants: [
      'Members, the wider community, and Busara Labs'
    ],
    evidence: [],
    decisions: 'Pending.',
    lessons: 'Not yet reached.',
    outputs: 'An institution that matures with the evidence \u2014 from one city toward a continent.',
    date: 'Ongoing'
  }
];
