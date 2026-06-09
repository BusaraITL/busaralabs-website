/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Site navigation
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

/**
 * SiteNav — sticky navigation. Transparent over the hero, gains a Deep Navy
 * background + subtle bottom border past 50px scroll. Mark + wordmark left,
 * links centre, email right. Mobile: hamburger → full-screen navy overlay.
 */
function SiteNav({ page, onNav, scrollRef }) {
  const { EmailLink } = window.BusaraLabsDesignSystem_284041;
  const [scrolled, setScrolled] = React.useState(false);
  const [menu, setMenu] = React.useState(false);

  React.useEffect(() => {
    const el = scrollRef && scrollRef.current ? scrollRef.current : window;
    const get = () => (el === window ? window.scrollY : el.scrollTop);
    const onScroll = () => setScrolled(get() > 50);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Our Work' },
    { id: 'paamoja', label: 'Paamoja' },
  ];

  const go = (id) => { setMenu(false); onNav(id); };

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 50,
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
    background: scrolled ? 'rgba(0,26,51,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'saturate(140%) blur(8px)' : 'none',
    borderBottom: `1px solid ${scrolled ? 'var(--border-subtle-dark)' : 'transparent'}`,
  };

  const linkStyle = (active) => ({
    position: 'relative',
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px',
    color: active ? 'var(--color-warm-white)' : 'rgba(248,246,241,0.72)',
    background: 'none', border: 0, cursor: 'pointer', padding: '4px 0',
  });

  return (
    <nav style={navStyle} aria-label="Primary">
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '18px var(--gutter)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
      }}>
        {/* Mark + wordmark */}
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 0, cursor: 'pointer' }} aria-label="Busara Labs — home">
          <img src={(window.__resources && window.__resources.busaraMark) || "../../assets/logo/busara-labs-mark.svg"} alt="" width="34" height="38" />
          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '17px', letterSpacing: '0.08em', color: 'var(--color-warm-white)' }}>Busara&nbsp;Labs</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-warm-gold)' }}>Infrastructure for Trust</span>
          </span>
        </button>

        {/* Centre links (desktop) */}
        <div className="bl-nav-links" style={{ display: 'flex', gap: '34px', alignItems: 'center' }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={linkStyle(page === l.id)}>
              {l.label}
              <span style={{
                position: 'absolute', left: 0, bottom: '-4px', height: '1px',
                width: page === l.id ? '100%' : '0%', background: 'var(--color-warm-gold)',
                transition: 'width var(--dur-fast) var(--ease-out)',
              }} />
            </button>
          ))}
        </div>

        {/* Email (desktop) */}
        <div className="bl-nav-email" style={{ display: 'flex' }}>
          <EmailLink address="hello@busaralabs.com" />
        </div>

        {/* Hamburger (mobile) */}
        <button className="bl-nav-burger" onClick={() => setMenu(true)} aria-label="Open menu" style={{
          display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 0, cursor: 'pointer', padding: '6px',
        }}>
          <span style={{ width: '22px', height: '2px', background: 'var(--color-warm-white)' }} />
          <span style={{ width: '22px', height: '2px', background: 'var(--color-warm-white)' }} />
        </button>
      </div>

      {/* Mobile overlay */}
      {menu && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60, background: 'var(--color-deep-navy)',
          display: 'flex', flexDirection: 'column', padding: '24px var(--gutter)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setMenu(false)} aria-label="Close menu" style={{ background: 'none', border: 0, color: 'var(--color-warm-white)', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '12vh', flex: 1 }}>
            {links.map(l => (
              <button key={l.id} onClick={() => go(l.id)} style={{
                background: 'none', border: 0, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-display)', fontSize: '40px',
                color: page === l.id ? 'var(--color-warm-gold)' : 'var(--color-warm-white)',
              }}>{l.label}</button>
            ))}
          </div>
          <div style={{ paddingBottom: '24px' }}>
            <EmailLink address="hello@busaralabs.com" size="16px" />
          </div>
        </div>
      )}
    </nav>
  );
}

window.SiteNav = SiteNav;
