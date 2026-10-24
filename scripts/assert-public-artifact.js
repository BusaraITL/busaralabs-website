/* Allowlist for the Pages upload directory.
   A file is public only when its path matches this list.
   Case variants, encoded names, source maps, and operational
   directories fail closed because they are not on the list. */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_FILES = new Set([
  '_headers',
  '_redirects',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
]);

const ASSET_EXTENSIONS = new Set([
  '.css',
  '.js',
  '.png',
  '.svg',
  '.webp',
  '.ico',
  '.woff2',
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
      if (!allowedDirectory(rel)) {
        violations.push(rel + '/');
        continue;
      }
      walk(root, full, violations);
      continue;
    }
    if (!allowedFile(rel) || looksLikeKeyMaterial(full)) {
      violations.push(rel);
    }
  }
}

function allowedDirectory(rel) {
  const parts = segment(rel);
  if (!parts.length) return false;
  if (parts[0] === 'assets' || parts[0] === 'functions') {
    return parts.every((part) => safeSegment(part));
  }
  return false;
}

function allowedFile(rel) {
  const parts = segment(rel);
  if (!parts.length || parts.some((part) => !safeSegment(part))) return false;
  if (parts.length === 1) {
    const name = parts[0];
    if (ROOT_FILES.has(name)) return true;
    return name.endsWith('.html') && name === name.toLowerCase() && !name.includes('..');
  }
  const ext = path.extname(parts[parts.length - 1]).toLowerCase();
  if (ext === '.map') return false;
  if (parts[0] === 'assets') return ASSET_EXTENSIONS.has(ext);
  if (parts[0] === 'functions') return ext === '.js';
  return false;
}

function segment(rel) {
  return rel.split(path.sep).filter(Boolean);
}

function safeSegment(part) {
  if (!part || part === '.' || part === '..') return false;
  if (part.startsWith('.')) return false;
  const lower = normalizedSegment(part);
  if (lower.startsWith('.')) return false;
  if (lower === 'wrangler.toml' || lower === 'handover.md' || lower === 'package.json' || lower === 'package-lock.json' || lower === 'build.js' || lower === '_worker.js') {
    return false;
  }
  return true;
}

function normalizedSegment(part) {
  let value = part;
  for (let i = 0; i < 2; i += 1) {
    try {
      const next = decodeURIComponent(value);
      if (next === value) break;
      value = next;
    } catch {
      break;
    }
  }
  return value.toLowerCase();
}

function looksLikeKeyMaterial(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(256);
    const n = fs.readSync(fd, buf, 0, 256, 0);
    return buf.subarray(0, n).toString('utf8').includes('PRIVATE KEY');
  } catch {
    return true;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

module.exports = { assertPublicArtifact, allowedFile };

if (require.main === module) {
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'public'));
  assertPublicArtifact(root);
  console.log('Public artifact matches the allowlist.');
}
