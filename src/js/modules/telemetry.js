/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Telemetry Module — Client-side error tracking
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2
   ============================================================
   ODPC COMPLIANCE (Kenya DPA 2019):
   - § 49: No personal data in error reports
   - § 49: No user identifiers, no IP capture client-side
   - Beacon API — async, non-blocking, does not delay page
   - Sample rate controls volume — avoids overwhelming logs

   Captures:
   - Unhandled JS errors (type, message, file, line)
   - Unhandled promise rejections
   - Performance timing (page load metrics)
   Does NOT capture:
   - User input values
   - Form data
   - URL query parameters (may contain personal data)
   ============================================================ */

'use strict';

// ── CONFIG ────────────────────────────────────────────────────
const SAMPLE_RATE    = 0.1;   // Capture 10% of errors — avoids log flood
const BEACON_TIMEOUT = 3000;  // Abandon beacon after 3s

// ── INIT ─────────────────────────────────────────────────────
export function initTelemetry() {
  // Only initialise in production — no telemetry noise in dev
  if (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1') {
    return;
  }

  // Unhandled JS errors
  window.addEventListener('error', (e) => {
    if (Math.random() > SAMPLE_RATE) return;
    capture({
      type    : 'js_error',
      message : sanitise(e.message),
      source  : sanitise(e.filename),
      line    : e.lineno,
      col     : e.colno,
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    if (Math.random() > SAMPLE_RATE) return;
    const reason = e.reason instanceof Error
      ? e.reason.message
      : String(e.reason);
    capture({
      type    : 'unhandled_rejection',
      message : sanitise(reason),
    });
  });

  // Page load performance — send after load completes
  window.addEventListener('load', () => {
    // Use setTimeout to let the browser finish painting first
    setTimeout(() => capturePerformance(), 0);
  });
}

// ── CAPTURE ───────────────────────────────────────────────────
function capture(payload) {
  const data = {
    ...payload,
    page      : sanitisePath(window.location.pathname), // path only — no query params
    timestamp : new Date().toISOString(),
    ua_class  : classifyUA(),  // Browser family only — not full UA string
  };

  // Use Beacon API — fire-and-forget, does not block navigation
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      '/api/telemetry',
      JSON.stringify(data)
    );
  }
}

// ── PERFORMANCE ───────────────────────────────────────────────
function capturePerformance() {
  if (!window.performance || !window.performance.timing) return;

  const t   = window.performance.timing;
  const nav = window.performance.getEntriesByType('navigation')[0];

  // Use Navigation Timing API v2 if available, fallback to v1
  const metrics = nav ? {
    ttfb      : Math.round(nav.responseStart - nav.requestStart),
    domLoad   : Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    pageLoad  : Math.round(nav.loadEventEnd - nav.startTime),
  } : {
    ttfb      : t.responseStart - t.navigationStart,
    domLoad   : t.domContentLoadedEventEnd - t.navigationStart,
    pageLoad  : t.loadEventEnd - t.navigationStart,
  };

  // Only capture if metrics are valid positive numbers
  if (metrics.pageLoad > 0 && metrics.pageLoad < 60000) {
    capture({ type: 'performance', ...metrics });
  }
}

// ── SANITISATION ──────────────────────────────────────────────
// Strip anything that could identify a user from error data.
function sanitise(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\w.-]+@[\w.-]+\.[a-z]{2,}/gi, '[email]')  // email addresses
    .replace(/\b\d{10,}\b/g, '[id]')                      // long numeric IDs
    .slice(0, 200);
}

function sanitisePath(path) {
  // Return path only — never query string or hash (may contain tokens)
  return (path || '/').split('?')[0].split('#')[0].slice(0, 100);
}

function classifyUA() {
  const ua = navigator.userAgent;
  if (/Chrome/.test(ua))  return 'chrome';
  if (/Firefox/.test(ua)) return 'firefox';
  if (/Safari/.test(ua))  return 'safari';
  if (/Edge/.test(ua))    return 'edge';
  return 'other';
}
