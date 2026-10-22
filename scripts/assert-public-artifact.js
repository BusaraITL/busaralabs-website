/* Fail if the Pages output directory contains operational files.
   The deploy command uploads this directory as static files.
   Anything here is public. */

'use strict';

const fs = require('fs');
const path = require('path');

const BANNED_DIR_NAMES = new Set([
  'workers',
  'src',
  '.github',
  '.git',
  'keys',
  'node_modules',
  'docs',
  'scripts',
  'tests',
]);

const BANNED_BASENAMES = new Set([
  'wrangler.toml',
  'wrangler.worker.toml',
  'HANDOVER.md',
  'package.json',
  'package-lock.json',
  '.env',
  '.env.example',
  '.env.local',
  'secrets.json',
  'credentials.json',
]);

const BANNED_EXTENSIONS = new Set([
  '.md',
  '.pem',
  '.key',
  '.p12',
  '.pfx',
]);

function assertPublicArtifact(root) {
  const violations = [];
  if (!fs.existsSync(root)) {
    throw new Error('Public artifact directory does not exist: ' + root);
  }
  walk(root, root, violations);
  if (violations.length) {
    throw new Error('Public artifact contains non-public files:\n' + violations.join('\n'));
  }
  return violations;
}

function walk(root, dir, violations) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);
    if (entry.isDirectory()) {
      if (BANNED_DIR_NAMES.has(entry.name) || entry.name.startsWith('.env')) {
        violations.push(rel);
        continue;
      }
      walk(root, full, violations);
      continue;
    }
    const lower = entry.name.toLowerCase();
    if (
      BANNED_BASENAMES.has(entry.name) ||
      BANNED_EXTENSIONS.has(path.extname(lower)) ||
      lower.startsWith('.env')
    ) {
      violations.push(rel);
      continue;
    }
    if (looksLikeKeyMaterial(full)) violations.push(rel + ' (key material)');
  }
}

function looksLikeKeyMaterial(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(256);
    const n = fs.readSync(fd, buf, 0, 256, 0);
    return buf.subarray(0, n).toString('utf8').includes('PRIVATE KEY');
  } finally {
    fs.closeSync(fd);
  }
}

module.exports = { assertPublicArtifact };

if (require.main === module) {
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'public'));
  assertPublicArtifact(root);
  console.log('Public artifact contains only publishable files.');
}
