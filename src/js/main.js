/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Main Entry Point — Module initialisation
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2
   ============================================================
   This file is the esbuild entry point.
   Output: assets/js/main.bundle.js (minified, <50KB target)

   Initialisation order:
   1. Telemetry — captures errors from all subsequent modules
   2. Nav       — sticky header, mobile menu
   3. UI        — scroll animations, parallax, smooth scroll
   4. Canvas    — hero background animation
   5. Form      — contact form validation and submission
   ============================================================ */

'use strict';

import { initTelemetry } from './modules/telemetry.js';
import { initNav }       from './modules/nav.js';
import { initUI }        from './modules/ui.js';
import { initCanvas }    from './modules/canvas.js';
import { initForm }      from './modules/form.js';

// ── BOOT ──────────────────────────────────────────────────────
// Initialise telemetry first so subsequent errors are captured.
// All other modules initialise after DOM is ready.
initTelemetry();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  // DOM already parsed (script loaded with defer or at end of body)
  boot();
}

function boot() {
  initNav();
  initUI();
  initCanvas();
  initForm();
}
