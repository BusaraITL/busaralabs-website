/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Contact page (Phase A — no form)
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

function ContactPage() {
  const { EmailLink, SectionHeader } = window.BusaraLabsDesignSystem_284041;

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };

  const CHANNELS = [
    { label: 'Partnerships & Investment', address: 'hello@busaralabs.com', note: 'Strategic partners, investors, and institutional inquiries.' },
    { label: 'Data Protection & Compliance', address: 'compliance@busaralabs.com', note: 'ODPC-related, data subject rights, and regulatory matters.' },
    { label: 'General Inquiries', address: 'hello@busaralabs.com', note: 'Everything else — we read every message.' },
  ];

  return (
    <div>
      {/* ---- HERO — Deep Navy + NodeNetwork ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap }}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '24px' }}>Get in Touch</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--color-warm-white)', maxWidth: '22ch' }}>
            We are building infrastructure for the long term.
          </h1>
          <p style={{ marginTop: '22px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.8)', maxWidth: '54ch' }}>
            We are interested in conversations that match that ambition.
          </p>
        </div>
      </section>

      {/* ---- INQUIRY CHANNELS ---- */}
      <section style={{ background: 'var(--color-warm-white)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '72px', alignItems: 'start' }} className="bl-two-col">
          <SectionHeader label="How to Reach Us" headline="Direct lines to the right people." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', borderTop: '1px solid var(--border-subtle)' }}>
            {CHANNELS.map((c, i) => (
              <div key={i} style={{ padding: '32px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-warm-gold)', marginBottom: '10px' }}>{c.label}</p>
                <EmailLink address={c.address} color="navy" size="18px" />
                <p style={{ marginTop: '10px', fontSize: '15px', lineHeight: 1.6, color: 'var(--text-on-light-muted)', maxWidth: '46ch' }}>{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FORM PLACEHOLDER ---- */}
      <section style={{ background: 'var(--color-warm-white)', paddingBottom: 'var(--section-pad-y)' }}>
        <div style={wrap}>
          <div style={{
            padding: '48px',
            background: 'var(--color-navy-06)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '640px',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-warm-gold)' }}>Coming in Phase B</p>
            <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'var(--text-on-light)', maxWidth: '44ch' }}>
              We are setting up a formal contact form. In the meantime, reach us directly at{' '}
              <EmailLink address="hello@busaralabs.com" color="navy" size="17px" />.
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-on-light-muted)', maxWidth: '48ch' }}>
              The form will activate once our ODPC Data Controller registration and Data Processing Agreement with Cloudflare are confirmed — a deliberate compliance decision, not an oversight.
            </p>
          </div>
        </div>
      </section>

      {/* ---- NAIROBI ---- */}
      <section style={{ position: 'relative', background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0', overflow: 'hidden' }}>
        <NodeNetwork />
        <div style={{ position: 'relative', ...wrap }}>
          <SectionHeader label="Location" headline="Nairobi, Kenya." onDark />
          <p style={{ marginTop: '24px', fontSize: 'var(--type-body-lg)', lineHeight: 1.65, color: 'rgba(248,246,241,0.78)', maxWidth: '52ch' }}>
            Busara Labs is headquartered in Nairobi. We are building infrastructure for this city first — because we understand it, because we live in it, and because it is where the work needs to begin.
          </p>
          <div style={{ marginTop: '32px' }}>
            <EmailLink address="hello@busaralabs.com" size="16px" />
          </div>
        </div>
      </section>
    </div>
  );
}

window.ContactPage = ContactPage;
