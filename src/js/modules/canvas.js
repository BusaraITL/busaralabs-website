/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Canvas Animation — Node network, brand colours, responsive FPS
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2
   ============================================================
   Procedurally generated node network animation.
   Motif: precision infrastructure — interconnected nodes
   representing the technology fabric BIT Labs is building.

   Performance:
   - requestAnimationFrame loop — never blocks main thread
   - Reduced node count on mobile
   - Pauses when tab is hidden (Page Visibility API)
   - Graceful degradation if canvas not supported
   ============================================================ */

'use strict';

// ── DESIGN TOKENS ─────────────────────────────────────────────
const NAVY       = '#001A33';
const GOLD       = '#C9A84C';
const GOLD_FAINT = 'rgba(201, 168, 76, 0.15)';
const NODE_COLOR = 'rgba(201, 168, 76, 0.6)';
const LINE_COLOR = 'rgba(201, 168, 76, 0.12)';

// ── CONFIG ────────────────────────────────────────────────────
const CONFIG = {
  desktop: { nodeCount: 60, maxDistance: 140, nodeRadius: 2, speed: 0.4 },
  mobile:  { nodeCount: 25, maxDistance: 100, nodeRadius: 1.5, speed: 0.3 },
};

// ── INIT ─────────────────────────────────────────────────────
export function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return; // Graceful degradation

  const ctx    = canvas.getContext('2d');
  const isMob  = window.innerWidth < 768;
  const cfg    = isMob ? CONFIG.mobile : CONFIG.desktop;

  let nodes    = [];
  let rafId    = null;
  let running  = true;

  // ── RESIZE HANDLER ──────────────────────────────────────────
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // ── NODE FACTORY ────────────────────────────────────────────
  function createNode() {
    const angle = Math.random() * Math.PI * 2;
    const speed = cfg.speed * (0.5 + Math.random() * 0.5);
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  }

  // ── DRAW FRAME ───────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width)  node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height)  node.vy *= -1;

      // Clamp to bounds
      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cfg.maxDistance) {
          // Fade line based on distance
          const alpha = 1 - (dist / cfg.maxDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201, 168, 76, ${alpha * 0.15})`;
          ctx.lineWidth   = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, cfg.nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR;
      ctx.fill();
    });
  }

  // ── ANIMATION LOOP ───────────────────────────────────────────
  function loop() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  // ── PAGE VISIBILITY ──────────────────────────────────────────
  // Pause animation when tab is not visible — saves CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      running = true;
      loop();
    }
  });

  // ── WINDOW RESIZE ────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      // Recreate nodes to fit new dimensions
      nodes = Array.from({ length: cfg.nodeCount }, createNode);
    }, 200);
  });

  // ── START ─────────────────────────────────────────────────────
  resize();
  nodes = Array.from({ length: cfg.nodeCount }, createNode);
  loop();
}
