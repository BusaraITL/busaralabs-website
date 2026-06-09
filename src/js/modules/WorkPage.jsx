/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Our Work page
   Version: 1.0 | June 2026
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

  return (
    <div>
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
