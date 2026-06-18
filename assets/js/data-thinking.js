/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-thinking.js — "How We Think" (About) — the cyclical model
   ------------------------------------------------------------
   Drives the About orbital thinking model. Six stages that orbit
   the institution and cycle continuously: Observe → Understand →
   Validate → Design → Build → Learn → (back to Observe).
   Each: id, title, role, purpose, activities[], outputs, leadsTo.
   The final stage (Learn) closes the loop back to Observe.
   Edit ONLY this file to change the model.
   Version: 1.0 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_THINKING = [
  {
    id: '01',
    title: 'Observe',
    role: 'See reality',
    purpose: 'See reality as it is, before forming any opinion about it. Observation keeps the institution honest about the problem it is actually facing.',
    activities: ['Field observation', 'Ecosystem mapping', 'Reviewing what already exists'],
    outputs: 'An honest account of what is happening \u2014 not what we assumed was happening.',
    leadsTo: 'Observation surfaces the people and the questions worth understanding \u2014 which is exactly where understanding begins.'
  },
  {
    id: '02',
    title: 'Understand',
    role: 'Know the people',
    purpose: 'Understand the people and institutions living inside the problem \u2014 their realities, not our assumptions about them.',
    activities: ['Stakeholder interviews', 'Community workshops', 'Expert consultation'],
    outputs: 'A grounded, often revised, definition of the problem.',
    leadsTo: 'A sharper problem is finally something we can test. Understanding hands validation a specific claim to examine.'
  },
  {
    id: '03',
    title: 'Validate',
    role: 'Test the need',
    purpose: 'Test our understanding against evidence \u2014 and accept the discipline of revising it \u2014 before committing to a direction.',
    activities: ['Validation workshops', 'Structured interviews', 'Concept testing'],
    outputs: 'A validated need, or the discipline to set a rejected one aside.',
    leadsTo: 'What survives validation is real enough to design around \u2014 and only that is allowed into design.'
  },
  {
    id: '04',
    title: 'Design',
    role: 'Shape the institution',
    purpose: 'Design the institution \u2014 its purpose, its members, and how it governs itself \u2014 before designing any system.',
    activities: ['Institutional modelling', 'Governance design', 'Cooperative-structure design'],
    outputs: 'A defined institution: its members, their relationships, and its governance.',
    leadsTo: 'A designed institution tells the build exactly what to serve \u2014 making the build an act of implementation, not invention.'
  },
  {
    id: '05',
    title: 'Build',
    role: 'Earn trust',
    purpose: 'Build what can be trusted. Technology is the final stage of the process, never the first \u2014 and it answers to the institution.',
    activities: ['Infrastructure design', 'Compliance-by-design engineering', 'Pilot implementation'],
    outputs: 'Working infrastructure whose every decision can be traced back to evidence.',
    leadsTo: 'Anything we build immediately begins teaching us \u2014 which is why building leads to learning, not to a finish line.'
  },
  {
    id: '06',
    title: 'Learn',
    role: 'Begin again',
    purpose: 'Treat every solution as a source of new understanding. What we build in the world always teaches us something we could not have known before.',
    activities: ['Impact evaluation', 'Continuous research', 'Pattern analysis'],
    outputs: 'New evidence, revised assumptions, and fresh questions.',
    leadsTo: 'And learning returns us to observation. What we now see differently begins the cycle again \u2014 the methodology never truly ends; it continuously evolves.'
  }
];
