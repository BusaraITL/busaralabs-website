/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   data-journal.js — The Busara Labs Research Journal
   ------------------------------------------------------------
   A public record of institutional learning — how observing a
   problem becomes evidence, and how evidence becomes trustworthy
   infrastructure. NOT company news. NOT a marketing blog.

   The Journal grows alongside the Paamoja initiative; each new
   entry corresponds to a milestone in the methodology. Add an
   entry by appending an object here — the page renders from data.
     id           two-digit label
     stage        the methodology stage this entry records
     status       'Completed' | 'In progress' | 'Upcoming'
     theme        one line — what this entry is about
     date         soft phase label
     body[]       paragraphs, written as institutional record
     observations[] (optional) the recurring patterns recorded
     observationsLabel (optional) heading for that list
     outcome      what this stage established
   Version: 1.0 | June 2026 · Classification: Public · Nairobi
   ============================================================ */
window.BUSARA_JOURNAL = [
  {
    id: '01',
    stage: 'Issue Identification',
    status: 'Completed',
    theme: 'Recognising a recurring problem before proposing a solution.',
    date: 'Phase one',
    body: [
      'Busara Labs\u2019 research record begins not with a hypothesis but with observation. Its earliest material is the lived experience of the founder participating directly in the informal business economy \u2014 a vantage point from which certain frictions appeared again and again.',
      'The same difficulties recurred regardless of the goods or the people involved: stock that was hard to source consistently, uncertainty about whether a delivery would arrive as agreed, and payment that carried risk for whichever side moved first. Beneath them sat a single pattern \u2014 trade depended on personal relationships and word-of-mouth assurance to stand in for any reliable guarantee.',
      'What stood out was the contrast. Communication had gone almost entirely digital; trust had not. Despite constant messaging, the assurances that actually allowed a transaction to proceed remained analogue \u2014 a known face, a prior dealing, a shared contact.',
      'Recorded here, these are not conclusions. They are the observations that made a problem worth investigating visible. The purpose of this first entry is to mark where the inquiry began: with sustained attention to a reality, rather than with a solution in search of one.'
    ],
    observationsLabel: 'Patterns observed',
    observations: [
      'Inconsistent stock sourcing',
      'Trust gaps between buyers and suppliers',
      'Uncertainty around deliveries',
      'Payment friction for whoever moves first',
      'Reliance on personal relationships and word-of-mouth'
    ],
    outcome: 'An individual but repeated observation \u2014 the starting point of an institutional inquiry, not yet a conclusion.'
  },
  {
    id: '02',
    stage: 'Discovery & Listening',
    status: 'Completed',
    theme: 'Testing whether the observed problem was individual or collective.',
    date: 'Phase one',
    body: [
      'A personal observation is not yet evidence. The second stage set out to test whether the pattern noticed by one participant held more widely \u2014 and, deliberately, to look for the reasons it might not.',
      'In practice this meant speaking with traders, business owners and other participants across different parts of town, with the explicit aim of challenging the initial belief rather than confirming it. The question was not \u201Cdo others agree?\u201D but \u201Cwhere does this break down?\u201D',
      'It largely did not break down. The same themes returned across conversations: the same trust issues, the same payment challenges, the same dependence on personal recommendation, and the same hesitation to transact digitally with anyone outside an existing relationship.',
      'That recurrence is what mattered. It moved the work from anecdote to evidence \u2014 from one person\u2019s experience to a problem a community recognised in common. From this point, Busara Labs was no longer responding to an impression but to a validated, shared reality.'
    ],
    observationsLabel: 'What recurred',
    observations: [
      'Recurring trust issues across traders',
      'Consistent payment challenges',
      'Shared reliance on personal recommendation',
      'Common hesitation to transact digitally without a prior relationship'
    ],
    outcome: 'An individual observation, validated as a collective problem \u2014 the basis for everything that follows.'
  }
];
