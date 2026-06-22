/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-doctrine-methodology.js — "Layer 4 — Methodology" (Doctrine)
   ------------------------------------------------------------
   Drives the Doctrine page's Methodology VerticalExplorer. Same
   component as Home, Our Work, Paamoja and About. This is the
   full seven-stage loop as ratified in The Busara Doctrine v1.0,
   including Purpose Alignment, which precedes Observe.
   Each stage: id, title, role, purpose, methods[], outputs, informs.
   To change this content, edit ONLY this file — and only after a
   change to the ratified Doctrine itself.
   Version: 1.0 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_DOCTRINE_METHODOLOGY = [
  {
    id: '01',
    title: 'Purpose Alignment',
    role: 'Before anything else',
    purpose: 'Before observing anything, we ask directly: would solving this problem expand real access for people currently constrained by circumstance, and can recourse be built into it structurally? If the honest answer is no, the loop does not begin.',
    methods: [
      'Check the proposal against the Doctrine\u2019s legitimacy test',
      'Check the proposal against the Ethical Commitments',
      'Confirm a platform is the proportionate response, not the default one'
    ],
    outputs: 'A decision: begin the loop, or stop here \u2014 and a written reason either way.',
    informs: 'This stage exists specifically to prevent mission drift \u2014 the slow accumulation of technically interesting work that has quietly stopped serving Purpose.'
  },
  {
    id: '02',
    title: 'Observe',
    role: 'Reality, before opinion',
    purpose: 'Begin with a real, specific problem in the world, not with a technology in search of an application. Observation precedes implementation, always.',
    methods: [
      'Field observation, in context',
      'Ecosystem mapping',
      'Review of what already exists and where it fails'
    ],
    outputs: 'A written account of what is really happening \u2014 not what we assumed was happening.',
    informs: 'Observation surfaces the questions worth asking, and tells us who to listen to next.'
  },
  {
    id: '03',
    title: 'Understand',
    role: 'Deeper than the symptom',
    purpose: 'Go deeper than the visible symptom. Establish why the problem exists, who it affects, and what has already been tried.',
    methods: [
      'Stakeholder interviews',
      'Root-cause analysis',
      'Review of prior attempts and why they fell short'
    ],
    outputs: 'A clearer, often different, definition of the actual problem.',
    informs: 'A sharper problem statement becomes the thing Design has to answer.'
  },
  {
    id: '04',
    title: 'Design',
    role: 'The structure, chosen deliberately',
    purpose: 'Decide what structure \u2014 institutional, technical, or both \u2014 would actually address the understood problem. The rules and governance of a trustworthy system are chosen here, not assumed.',
    methods: [
      'Institutional and governance modelling',
      'Legitimacy-test review of the proposed structure',
      'Recourse mechanism design, before any build begins'
    ],
    outputs: 'A defined structure: who it serves, how it governs itself, and how recourse works if it fails.',
    informs: 'A designed structure tells Build exactly what to implement \u2014 implementation, not invention.'
  },
  {
    id: '05',
    title: 'Build',
    role: 'Only now',
    purpose: 'Only now does implementation begin. Technology is the second-to-last stage of the loop, never the first.',
    methods: [
      'Infrastructure layer design',
      'Compliance-by-design engineering',
      'Pilot implementation'
    ],
    outputs: 'Working infrastructure whose every decision can be traced back to the stages before it.',
    informs: 'What gets built is what Validate will test against the real world.'
  },
  {
    id: '06',
    title: 'Validate',
    role: 'Against real experience',
    purpose: 'Test what was built against the real world, with the real people it is meant to serve, before declaring it finished \u2014 against what people actually experience, not only what is easiest to measure.',
    methods: [
      'Structured validation with real users',
      'Evidence review against the legitimacy test',
      'Honest assessment of what the evidence actually shows'
    ],
    outputs: 'Confirmation, correction, or a clear case for stopping.',
    informs: 'Validation is where Improve gets its evidence.'
  },
  {
    id: '07',
    title: 'Improve',
    role: 'The loop reopens',
    purpose: 'What is built and used always produces new observations \u2014 about how it is actually used, what it gets wrong, what it makes possible that was not anticipated. This stage does not close the loop. It reopens it.',
    methods: [
      'Usage and outcome review',
      'Re-running the legitimacy test against real, not assumed, behaviour',
      'Feeding findings directly back into Observe'
    ],
    outputs: 'A new round of observations \u2014 the next pass through the loop.',
    informs: 'Improve feeds directly back into Observe. The loop does not terminate.'
  }
];
