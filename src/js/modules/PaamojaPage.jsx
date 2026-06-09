/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — Paamoja vision page
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

function PaamojaPage() {
  const D = window.BusaraLabsDesignSystem_284041;
  const { SectionHeader, FeatureBlock, ComingSoonBlock, PullQuote } = D;

  const wrap = { maxWidth: '1200px', margin: '0 auto', padding: '0 var(--gutter)' };
  const ELEMENTS = [
    { n: '01', t: 'HuruMarket', m: 'Named for freedom', b: 'Where buyers discover and shop from Nairobi\u2019s merchants.' },
    { n: '02', t: 'Duka', m: 'The merchant system', b: 'Every shop owner who joins becomes a node in the network.' },
    { n: '03', t: 'Tuma', m: 'To send', b: 'The logistics rail. Goods move from merchant to buyer, tracked and accountable.' },
    { n: '04', t: 'e-pay', m: 'Trust by design', b: 'The payment escrow layer. Payment held until delivery confirmed.' },
  ];

  return (
    <div>
      {/* HERO — Charcoal portal */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'calc(var(--section-pad-y) + 40px) 0 var(--section-pad-y)' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: '48px', alignItems: 'center' }} className="bl-paamoja-hero">
          <img src={(window.__resources && window.__resources.paamojaMark) || "../../assets/logo/paamoja-mark.svg"} alt="Paamoja" width="140" height="158" />
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-paamoja-gold)', marginBottom: '18px' }}>Paamoja · A Busara Labs Product</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-page)', lineHeight: 1.04, color: 'var(--color-warm-white)', maxWidth: '16ch' }}>
              One Roof, Infinite Possibilities
            </h1>
            <p style={{ marginTop: '22px', fontSize: 'var(--type-body-lg)', lineHeight: 1.6, color: 'rgba(248,246,241,0.82)', maxWidth: '48ch' }}>
              A commerce, logistics, and payment platform being built for Nairobi — by Busara Labs.
            </p>
            <div style={{ marginTop: '32px', maxWidth: '440px' }}>
              <ComingSoonBlock accent="paamoja" />
            </div>
          </div>
        </div>
      </section>

      {/* 1 — What it's built to do */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="What Paamoja Is Being Built To Do" headline="Connect what is fragmented." onDark accent="paamoja" />
          <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.82)', maxWidth: '52ch' }}>
            Nairobi's informal economy is large, active, and underserved by existing platforms. Commerce happens. Logistics happens. Payments happen. But they happen in fragmented, unreliable, often untrusted ways. Paamoja is being built to change that — to connect merchants, couriers, and buyers under a single trusted platform with reliable logistics and fair, guaranteed payment.
          </p>
        </div>
      </section>

      {/* 2 — The platform (four elements) */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="The Platform" headline="Four elements, working as one." onDark accent="paamoja" />
          <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
            {ELEMENTS.map(e => (
              <FeatureBlock key={e.n} number={e.n} title={e.t} meaning={e.m} body={e.b} onDark />
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Built for everyone */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="Built for Everyone in It" headline="One platform. Multiple roles." onDark accent="paamoja" />
          <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.82)', maxWidth: '52ch' }}>
            A bodaboda rider can be a courier, a buyer, and a merchant on the same platform with one identity. Paamoja is designed for the full complexity of how people in Nairobi actually work.
          </p>
        </div>
      </section>

      {/* 4 — Owned by its members */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <PullQuote onDark accent="paamoja" size="lg">
            Not just a platform you will use. A platform you will be able to own a part of.
          </PullQuote>
          <p style={{ marginTop: '32px', fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.8)', maxWidth: '62ch' }}>
            Merchants, couriers, and buyers who participate in Paamoja will receive distributions from the platform's surplus. Busara Labs holds a founding stake. Members hold the rest — proportional to their participation. One roof. Everyone under it has a share of what the roof is worth.
          </p>
        </div>
      </section>

      {/* 5 — Payment for Kenya */}
      <section style={{ background: 'var(--color-deep-navy)', padding: 'var(--section-pad-y) 0' }}>
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px' }} className="bl-two-col">
          <SectionHeader label="Payment Built for Kenya" headline="Built with M-Pesa at its core." onDark accent="paamoja" />
          <p style={{ fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.82)', maxWidth: '52ch' }}>
            Paamoja is being built with M-Pesa at its core — integrated directly via the Daraja API. Payment that works the way Nairobi works.
          </p>
        </div>
      </section>

      {/* 6 — Coming to Nairobi */}
      <section style={{ background: 'var(--color-charcoal)', padding: 'var(--section-pad-y) 0' }}>
        <div style={wrap}>
          <SectionHeader label="Coming to Nairobi" headline="When we launch, it will be ready." onDark accent="paamoja" />
          <p style={{ marginTop: '24px', fontSize: 'var(--type-body-lg)', lineHeight: 1.7, color: 'rgba(248,246,241,0.82)', maxWidth: '58ch' }}>
            Paamoja is in active development. We are building carefully, constitutionally, and with the people it serves in mind. Follow our progress at paamoja.com — coming soon.
          </p>
        </div>
      </section>
    </div>
  );
}

window.PaamojaPage = PaamojaPage;
