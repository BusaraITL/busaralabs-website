/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — About page
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

function AboutPage() {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, PullQuote, EmailLink } = D;

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };
  const prose = { fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'var(--text-on-light-muted)', maxWidth: '60ch' };

  return (
    <div>
      {/* Page hero */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)' }}>
        <div style={wrap}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '24px' }}>About Busara Labs</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--color-warm-white)', maxWidth: '18ch' }}>
            The institution being built beneath Africa's digital economy.
          </h1>
        </div>
      </section>

      {/* 1 — Founding conviction */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <PullQuote cite="The Founding Conviction">
            Africa's digital transformation will not be driven by consumer applications alone, but by foundational infrastructure.
          </PullQuote>
          <p style={{ ...prose, marginTop: '36px' }}>
            Payment systems, logistics networks, data architecture, identity systems, and market mechanisms that allow millions of informal economic participants to participate in the digital economy with trust, transparency, and access. This is why Busara Labs exists. Not to build another app. To build the layer beneath the apps.
          </p>
        </div>
      </section>

      {/* 2 — Who we are */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="Who We Are" headline="An infrastructure company." />
          <div>
            <p style={prose}>
              We architect systems with constitutional governance and long-term thinking. We operate under a formal company constitution. We build for decades, not for a funding round.
            </p>
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>Founder</p>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '18px', color: 'var(--text-on-light)', marginTop: '8px' }}>Eric Weru Gitonga</p>
              <p style={{ fontSize: '15px', color: 'var(--text-on-light-muted)' }}>Founder &amp; Sole Director · Incorporated in Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — How we govern */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="How We Govern" headline="Governance is the foundation." onDark />
          <p style={{ ...prose, color: 'rgba(248,246,241,0.8)' }}>
            Busara Labs operates under a formal governance constitution. Major decisions are documented and traceable. The company is built to be accountable — to its users, its partners, and the communities it serves. Governance is not an afterthought.
          </p>
        </div>
      </section>

      {/* 4 — Ownership model (weight) */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="A Company for the People" headline="The ownership model." />
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '56px', alignItems: 'start' }} className="bl-two-col">
            <PullQuote size="md" accent="gold">
              The people who create the platform's value will participate in its returns.
            </PullQuote>
            <div>
              <p style={prose}>
                Busara Labs builds infrastructure for people — and then gives those people a stake in what they help build. Paamoja is being structured as a cooperative hybrid: Busara Labs holds a founding equity stake, and platform members — merchants, couriers, buyers — will receive patronage-based surplus distributions as the platform grows.
              </p>
              <p style={{ ...prose, marginTop: '20px' }}>
                This is not a loyalty programme. It is an ownership architecture. This is how Busara Labs makes its constitutional mission operational.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Nairobi to continent */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="From Nairobi to the Continent" headline="We start where we know best." />
          <div>
            <p style={prose}>
              Paamoja is our first product and our first proof of concept. Busara Labs' mission extends beyond one platform — to the infrastructure layer that will underpin commerce, payments, identity, and data governance across Africa.
            </p>
            <div style={{ marginTop: '28px' }}>
              <EmailLink address="hello@busaralabs.com" color="navy" size="16px" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

window.AboutPage = AboutPage;
