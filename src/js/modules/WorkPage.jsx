/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Our Work page
   Version: 1.1 | June 2026
   Classification: Public
   ============================================================ */

function WorkPage() {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, EmailCTA } = D;

  const CAPABILITIES = [
    { n: '01', t: 'Commerce Infrastructure', b: 'Designing and building multi-sided platforms that connect merchants, couriers, and buyers under a unified identity model. Marketplace architecture. Governance-first platform design for informal and semi-formal markets.' },
    { n: '02', t: 'Logistics Rail Engineering', b: 'Building the systems that move goods reliably and accountably — from order placement to confirmed delivery. Custody chain design. Courier network architecture. Physical and digital handoff verification.' },
    { n: '03', t: 'Payment Escrow Systems', b: 'Deterministic payment infrastructure that creates trust between strangers. Payment held until delivery confirmed. Settlement systems built for the Kenyan regulatory environment, including M-Pesa integration via the Daraja API.' },
    { n: '04', t: 'Data Architecture & Compliance', b: "Systems built for Kenya's data protection framework from the ground up. ODPC compliance by design. Data residency architecture that keeps personal data within Kenya. Privacy-first, minimisation-first engineering." },
    { n: '05', t: 'Identity Systems', b: 'Permanent, portable identity infrastructure for platform participants. Progressive verification that unlocks platform capabilities. Multi-role identity — one person, multiple platform roles, one record.' },
    { n: '06', t: 'AI & Automation Infrastructure', b: 'Governance frameworks for autonomous systems. Cryptographic audit trails. Constitutional constraints on automated decision-making. Built for accountability, not convenience.' },
  ];

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };
  const prose = { fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.8)', maxWidth: '60ch' };

  return (
    <div>
      {/* ---- PAGE HERO ---- */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)' }}>
        <div style={wrap}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '24px' }}>Our Work</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--color-warm-white)', maxWidth: '20ch' }}>
            What Busara Labs knows how to build.
          </h1>
          <p style={{ marginTop: '24px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.8)', maxWidth: '56ch' }}>
            Infrastructure capabilities — not services for hire. Demonstrated through Paamoja, and built to underpin the continent's digital economy.
          </p>
        </div>
      </section>

      {/* ---- THE PROBLEM ---- */}
      <section style={{ background: 'var(--color-deep-navy)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={wrap}>
          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '48px' }}>
            <SectionHeader label="The Problem" headline="Infrastructure that was never built." onDark />
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '70ch' }}>
              <p style={prose}>
                Formal economies run on invisible systems — payment rails, identity networks, logistics infrastructure, trust mechanisms. These systems were built decades ago for a specific kind of participant: banked, registered, and smartphone-enabled.
              </p>
              <p style={prose}>
                The informal economy has never had an equivalent. Not because building it is impossible. Because no institution has prioritised doing it properly — with constitutional governance, regulatory discipline, and the long-term commitment that real infrastructure requires. Imported solutions, however well-intentioned, are optimised for markets they were designed for. They arrive with assumptions baked in that do not survive contact with how commerce actually works here.
              </p>
              <p style={prose}>
                The result is a persistent infrastructure gap that keeps millions of capable, active economic participants operating below their potential. Not because they lack ambition or capability — because the systems that would amplify both have never been built for them.
              </p>
              <p style={prose}>
                Closing that gap requires more than technology. It requires institutional innovation — new governance models, new ownership structures, new standards of accountability. It requires the conviction that everyone deserves an equal shot at the tools that make economic participation reliable, trustworthy, and rewarding.
              </p>
              <p style={{ ...prose, color: 'var(--color-warm-white)', fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 0.85rem + 0.8vw, 1.2rem)', lineHeight: 1.4 }}>
                Busara Labs exists to build that infrastructure. Paamoja is the first expression of that vision: a unified economic operating network designed to make participation in commerce more accessible, trustworthy, and rewarding for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CAPABILITIES ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '0', borderTop: '1px solid var(--border-subtle)' }}>
            {CAPABILITIES.map(c => (
              <article key={c.n} style={{
                padding: '40px 40px 40px 0', borderBottom: '1px solid var(--border-subtle)',
              }} className="bl-cap">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '18px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.15em', color: 'var(--text-accent)' }}>{c.n}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '26px', lineHeight: 1.1, color: 'var(--text-on-light)' }}>{c.t}</h3>
                </div>
                <p style={{ fontSize: '15.5px', lineHeight: 1.65, color: 'var(--text-on-light-muted)', maxWidth: '46ch' }}>{c.b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- EMAIL CTA ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={wrap}>
          <div style={{ padding: '48px', background: 'var(--color-navy-06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <EmailCTA label="Technical depth is available on request. Partnerships, investment, and infrastructure inquiries:" />
          </div>
        </div>
      </section>
    </div>
  );
}

window.WorkPage = WorkPage;
