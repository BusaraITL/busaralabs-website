/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Build Script — Asset bundling and minification
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 9.2
   ============================================================
   Bundles and minifies all JS modules into a single output.
   Run with: node build.js
   Output:   assets/js/main.bundle.js
   ============================================================ */

const esbuild = require('esbuild');
const path    = require('path');
const fs      = require('fs');

// ============================================================
// CONFIG
// ============================================================
const SRC_ENTRY  = path.join(__dirname, 'src', 'js', 'main.js');
const OUT_FILE   = path.join(__dirname, 'assets', 'js', 'main.bundle.js');
const IS_DEV     = process.env.NODE_ENV === 'development';

// ============================================================
// PRE-BUILD: verify entry point exists
// ============================================================
if (!fs.existsSync(SRC_ENTRY)) {
  console.error(`ERROR: Entry point not found: ${SRC_ENTRY}`);
  console.error('Create src/js/main.js before running build.');
  process.exit(1);
}

// ============================================================
// BUILD
// ============================================================
esbuild.build({
  entryPoints: [SRC_ENTRY],
  outfile:     OUT_FILE,
  bundle:      true,
  minify:      !IS_DEV,
  sourcemap:   IS_DEV,      // Source maps in dev only — never production
  target:      ['es2022'],
  platform:    'browser',
  format:      'iife',      // Self-contained — no module loader required
  logLevel:    'info',
})
.then(() => {
  const stats = fs.statSync(OUT_FILE);
  const kb    = (stats.size / 1024).toFixed(1);
  console.log(`\nBuild complete:`);
  console.log(`  Output:  ${OUT_FILE}`);
  console.log(`  Size:    ${kb} KB`);

  // Warn if bundle exceeds 50KB target from spec
  if (stats.size > 51200) {
    console.warn(`  WARNING: Bundle exceeds 50KB target (${kb} KB).`);
    console.warn('  Review imports — canvas.js or large dependencies may be the cause.');
  } else {
    console.log(`  Status:  Within 50KB target ✓`);
  }
})
.catch((err) => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
