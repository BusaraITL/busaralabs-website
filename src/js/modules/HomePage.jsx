/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Home page
   Version: 1.2 | June 2026
   Classification: Public
   ============================================================ */

function ValueMarquee() {
  const ITEMS = [
    'Innovation & Technical Excellence',
    'Impact-Driven',
    'Long-Term Thinking',
    'Accessibility',
    'User Empowerment & Financial Inclusion',
    'Transparency & Trust',
    'Community-First',
    'Speed & Execution',
    'A Company for the People',
  ];
  const repeated = [...ITEMS, ...ITEMS];
  const keyframes = `
    @keyframes bl-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  return (
    <div style={{ background: 'var(--color-deep-navy)', borderTop: '1px solid rgba(201,168,76,0.18)', borderBottom: '1px solid rgba(201,168,76,0.18)', overflow: 'hidden', padding: '18px 0' }}>
      <style>{keyframes}</style>
      <div style={{ display: 'flex', width: 'max-content', animation: 'bl-marquee 38s linear infinite', willChange: 'transform' }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '28px', paddingRight: '28px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-warm-gold)', whiteSpace: 'nowrap' }}>{item}</span>
            <span style={{ display: 'inline-block', width: '4px', height: '4px', background: 'rgba(201,168,76,0.4)', borderRadius: '50%', flexShrink: 0 }} aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

function HomePage({ onNav }) {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, PullQuote, ComingSoonBlock, EmailLink } = D;

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
          <p style={{ marginTop: '24px', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 0.9rem + 1vw, 1.4rem)', lineHeight: 1.3, color: 'var(--color-warm-gold)', maxWidth: '44ch' }}>
            Africa's informal economy deserves real infrastructure.
          </p>
          <p style={{ maxWidth: '52ch', marginTop: '20px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.75)' }}>
            Millions of traders run real businesses without the systems formal commerce takes for granted. Not because those systems are too hard to build — because no one has built them for this market, at this level of rigour, with this level of accountability.
          </p>
          <div style={{ marginTop: '36px' }}>
            <EmailLink address="hello@busaralabs.com" size="16px" />
          </div>
        </div>
      </section>

      {/* ---- VALUES MARQUEE STRIP ---- */}
      <ValueMarquee />

      {/* ---- MISSION STRIP ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '28px' }}>The Mission</span>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 1rem + 3vw, 3rem)', lineHeight: 1.18, color: 'var(--color-deep-navy)', maxWidth: '20ch' }}>
            Build constitutionally governed infrastructure that enables Africa's informal economy to participate in the digital economy with trust, transparency, and access — starting with Nairobi, expanding to the continent.
          </p>
        </div>
      </section>

      {/* ---- WHAT WE DO ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px', alignItems: 'start' }} className="bl-two-col">
          <SectionHeader label="What We Do" headline="The infrastructure layer beneath commerce." />
          <div>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'var(--text-on-light-muted)', maxWidth: '50ch' }}>
              Busara Labs designs foundational technology systems — the infrastructure layer beneath commerce, not the applications on top of it. Payment systems. Logistics networks. Identity and trust mechanisms. Built constitutionally, governed formally, designed to outlast the people who built them.
            </p>
            <p style={{ marginTop: '20px', fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'var(--text-on-light-muted)', maxWidth: '50ch' }}>
              We exist because the informal economy is not a temporary condition to be solved by consumer apps. It is a permanent, sophisticated market that deserves the same institutional infrastructure that formal economies take for granted. Our first product, Paamoja, is proof that this is possible.
            </p>
          </div>
        </div>
      </section>

      {/* ---- PAAMOJA FEATURE ---- */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '56px', alignItems: 'center' }} className="bl-paamoja-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <img src={(window.__resources && window.__resources.paamojaMark) || "/assets/images/logo/paamoja-mark.svg"} alt="Paamoja" width="44" height="50" />
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
            <div style={{ marginTop: '32px' }}>
              <button onClick={() => onNav('paamoja')} style={{ background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'var(--color-paamoja-gold)' }}>
                Learn more about Paamoja →
              </button>
            </div>
          </div>
          <div><ComingSoonBlock accent="paamoja" /></div>
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
            <p style={{ marginTop: '16px', fontSize: 'var(--type-body-lg)', lineHeight: 1.65, color: 'var(--text-on-light-muted)', maxWidth: '50ch' }}>
              Better infrastructure creates better outcomes. Better markets. Better businesses. Better livelihoods.
            </p>
            <p style={{ marginTop: '24px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: 'var(--text-on-light)' }}>Inquiries</p>
            <EmailLink address="hello@busaralabs.com" color="navy" size="16px" />
          </div>
        </div>
      </section>

      {/* ---- CORE VALUES — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
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

      {/* ---- INFRASTRUCTURE STATEMENT — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: '0 0 var(--section-pad-y)', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <PullQuote onDark size="lg">From one city to one continent.</PullQuote>
          <p style={{ marginTop: '24px', fontSize: 'var(--type-body-lg)', lineHeight: 1.65, color: 'rgba(248,246,241,0.78)', maxWidth: '60ch' }}>
            Paamoja is our beginning. The infrastructure layer we are building will serve commerce, payments, logistics, identity, and data governance across Africa.
          </p>
        </div>
      </section>
    </div>
  );
}

window.HomePage = HomePage;
