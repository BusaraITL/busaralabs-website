v/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   UI Module — Hero section, scroll animations, UI interactions
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2
   ============================================================ */

'use strict';

// ── INIT ─────────────────────────────────────────────────────
export function initUI() {
  initScrollAnimations();
  initHeroParallax();
  initSmoothScroll();
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────────
// Fade-in elements as they enter the viewport.
// Uses IntersectionObserver for performance — no scroll listeners.
function initScrollAnimations() {
  const ANIMATE_CLASS  = 'animate-on-scroll';
  const VISIBLE_CLASS  = 'is-visible';

  const elements = document.querySelectorAll(`.${ANIMATE_CLASS}`);
  if (!elements.length) return;

  // Graceful degradation — if IntersectionObserver not available,
  // make all elements visible immediately
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add(VISIBLE_CLASS));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(VISIBLE_CLASS);
        // Unobserve after animating — no need to watch further
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,      // Trigger when 10% visible
    rootMargin: '0px 0px -40px 0px',  // Slight offset from bottom
  });

  elements.forEach(el => observer.observe(el));
}

// ── HERO PARALLAX ─────────────────────────────────────────────
// Subtle parallax on hero section — disabled on mobile for performance.
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Skip on mobile — saves battery and avoids jank on small screens
  if (window.innerWidth < 768) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    // Move hero content at 30% of scroll speed for depth effect
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────
// Smooth scroll for anchor links — respects prefers-reduced-motion.
function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update URL without triggering scroll
    history.pushState(null, '', `#${targetId}`);
  });
}
