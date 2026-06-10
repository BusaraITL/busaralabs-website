/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Legal, Terms placeholder, and 404 views
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

const legalWrap = { maxWidth: '760px', margin: '0 auto', padding: '0 var(--gutter)' };
const legalProse = { fontSize: '16px', lineHeight: 1.75, color: 'var(--text-on-light-muted)', marginBottom: '18px' };
const legalH2 = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '18px', color: 'var(--text-on-light)', margin: '36px 0 14px' };

function PrivacyPage() {
  const { EmailLink } = window.BusaraLabsDesignSystem_284041;
  return (
    <div style={{ background: 'var(--color-warm-white)' }}>
      <section style={{ padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)' }}>
        <div style={legalWrap}>
          <span className="bl-label" style={{ display: 'block', marginBottom: '20px' }}>ODPC-Required Disclosure</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--text-on-light)', marginBottom: '12px' }}>Privacy Policy</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-on-light-muted)', letterSpacing: '0.04em' }}>Version 1.0 · June 2026 · Nairobi, Kenya</p>

          <h2 style={legalH2}>Our position in Phase A</h2>
          <p style={legalProse}>
            busaralabs.com is a static informational website. In this phase we do not operate contact forms, collect account data, or process personal information through the site. Cloudflare Web Analytics is used without cookies and does not identify individual visitors.
          </p>
          <h2 style={legalH2}>Data residency &amp; framework</h2>
          <p style={legalProse}>
            Busara Infrastructure &amp; Technology Labs Ltd operates under the Kenya Data Protection Act, 2019. Personal data architecture is designed for residency within Kenya and for compliance with the Office of the Data Protection Commissioner (ODPC).
          </p>
          <h2 style={legalH2}>Contacting us about data protection</h2>
          <p style={legalProse}>
            For any data protection question, write to <EmailLink address="compliance@busaralabs.com" color="navy" />. For general inquiries, <EmailLink address="hello@busaralabs.com" color="navy" />.
          </p>
        </div>
      </section>
    </div>
  );
}

function TermsPage() {
  const { EmailLink } = window.BusaraLabsDesignSystem_284041;
  return (
    <div style={{ background: 'var(--color-warm-white)' }}>
      <section style={{ padding: 'calc(var(--section-pad-y) + 60px) 0 calc(var(--section-pad-y) + 60px)' }}>
        <div style={{ ...legalWrap, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.05, color: 'var(--text-on-light)', marginBottom: '24px' }}>Terms of Service</h1>
          <p style={{ ...legalProse, maxWidth: '46ch', margin: '0 auto 8px' }}>
            Our Terms of Service are being finalised and will be published here. For questions in the interim, contact us at{' '}
            <EmailLink address="hello@busaralabs.com" color="navy" />.
          </p>
        </div>
      </section>
    </div>
  );
}

function NotFoundPage({ onNav }) {
  const { EmailLink } = window.BusaraLabsDesignSystem_284041;
  return (
    <div style={{ background: 'var(--color-warm-white)' }}>
      <section style={{ padding: 'var(--section-pad-y) 0', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ ...legalWrap, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-display-xl)', lineHeight: 1, color: 'var(--color-deep-navy)' }}>404</div>
          <p style={{ fontSize: '20px', color: 'var(--text-on-light)', marginTop: '12px', marginBottom: '32px' }}>This page doesn't exist.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => onNav('home')} style={{ background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '16px', color: 'var(--color-deep-navy)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Return to the homepage
            </button>
            <div style={{ fontSize: '14px', color: 'var(--text-on-light-muted)' }}>
              Or reach us directly: <EmailLink address="hello@busaralabs.com" color="navy" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

window.PrivacyPage = PrivacyPage;
window.TermsPage = TermsPage;
window.NotFoundPage = NotFoundPage;
