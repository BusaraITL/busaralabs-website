/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Home page
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

function HomePage({ onNav }) {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, PullQuote, ComingSoonBlock, EmailLink, Badge } = D;

  const VALUES = [
    'Innovation & Technical Excellence', 'Impact-Driven', 'Long-Term Thinking',
    'Accessibility', 'User Empowerment & Financial Inclusion', 'Transparency & Trust',
    'Community-First', 'Speed & Execution', 'A Company for the People',
  ];

  return (
    <div>
      {/* ---- HERO ---- */}
      <section style={{ position: 'relative', minHeight: '100vh', background: 'var(--color-deep-navy)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)', width: '100%' }}>
          <div style={{ maxWidth: '20ch' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-hero)', lineHeight: 1.04, color: 'var(--color-warm-white)' }}>
              Infrastructure for Africa's Digital Economy
            </h1>
          </div>
          <p style={{ maxWidth: '52ch', marginTop: '28px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.8)' }}>
            Busara Labs is building the foundational technology infrastructure upon which Africa's digital economy will operate. Starting with Nairobi.
          </p>
          <div style={{ marginTop: '36px' }}>
            <EmailLink address="hello@busaralabs.com" size="16px" />
          </div>
        </div>
      </section>

      {/* ---- MISSION STRIP ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '28px' }}>The Mission</span>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 1rem + 3vw, 3rem)', lineHeight: 1.18, color: 'var(--color-deep-navy)', maxWidth: '20ch' }}>
            Build constitutionally governed infrastructure that enables Africa's informal economy to participate in the digital economy with trust, transparency, and access — starting with Nairobi, expanding to the continent.
          </p>
        </div>
      </section>

      {/* ---- PAAMOJA FEATURE (Charcoal portal — first appearance of Paamoja Gold) ---- */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '56px', alignItems: 'center' }} className="bl-paamoja-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <img src={(window.__resources && window.__resources.paamojaMark) || "../../assets/logo/paamoja-mark.svg"} alt="Paamoja" width="44" height="50" />
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.025em', color: 'var(--color-warm-white)' }}>Paamoja</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-paamoja-gold)', marginBottom: '18px' }}>One Roof, Infinite Possibilities</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-section)', lineHeight: 1.08, color: 'var(--color-warm-white)', marginBottom: '22px' }}>Paamoja — One Roof</h2>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.8)', maxWidth: '46ch' }}>
              Our first product. A platform being built for Nairobi's merchants, couriers, and buyers — bringing commerce, logistics, and payment together under one trusted roof.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(248,246,241,0.6)', maxWidth: '46ch', marginTop: '16px' }}>
              Paamoja is being built to be owned in part by the people who use it.
            </p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => onNav('paamoja')} style={{ background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'var(--color-paamoja-gold)' }}>
                Learn more about Paamoja →
              </button>
            </div>
          </div>
          <div>
            <ComingSoonBlock accent="paamoja" />
          </div>
        </div>
      </section>

      {/* ---- COOPERATIVE OWNERSHIP STRIP ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="A Company for the People" headline="Built that way — not styled that way." />
          <div>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.65, color: 'var(--text-on-light-muted)', maxWidth: '50ch' }}>
              Busara Labs' constitutional commitment is not marketing language. Paamoja is being structured so that the merchants, couriers, and buyers who create its value will participate in its returns. This is how "for the people" becomes structural, not aspirational.
            </p>
            <p style={{ marginTop: '24px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: 'var(--text-on-light)' }}>Inquiries</p>
            <EmailLink address="hello@busaralabs.com" color="navy" size="16px" />
          </div>
        </div>
      </section>

      {/* ---- CORE VALUES ---- */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <SectionHeader label="What Anchors Every Decision" headline="Nine values." onDark />
          <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0', borderTop: '1px solid var(--border-subtle-dark)' }}>
            {VALUES.map((v, i) => (
              <div key={v} style={{ padding: '26px 24px 26px 0', borderBottom: '1px solid var(--border-subtle-dark)', display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-warm-gold)', letterSpacing: '0.1em' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', lineHeight: 1.2, color: 'var(--color-warm-white)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- INFRASTRUCTURE STATEMENT ---- */}
      <section style={{ background: 'var(--color-deep-navy)', padding: '0 0 var(--section-pad-y)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <PullQuote onDark size="lg">
            From one city to one continent.
          </PullQuote>
          <p style={{ marginTop: '24px', fontSize: 'var(--type-body-lg)', lineHeight: 1.65, color: 'rgba(248,246,241,0.78)', maxWidth: '60ch' }}>
            Paamoja is our beginning. The infrastructure layer we are building will serve commerce, payments, logistics, identity, and data governance across Africa.
          </p>
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
