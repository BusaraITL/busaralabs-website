/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Site footer (identical on every page)
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

/**
 * SiteFooter — Deep Navy, Warm White text, three columns
 * (Company / Contact / Legal) + a bottom legal strip.
 */
function SiteFooter({ onNav }) {
  const { EmailLink } = window.BusaraLabsDesignSystem_284041;

  const colTitle = {
    fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase',
    letterSpacing: '0.2em', color: 'var(--color-warm-gold)', marginBottom: '18px',
  };
  const line = { fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'rgba(248,246,241,0.82)' };
  const legalLink = { ...line, background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', display: 'block' };

  return (
    <footer style={{ background: 'var(--color-deep-navy)', color: 'var(--color-warm-white)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px var(--gutter) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
          <div>
            <div style={colTitle}>Company</div>
            <p style={line}>Busara Infrastructure &amp; Technology Labs Ltd</p>
            <p style={line}>Nairobi, Kenya</p>
          </div>
          <div>
            <div style={colTitle}>Contact</div>
            <p style={line}>Partnerships &amp; inquiries</p>
            <p style={{ marginBottom: '14px' }}><EmailLink address="hello@busaralabs.com" /></p>
            <p style={line}>Data protection</p>
            <p><EmailLink address="compliance@busaralabs.com" /></p>
          </div>
          <div>
            <div style={colTitle}>Legal</div>
            <button style={legalLink} onClick={() => onNav('privacy')}>Privacy Policy</button>
            <button style={legalLink} onClick={() => onNav('terms')}>Terms of Service</button>
          </div>
        </div>
        <div style={{
          marginTop: '56px', padding: '24px 0 40px', borderTop: '1px solid var(--border-subtle-dark)',
          display: 'flex', flexWrap: 'wrap', gap: '8px 20px', justifyContent: 'space-between',
        }}>
          <span style={{ ...line, fontSize: '12.5px', opacity: 0.7 }}>© 2026 Busara Infrastructure &amp; Technology Labs Ltd. All rights reserved.</span>
          <span style={{ ...line, fontSize: '12.5px', opacity: 0.7 }}>Registered in Kenya · Operating under Kenya Data Protection Act 2019.</span>
        </div>
      </div>
    </footer>
  );
}

window.SiteFooter = SiteFooter;
