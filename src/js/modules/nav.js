/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Navigation Module — Sticky header, mobile menu, active links
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2
   ============================================================ */

'use strict';

// ── CONSTANTS ────────────────────────────────────────────────
const SCROLL_THRESHOLD = 20;   // px before header becomes sticky
const NAV_SELECTOR     = '.site-nav';
const TOGGLE_SELECTOR  = '.nav-toggle';
const MENU_SELECTOR    = '.nav-menu';
const ACTIVE_CLASS     = 'nav--scrolled';
const OPEN_CLASS       = 'nav-menu--open';
const TOGGLE_OPEN      = 'nav-toggle--open';

// ── INIT ─────────────────────────────────────────────────────
export function initNav() {
  const nav    = document.querySelector(NAV_SELECTOR);
  const toggle = document.querySelector(TOGGLE_SELECTOR);
  const menu   = document.querySelector(MENU_SELECTOR);

  if (!nav) return;

  // Sticky header on scroll
  const onScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add(ACTIVE_CLASS);
    } else {
      nav.classList.remove(ACTIVE_CLASS);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load in case page is already scrolled

  // Mobile hamburger toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle(OPEN_CLASS);
      toggle.classList.toggle(TOGGLE_OPEN, isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && menu.classList.contains(OPEN_CLASS)) {
        menu.classList.remove(OPEN_CLASS);
        toggle.classList.remove(TOGGLE_OPEN);
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains(OPEN_CLASS)) {
        menu.classList.remove(OPEN_CLASS);
        toggle.classList.remove(TOGGLE_OPEN);
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // Active link highlighting
  highlightActiveLink();
}

function highlightActiveLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const links = document.querySelectorAll('.nav-menu a[href]');

  links.forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    const isActive = href === currentPath ||
      (href !== '/' && currentPath.startsWith(href));

    link.classList.toggle('nav-link--active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    }
  });
}
