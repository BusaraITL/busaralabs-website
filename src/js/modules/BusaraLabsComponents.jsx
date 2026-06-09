/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   BusaraLabsComponents.jsx — design system component shim
   Registers all shared components on window.BusaraLabsDesignSystem_284041
   Version: 1.0 | June 2026
   Classification: Public
   Nairobi, Kenya
   ============================================================ */

function EmailLink({ address = 'hello@busaralabs.com', color = 'gold', size = '14px', children }) {
  const [hover, setHover] = React.useState(false);
  const colors = { gold: 'var(--color-warm-gold)', navy: 'var(--color-deep-navy)', white: 'var(--color-warm-white)' };
  const style = { fontFamily: 'var(--font-mono)', fontSize: size, color: colors[color] || colors.gold, textDecoration: 'none', letterSpacing: hover ? '0.06em' : '0.01em', transition: 'letter-spacing var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap' };
  return <a href={`mailto:${address}`} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{children || address}</a>;
}

function Badge({ children, tone = 'gold', variant = 'outline' }) {
  const tones = { gold: { fg: 'var(--color-warm-gold)', bg: 'var(--color-warm-gold)' }, paamoja: { fg: 'var(--color-paamoja-gold)', bg: 'var(--color-paamoja-gold)' }, navy: { fg: 'var(--color-deep-navy)', bg: 'var(--color-deep-navy)' }, muted: { fg: 'var(--text-on-light-muted)', bg: 'var(--color-navy-12)' } };
  const t = tones[tone] || tones.gold;
  const style = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '5px 10px', borderRadius: 'var(--radius-sm)', ...(variant === 'solid' ? { background: t.bg, color: (tone === 'paamoja' || tone === 'gold') ? 'var(--color-deep-navy)' : 'var(--color-warm-white)' } : { background: 'transparent', color: t.fg, border: `1px solid ${t.fg}` }) };
  return <span style={style}>{children}</span>;
}

function SectionHeader({ label, headline, rule = true, onDark = false, align = 'left', accent = 'gold', children }) {
  const accentColor = accent === 'paamoja' ? 'var(--color-paamoja-gold)' : 'var(--color-warm-gold)';
  const headColor = onDark ? 'var(--text-on-dark)' : 'var(--text-on-light)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align }}>
      {rule && <hr style={{ width: '40px', height: '1px', background: accentColor, border: 0, margin: 0 }} />}
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: accentColor }}>{label}</span>}
      {headline && <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--type-section)', lineHeight: 1.08, color: headColor, maxWidth: '22ch', margin: 0 }}>{headline}</h2>}
      {children}
    </div>
  );
}

function PullQuote({ children, cite, onDark = false, accent = 'gold', size = 'lg' }) {
  const accentColor = accent === 'paamoja' ? 'var(--color-paamoja-gold)' : 'var(--color-warm-gold)';
  const fg = onDark ? 'var(--text-on-dark)' : 'var(--text-on-light)';
  const muted = onDark ? 'var(--text-on-dark-muted)' : 'var(--text-on-light-muted)';
  const fontSize = size === 'lg' ? 'clamp(1.75rem, 1.1rem + 2.6vw, 2.75rem)' : 'clamp(1.375rem, 1rem + 1.6vw, 2rem)';
  return (
    <figure style={{ margin: 0, maxWidth: '24ch' }}>
      <hr style={{ width: '40px', height: '2px', background: accentColor, border: 0, margin: '0 0 28px' }} />
      <blockquote style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize, lineHeight: 1.18, color: fg, margin: 0 }}>{children}</blockquote>
      {cite && <figcaption style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, marginTop: '20px' }}>{cite}</figcaption>}
    </figure>
  );
}

function ComingSoonBlock({ domain = 'paamoja.com', href = 'https://paamoja.com', note = 'Coming Soon — join the waitlist for merchants, couriers, and buyers.', accent = 'gold', onDark = true }) {
  const accentColor = accent === 'paamoja' ? 'var(--color-paamoja-gold)' : 'var(--color-warm-gold)';
  const domainColor = onDark ? 'var(--text-on-dark)' : 'var(--text-on-light)';
  const noteColor = onDark ? 'var(--text-on-dark-muted)' : 'var(--text-on-light-muted)';
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', border: `1px solid ${accentColor}`, borderRadius: 'var(--radius-md)', padding: '22px 26px', textDecoration: 'none', maxWidth: '440px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: domainColor, letterSpacing: '0.01em' }}>{domain}</span>
        <span aria-hidden="true" style={{ color: accentColor, fontSize: '14px' }}>↗</span>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.55, color: noteColor, margin: '10px 0 0' }}>{note}</p>
    </a>
  );
}

function FeatureBlock({ number, title, meaning, body, onDark = true }) {
  const fg = onDark ? 'var(--text-on-dark)' : 'var(--text-on-light)';
  const muted = onDark ? 'var(--text-on-dark-muted)' : 'var(--text-on-light-muted)';
  return (
    <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '3px solid var(--color-paamoja-gold)', overflow: 'hidden' }}>
      {number && <span aria-hidden="true" style={{ position: 'absolute', top: '-18px', right: '4px', fontFamily: 'var(--font-display)', fontSize: '120px', lineHeight: 1, color: fg, opacity: 0.06, pointerEvents: 'none', userSelect: 'none' }}>{number}</span>}
      <div style={{ position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--color-paamoja-gold)' }}>{number}</span>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '24px', color: fg, margin: '8px 0 0', letterSpacing: '-0.01em' }}>{title}</h3>
        {meaning && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em', color: 'var(--color-paamoja-gold)', margin: '6px 0 0', opacity: 0.85 }}>{meaning}</p>}
        {body && <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.6, color: muted, margin: '12px 0 0', maxWidth: '42ch' }}>{body}</p>}
      </div>
    </div>
  );
}

function EmailCTA({ label = 'Partnerships, investment, and infrastructure inquiries', address = 'hello@busaralabs.com', onDark = false, align = 'left' }) {
  const labelColor = onDark ? 'var(--text-on-dark-muted)' : 'var(--text-on-light-muted)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align }}>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', letterSpacing: '0.01em', color: labelColor }}>{label}</span>
      <EmailLink address={address} color={onDark ? 'gold' : 'navy'} size="18px" />
    </div>
  );
}

window.BusaraLabsDesignSystem_284041 = { EmailLink, Badge, SectionHeader, PullQuote, ComingSoonBlock, FeatureBlock, EmailCTA };
