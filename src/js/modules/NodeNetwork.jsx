/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   UI Kit — NodeNetwork canvas animation
   Version: 1.0 | June 2026
   Classification: Public
   ============================================================ */

/**
 * NodeNetwork — the infrastructure-layer motif. Warm-gold nodes on Deep Navy,
 * very low-opacity edges. requestAnimationFrame, subtle mouse parallax on
 * desktop, reduced density + no interaction on mobile. Graceful: if canvas is
 * unavailable the solid navy background remains. aria-hidden.
 */
function NodeNetwork({ height = '100%', accent = '#C9A84C' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, nodes = [], raf, mouse = { x: 0, y: 0, active: false };

    function isMobile() { return window.innerWidth < 760; }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const density = isMobile() ? 26000 : 15000;
      const count = Math.max(14, Math.min(64, Math.round((w * h) / density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = isMobile() ? 110 : 150;
      const px = mouse.active ? (mouse.x - w / 2) * 0.012 : 0;
      const py = mouse.active ? (mouse.y - h / 2) * 0.012 : 0;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const o = (1 - dist / linkDist) * 0.16;
            ctx.strokeStyle = `rgba(201,168,76,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x + px, a.y + py);
            ctx.lineTo(b.x + px, b.y + py);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(n.x + px, n.y + py, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      drawFrame();
      raf = requestAnimationFrame(loop);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    resize();
    drawFrame(); // immediate first paint — independent of rAF scheduling
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      if (!isMobile()) {
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseleave', onLeave);
      }
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height, display: 'block' }}
    />
  );
}

window.NodeNetwork = NodeNetwork;
