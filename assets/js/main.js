/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   main.js — single vanilla JS file, no dependencies.
   Loaded with `defer` on every page.
   Version: 1.0 | June 2026
   Classification: Public
   Nairobi, Kenya
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Flag the document as JS-enabled so progressive-enhancement styles
     (e.g. the infrastructure-stack accordion) only engage when JS runs.
     Set immediately to avoid a flash of collapsed content. */
  document.documentElement.classList.add('bl-js');

  /* --------------------------------------------------------
     5.1  Nav scroll behaviour
     Adds 'bl-nav--scrolled' past 50px scroll depth.
     -------------------------------------------------------- */
  function initNavScroll() {
    var nav = document.querySelector('.bl-nav');
    if (!nav) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 50) nav.classList.add('bl-nav--scrolled');
      else nav.classList.remove('bl-nav--scrolled');
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* --------------------------------------------------------
     5.2  Mobile menu
     Hamburger toggles full-screen overlay; close button and
     link clicks dismiss it; body scroll locked while open.
     -------------------------------------------------------- */
  function initMobileMenu() {
    var burger = document.querySelector('.bl-nav-burger');
    var overlay = document.querySelector('.bl-mobile-overlay');
    if (!burger || !overlay) return;
    var nav = document.querySelector('.bl-nav');
    var closeBtn = overlay.querySelector('.bl-mobile-close');

    var lockedScrollY = 0;
    function open() {
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      overlay.classList.add('is-open');
      // Drop the nav's backdrop-filter while open: a filtered ancestor
      // becomes the containing block for the fixed overlay and would
      // otherwise clip the full-screen menu to the header strip.
      if (nav) nav.classList.add('bl-nav--menu-open');
      // Robust scroll lock (incl. iOS Safari, which ignores overflow:hidden
      // alone): pin the body in place and remember where we were.
      document.body.style.position = 'fixed';
      document.body.style.top = (-lockedScrollY) + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      overlay.classList.remove('is-open');
      if (nav) nav.classList.remove('bl-nav--menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      // Restore the exact scroll position the menu was opened from.
      window.scrollTo(0, lockedScrollY);
      burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  /* --------------------------------------------------------
     5.3  NodeNetwork canvas animation
     Warm-gold nodes on Deep Navy, very low-opacity edges.
     IntersectionObserver pauses off-screen. Respects
     prefers-reduced-motion. Mobile: fewer nodes, no parallax.
     -------------------------------------------------------- */
  function initNodeNetwork(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return; // graceful: solid navy remains

    var accent = canvas.getAttribute('data-accent') || '#C9A84C';
    var w, h, dpr, nodes = [], raf = null, running = false;
    var mouse = { x: 0, y: 0, active: false };
    // ambient signal flow: occasional pulses travel along edges
    var pulses = [], now = 0, prev = 0, lastSpawn = 0;

    function isMobile() { return window.innerWidth < 760; }

    function seed() {
      var density = isMobile() ? 26000 : 15000;
      var count = Math.max(14, Math.min(64, Math.round((w * h) / density)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 0.8,
          phase: Math.random() * Math.PI * 2 // desync the breathing
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    // Spawn a signal pulse along a real edge (two nodes within range),
    // so motion traces the network's actual topology, not random paths.
    function spawnPulse(linkDist) {
      var cap = isMobile() ? 2 : 5;
      if (pulses.length >= cap) return;
      var a = (Math.random() * nodes.length) | 0;
      var candidates = [];
      for (var k = 0; k < nodes.length; k++) {
        if (k === a) continue;
        var dx = nodes[a].x - nodes[k].x, dy = nodes[a].y - nodes[k].y;
        if (Math.hypot(dx, dy) < linkDist) candidates.push(k);
      }
      if (!candidates.length) return;
      var b = candidates[(Math.random() * candidates.length) | 0];
      pulses.push({ a: nodes[a], b: nodes[b], t: 0, dur: 900 + Math.random() * 700 });
    }

    function drawFrame() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      var linkDist = isMobile() ? 110 : 150;
      var px = mouse.active ? (mouse.x - w / 2) * 0.012 : 0;
      var py = mouse.active ? (mouse.y - h / 2) * 0.012 : 0;
      var dt = now - prev; if (dt < 0 || dt > 100) dt = 16;
      var i, j, n;

      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      // edges
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            var o = (1 - dist / linkDist) * 0.16;
            ctx.strokeStyle = 'rgba(201,168,76,' + o + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x + px, a.y + py);
            ctx.lineTo(b.x + px, b.y + py);
            ctx.stroke();
          }
        }
      }
      // ambient signal pulses travelling along edges
      if (!prefersReduced) {
        if (now - lastSpawn > 1100) { spawnPulse(linkDist); lastSpawn = now; }
        for (i = pulses.length - 1; i >= 0; i--) {
          var p = pulses[i];
          p.t += dt / p.dur;
          if (p.t >= 1) { pulses.splice(i, 1); continue; }
          var fx = p.a.x + (p.b.x - p.a.x) * p.t + px;
          var fy = p.a.y + (p.b.y - p.a.y) * p.t + py;
          var fade = Math.sin(Math.PI * p.t); // bright mid-flight, soft at ends
          ctx.fillStyle = accent;
          ctx.globalAlpha = 0.7 * fade;
          ctx.beginPath();
          ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      // nodes (with a slow, desynchronised breathing)
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        var br = prefersReduced ? 1 : 1 + 0.16 * Math.sin(now / 1100 + n.phase);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(n.x + px, n.y + py, n.r * br, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      prev = now;
    }

    function loop(ts) {
      now = ts || (now + 16);
      drawFrame();
      raf = window.requestAnimationFrame(loop);
    }
    function start() {
      if (running || prefersReduced) return;
      running = true;
      raf = window.requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (raf) { window.cancelAnimationFrame(raf); raf = null; }
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    resize();
    drawFrame(); // immediate first paint — independent of rAF

    window.addEventListener('resize', function () {
      resize();
      if (!running) drawFrame();
    });

    if (!isMobile()) {
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseleave', onLeave);
    }

    if (prefersReduced) return; // static first paint only

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.01 });
      io.observe(canvas);
    } else {
      start();
    }
  }

  /* --------------------------------------------------------
     GLOBAL ambient-infrastructure background.
     Any element with class `ambient-network` gets a node-network
     canvas injected behind its content and animated. Used on every
     navy surface across the site so the background reads as one
     continuous system rather than a home-page-only effect.
     -------------------------------------------------------- */
  function initAmbientNetwork() {
    document.querySelectorAll('.ambient-network').forEach(function (host) {
      var canvas = host.querySelector('.ambient-network__canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'ambient-network__canvas';
        canvas.setAttribute('aria-hidden', 'true');
        host.insertBefore(canvas, host.firstChild);
      }
      initNodeNetwork(canvas);
    });
  }

  /* --------------------------------------------------------
     Small DOM helpers shared by the VerticalExplorer + builders.
     -------------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function ul(items, liCls) {
    var u = el('ul', 'bl-vx__list');
    (items || []).forEach(function (it) { u.appendChild(el('li', liCls || null, it)); });
    return u;
  }
  function relGroup(label, value) {
    var g = el('div', 'bl-vx__rel-group');
    g.appendChild(el('span', 'bl-vx__rel-label', label));
    g.appendChild(el('p', 'bl-vx__rel-items', value));
    return g;
  }
  function fieldList(label, items, wide) {
    var f = el('div', 'bl-vx__field' + (wide ? ' bl-vx__field--wide' : ''));
    f.appendChild(el('span', 'bl-vx__field-label', label));
    if (items && items.length) f.appendChild(ul(items));
    else f.appendChild(el('p', 'bl-vx__pending', 'To be produced'));
    return f;
  }
  function fieldText(label, text, wide) {
    var f = el('div', 'bl-vx__field' + (wide ? ' bl-vx__field--wide' : ''));
    f.appendChild(el('span', 'bl-vx__field-label', label));
    f.appendChild(el('p', 'bl-vx__field-text', text));
    return f;
  }

  /* --------------------------------------------------------
     5.3b  VerticalExplorer — ONE reusable vertical-exploration
     component. A stack of rows on a shared spine + a live detail
     panel. Hover/focus previews a row, click pins it, arrows +
     Enter move focus, and the panel re-renders for the active row.

     It powers THREE sections from data alone — the Home methodology
     ("How We Build"), the Our Work infrastructure layers, and the
     Paamoja institutional journey — with IDENTICAL behaviour. Only
     the data and a small render config differ. A new vertical
     exploration is created simply by passing new data.

       config = {
         variant   : 'light' | 'dark',          surface + accent
         items     : [ {id,title,role,status?,deps?,…}, … ],
         ariaLabel : string,
         eyebrow   : string | function(item),   panel eyebrow
         defaultStatus : 'active',              pin first item w/ status
         related   : function(active,item,ai,ii)->bool,  optional highlight
         panel     : function(item)->Node       panel body builder
       }

     No-JS: a static fallback inside the host is shown; this code
     clears it and renders the interactive structure.
     -------------------------------------------------------- */
  function VerticalExplorer(host, config) {
    var data = config.items;
    if (!host || !Array.isArray(data) || !data.length) return;
    var STATUS_LABEL = { complete: 'Complete', active: 'Current stage', upcoming: 'Upcoming' };
    var hasRelated = typeof config.related === 'function';

    host.innerHTML = '';
    var root = el('div', 'bl-vx bl-vx--' + (config.variant || 'light'));
    var stack = el('div', 'bl-vx__stack');
    stack.setAttribute('role', 'tablist');
    stack.setAttribute('aria-orientation', 'vertical');
    stack.setAttribute('aria-label', config.ariaLabel || 'Vertical explorer');
    var panel = el('aside', 'bl-vx__panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-live', 'polite');
    root.appendChild(stack);
    root.appendChild(panel);
    host.appendChild(root);

    var rows = [], pinned = 0;

    data.forEach(function (item, i) {
      if (config.defaultStatus && item.status === config.defaultStatus) pinned = i;
      var statusCls = item.status ? ' is-' + (item.status === 'active' ? 'current' : item.status) : '';
      var btn = el('button', 'bl-vx__row' + statusCls);
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
      btn.appendChild(el('span', 'bl-vx__node'));
      var head = el('span', 'bl-vx__head');
      if (item.id) head.appendChild(el('span', 'bl-vx__num', item.id));
      head.appendChild(el('span', 'bl-vx__title', item.title));
      btn.appendChild(head);
      if (item.role) btn.appendChild(el('span', 'bl-vx__role', item.role));
      var tagText = item.tag || (item.status ? STATUS_LABEL[item.status] : '');
      if (tagText) btn.appendChild(el('span', 'bl-vx__tag', tagText));
      stack.appendChild(btn);
      rows.push(btn);

      btn.addEventListener('mouseenter', function () { if (!hasRelated) stack.classList.add('is-exploring'); select(i); });
      btn.addEventListener('focus', function () { if (!hasRelated) stack.classList.add('is-exploring'); select(i); });
      btn.addEventListener('click', function () { pinned = i; select(i); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault(); rows[Math.min(i + 1, rows.length - 1)].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault(); rows[Math.max(i - 1, 0)].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); pinned = i; select(i);
        }
      });
    });

    root.addEventListener('mouseleave', function () {
      stack.classList.remove('is-exploring');
      select(pinned);
    });

    function select(idx) {
      var active = data[idx];
      rows.forEach(function (b, i) {
        var on = i === idx;
        var related = hasRelated && !on && config.related(active, data[i], idx, i);
        b.classList.toggle('is-selected', on);
        b.classList.toggle('is-related', !!related);
        b.classList.toggle('is-muted', hasRelated && !on && !related);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.setAttribute('tabindex', on ? '0' : '-1');
      });
      panel.innerHTML = '';
      var eyebrow = typeof config.eyebrow === 'function' ? config.eyebrow(active) : config.eyebrow;
      if (eyebrow) panel.appendChild(el('p', 'bl-vx__panel-eyebrow', eyebrow));
      panel.appendChild(el('h3', 'bl-vx__panel-title', active.title));
      if (active.role) panel.appendChild(el('p', 'bl-vx__panel-role', active.role));
      panel.appendChild(config.panel(active));
    }

    select(pinned);
  }

  /* --------------------------------------------------------
     5.3c  Wire up every VerticalExplorer on the page from data.
     Each host carries data-vx="<which>"; only the matching data
     file needs to be loaded on that page. Adding a new vertical
     exploration = a host + a data array + a panel builder here.
     -------------------------------------------------------- */
  function initVerticalExplorers() {
    // --- Our Work: infrastructure layers (relationship highlight by deps) ---
    var infraHost = document.querySelector('[data-vx="infrastructure"]');
    if (infraHost && Array.isArray(window.BUSARA_INFRASTRUCTURE)) {
      VerticalExplorer(infraHost, {
        variant: 'light',
        items: window.BUSARA_INFRASTRUCTURE,
        ariaLabel: 'Infrastructure domains',
        eyebrow: 'Infrastructure domain',
        related: function (active, item) {
          return (active.deps || []).indexOf(item.id) !== -1 ||
                 (item.deps || []).indexOf(active.id) !== -1;
        },
        panel: function (item) {
          var body = el('div', 'bl-vx__body');
          body.appendChild(el('p', 'bl-vx__desc', item.challenge));
          var fields = el('div', 'bl-vx__fields');
          fields.appendChild(fieldText('Why this domain matters', item.matters));
          fields.appendChild(fieldText('Infrastructure that enables progress', item.infrastructure));
          fields.appendChild(fieldText('How it connects', item.connects, true));
          fields.appendChild(fieldText('Initiatives it produces', item.initiatives, true));
          if (item.paamoja) fields.appendChild(fieldText('Current initiative', item.paamoja, true));
          body.appendChild(fields);
          return body;
        }
      });
    }

    // --- Home: the methodology ("How We Build"); next stage highlights ---
    var methHost = document.querySelector('[data-vx="methodology"]');
    if (methHost && Array.isArray(window.BUSARA_METHODOLOGY)) {
      VerticalExplorer(methHost, {
        variant: 'light',
        items: window.BUSARA_METHODOLOGY,
        ariaLabel: 'How we build — the methodology',
        eyebrow: function (item) { return 'Stage ' + item.id + ' \u00B7 The method'; },
        related: function (active, item, ai, ii) { return ii === ai + 1; },
        panel: function (item) {
          var body = el('div', 'bl-vx__body');
          body.appendChild(el('p', 'bl-vx__purpose', item.purpose));
          var fields = el('div', 'bl-vx__fields');
          fields.appendChild(fieldList('Activities', item.methods));
          fields.appendChild(fieldText('Expected output', item.outputs));
          fields.appendChild(fieldText('How it informs the next stage', item.informs, true));
          body.appendChild(fields);
          return body;
        }
      });
    }

    // --- About: enduring convictions (expandable via the same component) ---
    var convHost = document.querySelector('[data-vx="convictions"]');
    if (convHost && Array.isArray(window.BUSARA_CONVICTIONS)) {
      VerticalExplorer(convHost, {
        variant: 'light',
        items: window.BUSARA_CONVICTIONS,
        ariaLabel: 'Our convictions',
        eyebrow: 'Conviction',
        related: function (active, item, ai, ii) { return ii === ai + 1; },
        panel: function (item) {
          var body = el('div', 'bl-vx__body');
          body.appendChild(el('p', 'bl-vx__purpose', item.why));
          var fields = el('div', 'bl-vx__fields');
          fields.appendChild(fieldText('In practice', item.practice, true));
          body.appendChild(fields);
          return body;
        }
      });
    }

    // --- Paamoja: the institutional development journey (status-driven) ---
    var journeyHost = document.querySelector('[data-vx="journey"]');
    if (journeyHost && Array.isArray(window.BUSARA_JOURNEY)) {
      VerticalExplorer(journeyHost, {
        variant: 'dark',
        items: window.BUSARA_JOURNEY,
        ariaLabel: 'Institutional development stages',
        defaultStatus: 'active',
        eyebrow: function (item) { return 'Stage ' + item.id + ' \u00B7 Institutional development'; },
        panel: function (item) {
          var body = el('div', 'bl-vx__body');
          var pillMap = { complete: 'bl-vx__pill--complete', active: 'bl-vx__pill--active', upcoming: '' };
          var labelMap = { complete: 'Complete', active: 'Current stage', upcoming: 'Upcoming' };
          var meta = el('div', 'bl-vx__meta');
          meta.appendChild(el('span', 'bl-vx__pill' + (pillMap[item.status] ? ' ' + pillMap[item.status] : ''), labelMap[item.status] || 'Upcoming'));
          if (item.date) meta.appendChild(el('span', 'bl-vx__date', item.date));
          var prog = el('span', 'bl-vx__progress');
          var bar = el('span', 'bl-vx__progress-bar');
          prog.appendChild(bar);
          meta.appendChild(prog);
          body.appendChild(meta);
          window.requestAnimationFrame(function () { bar.style.width = (item.progress || 0) + '%'; });

          body.appendChild(el('p', 'bl-vx__purpose', item.purpose));
          var fields = el('div', 'bl-vx__fields');
          fields.appendChild(fieldList('Questions', item.questions));
          fields.appendChild(fieldList('Methods', item.methods));
          fields.appendChild(fieldList('Participants', item.participants));
          fields.appendChild(fieldList('Evidence produced', item.evidence));
          fields.appendChild(fieldText('Decision making', item.decisions, true));
          fields.appendChild(fieldText('Lessons learned', item.lessons, true));
          fields.appendChild(fieldText('Outputs', item.outputs, true));
          body.appendChild(fields);
          return body;
        }
      });
    }
  }

  /* --------------------------------------------------------
     5.3d  Orbital thinking model (About — "How We Think")
     A circular, continuously-cycling model rendered from
     window.BUSARA_THINKING. Six stages orbit a quiet logo
     silhouette; one is active at a time and the active stage
     auto-advances on a slow cycle. Hover / focus / click a stage
     to activate it and pause the cycle; it resumes after a short
     inactivity. Pure CSS transforms drive the motion; this only
     toggles classes and advances the active index. Keyboard:
     arrows move between stages. Reduced motion: no rotation, no
     auto-cycle — manual interaction and hierarchy are preserved.
     -------------------------------------------------------- */
  function initOrbit() {
    var host = document.querySelector('[data-orbit="thinking"]');
    if (!host) return;
    var data = window.BUSARA_THINKING;
    if (!Array.isArray(data) || !data.length) return;
    var n = data.length;

    host.innerHTML = '';
    var root = el('div', 'bl-orbit');
    var stage = el('div', 'bl-orbit__stage');
    stage.appendChild(el('div', 'bl-orbit__track'));
    var center = document.createElement('img');
    center.className = 'bl-orbit__center';
    center.src = 'assets/images/logo/busara-labs-mark.svg';
    center.setAttribute('alt', '');
    center.setAttribute('aria-hidden', 'true');
    stage.appendChild(center);
    var rotor = el('div', 'bl-orbit__rotor');
    stage.appendChild(rotor);

    var panel = el('aside', 'bl-orbit__panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('aria-label', 'How we think — current stage');

    root.appendChild(stage);
    root.appendChild(panel);
    host.appendChild(root);

    var nodes = [], connectors = [], active = 0;

    data.forEach(function (item, i) {
      var ang = (360 / n) * i;
      var con = el('div', 'bl-orbit__connector');
      con.style.setProperty('--a', ang + 'deg');
      rotor.appendChild(con);
      connectors.push(con);

      var pos = el('div', 'bl-orbit__pos');
      pos.style.setProperty('--a', ang + 'deg');
      var spin = el('div', 'bl-orbit__spin');
      var btn = el('button', 'bl-orbit__node');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
      btn.setAttribute('aria-label', item.title + ' — ' + item.role);
      btn.appendChild(el('span', 'bl-orbit__dot'));
      btn.appendChild(el('span', 'bl-orbit__name', item.title));
      spin.appendChild(btn);
      pos.appendChild(spin);
      rotor.appendChild(pos);
      nodes.push(btn);

      btn.addEventListener('mouseenter', function () { interact(i); });
      btn.addEventListener('focus', function () { interact(i); });
      btn.addEventListener('click', function () { interact(i); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nodes[(i + 1) % n].focus(); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); nodes[(i - 1 + n) % n].focus(); }
      });
    });

    function renderPanel(item) {
      panel.innerHTML = '';
      panel.appendChild(el('p', 'bl-vx__panel-eyebrow', 'Stage ' + item.id + ' \u00B7 How we think'));
      panel.appendChild(el('h3', 'bl-vx__panel-title', item.title));
      panel.appendChild(el('p', 'bl-vx__panel-role', item.role));
      panel.appendChild(el('p', 'bl-vx__purpose', item.purpose));
      var fields = el('div', 'bl-vx__fields');
      fields.appendChild(fieldList('Typical activities', item.activities));
      fields.appendChild(fieldText('Expected outputs', item.outputs));
      fields.appendChild(fieldText('Naturally leads to', item.leadsTo, true));
      panel.appendChild(fields);
    }
    function setActive(i) {
      active = i;
      nodes.forEach(function (b, k) {
        b.classList.toggle('is-active', k === i);
        b.setAttribute('aria-selected', k === i ? 'true' : 'false');
        b.setAttribute('tabindex', k === i ? '0' : '-1');
      });
      connectors.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      renderPanel(data[i]);
    }

    var timer = null, resume = null;
    function startCycle() {
      if (prefersReduced) return;
      stopCycle();
      timer = window.setInterval(function () { setActive((active + 1) % n); }, 7000);
    }
    function stopCycle() { if (timer) { window.clearInterval(timer); timer = null; } }
    function interact(i) {
      setActive(i);
      root.classList.add('is-paused');
      stopCycle();
      if (resume) window.clearTimeout(resume);
      resume = window.setTimeout(function () { root.classList.remove('is-paused'); startCycle(); }, 4500);
    }

    setActive(0);
    startCycle();

    // pause the cycle when the section scrolls out of view (battery / focus)
    if ('IntersectionObserver' in window && !prefersReduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { if (!root.classList.contains('is-paused')) startCycle(); }
          else stopCycle();
        });
      }, { threshold: 0.2 });
      io.observe(root);
    }
  }

  /* --------------------------------------------------------
     5.3e  Follow Busara Labs (Contact) + Research Journal.
     Both render from data files into a host; the social list
     shows only enabled platforms (clean outbound links, no
     embeds). Adding a platform or a journal entry = data only.
     -------------------------------------------------------- */
  function initSocial() {
    var host = document.querySelector('[data-social]');
    if (!host) return;
    var data = window.BUSARA_SOCIAL;
    if (!Array.isArray(data)) return;
    host.innerHTML = '';
    var list = el('div', 'bl-social');
    data.forEach(function (s) {
      if (!s.enabled || !s.url) return;
      var a = document.createElement('a');
      a.className = 'bl-social__link';
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.appendChild(el('span', 'bl-social__name', s.name));
      var right = el('span', 'bl-social__right');
      if (s.handle) right.appendChild(el('span', 'bl-social__handle', s.handle));
      right.appendChild(el('span', 'bl-social__arrow', '\u2197'));
      a.appendChild(right);
      list.appendChild(a);
    });
    host.appendChild(list);
  }

  function initJournal() {
    var host = document.querySelector('[data-journal]');
    if (!host) return;
    var data = window.BUSARA_JOURNAL;
    if (!Array.isArray(data) || !data.length) return;
    host.innerHTML = '';
    var wrap = el('div', 'bl-journal');
    data.forEach(function (e) {
      var art = document.createElement('article');
      art.className = 'bl-journal__entry';
      var meta = el('div', 'bl-journal__meta');
      meta.appendChild(el('span', 'bl-journal__num', 'Entry ' + e.id));
      meta.appendChild(el('span', 'bl-journal__status', e.status));
      if (e.date) meta.appendChild(el('span', 'bl-journal__date', e.date));
      art.appendChild(meta);
      art.appendChild(el('h2', 'bl-journal__stage', e.stage));
      if (e.theme) art.appendChild(el('p', 'bl-journal__theme', e.theme));
      var body = el('div', 'bl-journal__body');
      (e.body || []).forEach(function (p) { body.appendChild(el('p', null, p)); });
      art.appendChild(body);
      if (e.observations && e.observations.length) {
        var obs = el('div', 'bl-journal__obs');
        obs.appendChild(el('span', 'bl-journal__obs-label', e.observationsLabel || 'Observed'));
        var olist = el('ul', 'bl-journal__obs-list');
        e.observations.forEach(function (o) { olist.appendChild(el('li', null, o)); });
        obs.appendChild(olist);
        art.appendChild(obs);
      }
      if (e.outcome) {
        var out = el('div', 'bl-journal__outcome');
        out.appendChild(el('span', 'bl-journal__outcome-label', 'What it established'));
        out.appendChild(el('p', 'bl-journal__outcome-text', e.outcome));
        art.appendChild(out);
      }
      wrap.appendChild(art);
    });
    host.appendChild(wrap);
  }

  /* --------------------------------------------------------
     5.4a  Auto scroll-reveal targets
     Applied in JS (not markup) so the HTML stays lean and the
     site shows everything when JS is off. Skipped entirely
     under prefers-reduced-motion.
     -------------------------------------------------------- */
  function initAutoReveal() {
    if (prefersReduced) return;
    var sel = '.bl-section-header, .bl-prose, .bl-prose-dark,' +
      ' .bl-pull-quote, .bl-feature, .bl-value, .bl-cta-card,' +
      ' .bl-coming-soon-wrap, .bl-page-lede, .bl-founder, .bl-email-cta';
    document.querySelectorAll(sel).forEach(function (el) {
      // Hero content is handled by the entrance sequence — don't also
      // attach scroll-reveal to it (would double-bind opacity/transform).
      if (el.closest('.bl-hero, .bl-page-hero')) return;
      if (el.hasAttribute('data-enter')) return;
      el.classList.add('reveal-up');
    });
    // Stagger index: items inside a shared group cascade in sequence
    // rather than all arriving at once. Index drives a CSS
    // transition-delay via the --bl-i custom property.
    ['.bl-values', '.bl-elements', '.bl-footer__cols'].forEach(function (groupSel) {
      document.querySelectorAll(groupSel).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          child.style.setProperty('--bl-i', i);
        });
      });
    });
  }

  /* --------------------------------------------------------
     5.3c  Paamoja ecosystem (the four elements)
     A connected pipeline: HuruMarket → Duka → Tuma → e-pay.
     Hover / focus an element to bring it forward; upstream
     elements light their connector so the flow is legible.
     Progressive disclosure of each element's description is
     JS-gated, so no-JS shows every description in full.
     -------------------------------------------------------- */
  function initEcosystem() {
    document.querySelectorAll('.bl-elements').forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll('.bl-feature'));
      if (!items.length) return;

      var pinned = 0;
      items.forEach(function (item, i) {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-expanded', 'false');

        item.addEventListener('mouseenter', function () { setActive(i); });
        item.addEventListener('focus', function () { setActive(i); });
        item.addEventListener('click', function () { pinned = i; setActive(i); });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault(); items[Math.min(i + 1, items.length - 1)].focus();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault(); items[Math.max(i - 1, 0)].focus();
          }
        });
      });

      function setActive(idx) {
        items.forEach(function (item, i) {
          var on = i === idx;
          item.classList.toggle('is-active', on);
          // upstream elements (earlier in the pipeline) light their flow
          item.classList.toggle('is-flow', i <= idx);
          item.classList.toggle('is-dim', i > idx);
          item.setAttribute('aria-expanded', on ? 'true' : 'false');
        });
      }

      group.addEventListener('mouseleave', function () { setActive(pinned); });
      setActive(pinned);
    });
  }

  /* --------------------------------------------------------
     5.4d  Entrance sequence
     Hero content (eyebrow, headline, lede, CTA) rises in on
     first paint, staggered. Gated on .bl-js so a no-JS load
     shows everything; skipped under prefers-reduced-motion.
     -------------------------------------------------------- */
  function initEntrance() {
    var root = document.documentElement;
    if (prefersReduced) {
      root.classList.add('bl-loaded', 'bl-entered');
      return;
    }
    // double rAF so the animation's hidden start frame is committed
    // before .bl-loaded triggers it.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.add('bl-loaded');
      });
    });
    // Safety net: once every entrance animation has had time to finish
    // (longest delay ~390ms + 700ms run), force the visible end state so
    // above-the-fold content can never remain stranded at opacity 0.
    window.setTimeout(function () {
      root.classList.add('bl-entered');
    }, 1200);
  }

  /* --------------------------------------------------------
     GLOBAL reveal system.
     IntersectionObserver on .reveal-up / .reveal-fade adds
     .is-revealed. Same mechanism on every page — pages opt in
     by carrying (or being auto-tagged with) the semantic class.
     -------------------------------------------------------- */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal-up, .reveal-fade');
    if (!els.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------
     5.5  Email link hover
     CSS handles the letter-spacing expansion (.bl-email-link:hover);
     this is retained as a no-op hook for parity.
     -------------------------------------------------------- */

  /* --------------------------------------------------------
     5.6  Error tracking (non-PII)
     Console only. Never logs user input or emails.
     -------------------------------------------------------- */
  function initErrorTracking() {
    window.addEventListener('error', function (e) {
      try { console.error('[busaralabs] error:', e.message, 'at', e.filename + ':' + e.lineno); }
      catch (_) {}
    });
    window.addEventListener('unhandledrejection', function (e) {
      try { console.error('[busaralabs] unhandled rejection:', e.reason && e.reason.message ? e.reason.message : e.reason); }
      catch (_) {}
    });
  }

  /* -------------------------------------------------------- */
  function init() {
    initErrorTracking();
    initNavScroll();
    initMobileMenu();
    initAmbientNetwork();
    initVerticalExplorers();
    initOrbit();
    initSocial();
    initJournal();
    initEcosystem();
    initAutoReveal();
    initScrollReveal();
    initEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
