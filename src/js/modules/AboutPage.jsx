/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — About page
   Version: 1.2 | June 2026
   Classification: Public
   ============================================================ */

function AboutPage() {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, PullQuote, EmailLink } = D;

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };
  const prose = { fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'var(--text-on-light-muted)', maxWidth: '60ch' };
  const proseDark = { fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.8)', maxWidth: '60ch' };

  return (
    <div>
      {/* ---- PAGE HERO — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap }}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '24px' }}>About Busara Labs</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--color-warm-white)', maxWidth: '18ch' }}>
            The institution being built beneath Africa's digital economy.
          </h1>
        </div>
      </section>

      {/* ---- 1: WHY THIS, WHY NOW ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="Our Founding" headline="Why This, Why Now" />
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={prose}>Kenya's informal economy is not underserved because the problem is too difficult. It is underserved because the institutions capable of solving it have historically been built around assumptions that exclude much of the population. They assume their users arrive with bank accounts, smartphones, formal employment, and registered businesses. Millions do not.</p>
            <p style={prose}>The technology required to close this gap already exists. What has been missing is the institutional commitment to deploy it properly — with constitutional governance, regulatory discipline, and the long-term perspective that infrastructure demands. Busara Labs was founded to help close that gap.</p>
            <p style={prose}>For decades, economic infrastructure has been built for participants who fit neatly within formal systems. Those systems work remarkably well for the people they were designed to serve. But large segments of Africa's economy operate under different realities, constraints, and incentives. Extending participation requires more than adaptation. It requires infrastructure designed around those realities from the beginning.</p>
            <p style={prose}>This is not simply a social challenge. It is one of the largest economic opportunities of our time. Millions of individuals and businesses already create value every day. What they often lack are the systems that make participation more reliable, discoverable, trusted, and scalable.</p>
            <p style={prose}>We believe better infrastructure creates better outcomes. Better markets. Better businesses. Better livelihoods. The institutions that build that infrastructure responsibly will help define the next era of economic participation across the continent.</p>
            <p style={{ ...prose, fontWeight: 600, color: 'var(--text-on-light)' }}>Busara Labs exists to build those institutions and systems. Paamoja is where that work begins.</p>
          </div>
        </div>
      </section>

      {/* ---- 2: WHO WE ARE ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="Who We Are" headline="An infrastructure company." />
          <div>
            <p style={prose}>We architect systems with constitutional governance and long-term thinking. We operate under a formal company constitution. We build for decades, not for a funding round.</p>
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>Founder</p>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '18px', color: 'var(--text-on-light)', marginTop: '8px' }}>Eric Weru Gitonga</p>
              <p style={{ fontSize: '15px', color: 'var(--text-on-light-muted)' }}>Founder & Sole Director · Incorporated in Kenya</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3: HOW WE GOVERN — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="How We Govern" headline="Governance is the foundation." onDark />
          <p style={proseDark}>Busara Labs operates under a formal governance constitution. Major decisions are documented and traceable. The company is built to be accountable — to its users, its partners, and the communities it serves. Governance is not an afterthought.</p>
        </div>
      </section>

      {/* ---- 4: FOUNDER'S STATEMENT — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', paddingBottom: 'var(--section-pad-y)', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap }}>
          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '48px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '56px', alignItems: 'start' }} className="bl-two-col">
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-warm-gold)' }}>The Founder</span>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '20px', color: 'var(--color-warm-white)', marginTop: '12px' }}>Eric Weru Gitonga</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-warm-gold)', marginTop: '6px', opacity: 0.8 }}>Founder & Sole Director</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(248,246,241,0.4)', marginTop: '4px' }}>Busara Infrastructure & Technology Labs Ltd</p>
            </div>
            <div>
              <hr style={{ width: '40px', height: '2px', background: 'var(--color-warm-gold)', border: 0, margin: '0 0 28px' }} />
              <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 0.9rem + 1.5vw, 1.75rem)', lineHeight: 1.35, color: 'var(--color-warm-white)', margin: 0, fontWeight: 400 }}>
                "I started Busara Labs because I live in this market and I can see exactly what is missing. Not the ambition, not the capability — the infrastructure. The systems that would make millions of capable people's economic lives more reliable, more trusted, and more rewarding have simply never been built for them. That is what we are here to change."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 5: OWNERSHIP MODEL ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="A Company for the People" headline="The ownership model." />
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '56px', alignItems: 'start' }} className="bl-two-col">
            <PullQuote size="md" accent="gold">The people who create the platform's value will participate in its returns.</PullQuote>
            <div>
              <p style={prose}>Busara Labs builds infrastructure for people — and then gives those people a stake in what they help build. Paamoja is being structured as a cooperative hybrid: Busara Labs holds a founding equity stake, and platform members — merchants, couriers, buyers — will receive patronage-based surplus distributions as the platform grows.</p>
              <p style={{ ...prose, marginTop: '20px' }}>This is not a loyalty programme. It is an ownership architecture. This is how Busara Labs makes its constitutional mission operational.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 6: NAIROBI TO CONTINENT ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="From Nairobi to the Continent" headline="We start where we know best." />
          <div>
            <p style={prose}>Paamoja is our first product and our first proof of concept. Busara Labs' mission extends beyond one platform — to the infrastructure layer that will underpin commerce, payments, identity, and data governance across Africa.</p>
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
