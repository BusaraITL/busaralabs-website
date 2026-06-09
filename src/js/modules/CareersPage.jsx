/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Careers page (Phase A)
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

function CareersPage() {
  const { SectionHeader, EmailLink, EmailCTA } = window.BusaraLabsDesignSystem_284041;

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };

  const QUALITIES = [
    { n: '01', t: 'Constitutional thinkers', b: 'People who design systems with governance built in, not bolted on. Who anticipate failure modes before writing the first line of code.' },
    { n: '02', t: 'Long-term builders', b: 'People who optimise for durability, not velocity. Who understand that infrastructure built to last a decade looks different from a product built for a launch.' },
    { n: '03', t: 'Kenya-rooted', b: 'People who understand this market from the inside, not from a case study. Who know why WhatsApp is the right interface, why M-Pesa matters, why the informal economy is not a problem to be solved but a community to be served.' },
    { n: '04', t: 'Technically rigorous', b: 'People who hold themselves to the standard that infrastructure demands. Who would rather do it right than do it fast — and who know the difference.' },
  ];

  return (
    <div>
      {/* ---- HERO — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap }}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '24px' }}>Careers</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--color-warm-white)', maxWidth: '16ch' }}>
            Build the infrastructure. Own a part of it.
          </h1>
          <p style={{ marginTop: '22px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.8)', maxWidth: '54ch' }}>
            Busara Labs is looking for people who want to build foundational systems — not features. If you think in decades, work with constitutional rigour, and want your work to matter to millions of people who have been underserved by every system built before this one, we want to hear from you.
          </p>
        </div>
      </section>

      {/* ---- WHAT WE LOOK FOR ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="What We Look For" headline="Four qualities that matter more than a CV." />
          <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0', borderTop: '1px solid var(--border-subtle)' }}>
            {QUALITIES.map(q => (
              <div key={q.n} style={{ padding: '36px 36px 36px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--color-warm-gold)' }}>{q.n}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '24px', lineHeight: 1.1, color: 'var(--text-on-light)' }}>{q.t}</h3>
                </div>
                <p style={{ fontSize: '15.5px', lineHeight: 1.65, color: 'var(--text-on-light-muted)', maxWidth: '42ch' }}>{q.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- OWNERSHIP ETHOS ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={{ ...wrap, maxWidth: '760px' }}>
          <div style={{ padding: '48px', background: 'var(--color-navy-06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-warm-gold)', marginBottom: '16px' }}>How We Think About the Team</p>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'var(--text-on-light)', fontStyle: 'italic' }}>
              "Busara Labs is built on the conviction that the people who build infrastructure should have a stake in what it becomes. That principle shapes how we hire, how we work, and how we grow."
            </p>
          </div>
        </div>
      </section>

      {/* ---- OPEN ROLES — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: '56px', alignItems: 'start' }} className="bl-two-col">
          <SectionHeader label="Open Roles" headline="No open roles at this time." onDark />
          <div>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.8)', maxWidth: '50ch' }}>
              We are building the team carefully. When roles open, they will be listed here. If you believe you belong on this team before a role exists for you, tell us why.
            </p>
            <div style={{ marginTop: '32px' }}>
              <EmailCTA
                label="Introduce yourself:"
                address="hello@busaralabs.com"
                onDark
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

window.CareersPage = CareersPage;
