/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-doctrine-chain.js — "Layer 3 — Design Philosophy" (Doctrine)
   ------------------------------------------------------------
   Drives the Doctrine page's orbit (same reusable Orbit() as
   About's "How We Think"). Renders the People \u2192 Potential \u2192
   Structure \u2192 Trust \u2192 Progress chain as a continuous loop,
   reflecting that it also functions as a diagnostic in reverse.
   Each stage: id, title, role, purpose, activities[], outputs,
   leadsTo.
   Version: 1.0 | June 2026 \u00B7 Classification: Public \u00B7 Nairobi
   ============================================================ */
window.BUSARA_DOCTRINE_CHAIN = [
  {
    id: '01',
    title: 'People',
    role: 'Where every chain begins',
    purpose: 'A person\u2019s honest effort deserves a fair opportunity to succeed, regardless of circumstances they did not choose. Every initiative begins with a real person constrained by something they did not choose \u2014 geography, access, or which systems already serve them.',
    activities: [
      'Identify who is actually constrained, and by what',
      'Distinguish a real constraint from a convenient assumption'
    ],
    outputs: 'A specific person, or group of people, whose potential is not being realized.',
    leadsTo: 'Naming the constraint clearly is what makes the unrealized Potential visible.'
  },
  {
    id: '02',
    title: 'Potential',
    role: 'What is unrealized',
    purpose: 'A shop owner open every hour still only serves whoever happens to pass by \u2014 not a failure of effort, but a limit imposed by the system she depends on. Potential is what exists but cannot yet be exercised.',
    activities: [
      'Observe what a person could do if the constraint were removed',
      'Resist solving for convenience instead of the real limit'
    ],
    outputs: 'A clear statement of what becomes possible if the constraint is removed.',
    leadsTo: 'Realized potential requires Structure \u2014 a deliberate system, not a hope.'
  },
  {
    id: '03',
    title: 'Structure',
    role: 'What Busara Labs provides',
    purpose: 'Rules, infrastructure, a defined way of transacting or participating. Structure alone is not enough \u2014 a system can be extremely well-organized and still illegitimate.',
    activities: [
      'Design the rules and governance deliberately, not by default',
      'Build enforceable recourse into the structure itself, not as a policy promise'
    ],
    outputs: 'A working structure that satisfies the legitimacy test: real access, plus enforceable recourse.',
    leadsTo: 'Structure that passes the legitimacy test is what earns Trust. Structure that fails it does not, no matter how well-organized it is.'
  },
  {
    id: '04',
    title: 'Trust',
    role: 'Earned, not claimed',
    purpose: 'Justified confidence, earned over repeated use, that a system will behave as it claims \u2014 and that if it does not, there is a real, structural way back. Not merely an apology.',
    activities: [
      'Demonstrate the structure\u2019s recourse mechanism actually working',
      'Earn confidence through repeated, consistent behaviour, not a single good outcome'
    ],
    outputs: 'People relying on the system without having to verify it every time.',
    leadsTo: 'Genuinely earned trust is what converts Potential into actual Progress.'
  },
  {
    id: '05',
    title: 'Progress',
    role: 'Expanded capability, exercised',
    purpose: 'Expanded capability exercised through a legitimate system \u2014 not a transaction count, not revenue, not the number of people registered. A person can now do something real they could not reliably do before.',
    activities: [
      'Measure what people can now do, not only what the system processed',
      'Check whether the legitimacy test still holds as the system is used at scale'
    ],
    outputs: 'Durable, repeatable access to something that was previously out of reach.',
    leadsTo: 'If Progress is absent, the chain runs in reverse as a diagnostic: investigate Trust, then Structure, then whether Potential was ever realistically addressed \u2014 returning, always, to People.'
  }
];
