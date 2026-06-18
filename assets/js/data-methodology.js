/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-methodology.js — "How We Build" (Home)
   ------------------------------------------------------------
   Drives the Home methodology VerticalExplorer. Same component as
   the Our Work and Paamoja explorers; only this data differs.
   Each stage: id, title, role, purpose, methods[], outputs, informs.
   To change the methodology, edit ONLY this file.
   Version: 1.0 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_METHODOLOGY = [
  {
    id: '01',
    title: 'Observe',
    role: 'Reality, before opinion',
    purpose: 'We watch how people, markets and institutions actually behave \u2014 before forming any opinion about what they need. Observation keeps us honest about the problem.',
    methods: [
      'Field observation in markets and on the street',
      'Ecosystem mapping',
      'Review of existing platforms and their gaps'
    ],
    outputs: 'A written account of what is really happening \u2014 not what we assumed was happening.',
    informs: 'Observation surfaces the questions worth asking. It tells us who to listen to, and where to look when we begin discovery.'
  },
  {
    id: '02',
    title: 'Listen',
    role: 'The people inside the problem',
    purpose: 'We talk to the people living inside the problem and let what they tell us reshape the question itself. Listening is how assumptions are exposed and corrected.',
    methods: [
      'Stakeholder interviews',
      'Community workshops',
      'Expert consultations'
    ],
    outputs: 'Interview summaries, community insights, and a clearer, often different, definition of the problem.',
    informs: 'Listening reframes the problem. The sharper problem statement it produces becomes the thing research sets out to test.'
  },
  {
    id: '03',
    title: 'Research',
    role: 'Where trust breaks down',
    purpose: 'We study the evidence, map the ecosystem, and find precisely where trust breaks down between the people who need to transact.',
    methods: [
      'Qualitative coding',
      'Pattern identification',
      'Quantitative analysis'
    ],
    outputs: 'Research notes, system maps, and a small number of clearly stated, testable hypotheses.',
    informs: 'Research gives validation something specific to test. Without it, validation has no claims to confirm or reject.'
  },
  {
    id: '04',
    title: 'Validate',
    role: 'Test before you commit',
    purpose: 'We test our understanding against reality \u2014 and accept the discipline of revising it \u2014 before committing to any direction. A need that cannot be validated is not yet a need.',
    methods: [
      'Validation workshops',
      'Structured interviews',
      'Concept testing'
    ],
    outputs: 'A validated direction, or the evidence to reject one, with assumptions confirmed or set aside.',
    informs: 'Validation decides what is real enough to design around. Only validated needs are allowed into institutional design.'
  },
  {
    id: '05',
    title: 'Design the Institution',
    role: 'The institution before the system',
    purpose: 'We design the institution \u2014 its purpose, its members, and how it governs itself \u2014 before any system is built. Software inherits the institution, not the other way around.',
    methods: [
      'Institutional modelling',
      'Governance and constitutional design',
      'Cooperative-structure design'
    ],
    outputs: 'A defined institution: its members, their relationships, and the governance it will operate under.',
    informs: 'A designed institution tells the build exactly what to serve. Architecture becomes an act of implementation, not invention.'
  },
  {
    id: '06',
    title: 'Build What Can Be Trusted',
    role: 'Technology comes last',
    purpose: 'Only now do we build. Technology is the final stage of a much larger process \u2014 never the first. What we ship can be trusted because every decision beneath it was earned.',
    methods: [
      'Infrastructure layer design',
      'Compliance-by-design engineering',
      'Pilot implementation and learning'
    ],
    outputs: 'Working infrastructure whose every design decision can be traced back to evidence.',
    informs: 'And the work does not end. What the build teaches us returns to observation \u2014 the method begins again, on evidence.'
  }
];
