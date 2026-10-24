import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { onRequestGet, onRequestOptions, onRequestPost } from '../functions/api/contact.js';
import { processContactQueue } from '../workers/queue-consumer.js';

const require = createRequire(import.meta.url);
const { assertPublicArtifact, allowedFile } = require('../scripts/assert-public-artifact.js');
const ROOT = path.join(import.meta.dirname, '..');

function throwingRequest() {
  let reads = 0;
  return {
    reads: () => reads,
    headers: { get() { reads += 1; return ''; } },
    formData() { reads += 1; throw new Error('body'); },
    text() { reads += 1; throw new Error('body'); },
    json() { reads += 1; throw new Error('body'); },
    arrayBuffer() { reads += 1; throw new Error('body'); },
  };
}

test('the allowlist rejects internal files, encoded names, and a worker entry', () => {
  const rejected = [
    'wrangler.toml',
    'WRANGLER.TOML',
    'wrangler%2etoml',
    'wrangler%252etoml',
    'Handover.md',
    'HANDOVER.md',
    'package.json',
    'package-lock.json',
    'build.js',
    'app.js.map',
    '.env',
    '%2eenv',
    'functions/_worker.js',
    'assets/js/main.js.map',
    'workers/_worker.js',
    '.git/HEAD',
    'node_modules/pkg/index.js',
    'docs/security/GATES.md',
    'scripts/publish-public.js',
  ];
  for (const name of rejected) {
    assert.equal(allowedFile(name), false, name);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
    fs.mkdirSync(path.join(dir, path.dirname(name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), 'not-a-secret');
    fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html>');
    assert.throws(() => assertPublicArtifact(dir), /non-public/, name);
  }
});

test('publish copies an allowlist and cannot use the repository root', () => {
  const source = fs.readFileSync(path.join(ROOT, 'scripts', 'publish-public.js'), 'utf8');
  assert.equal(source.includes('cpSync(ROOT'), false);
  assert.match(source, /Refusing to publish the repository root/);
  const result = spawnSync(process.execPath, ['scripts/publish-public.js'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const out = path.join(ROOT, 'public');
  assert.notEqual(path.resolve(out), path.resolve(ROOT));
  for (const name of [
    'wrangler.toml', 'HANDOVER.md', 'package.json', 'package-lock.json', 'build.js',
    'workers', 'node_modules', '.git', 'docs', 'scripts', 'src',
  ]) {
    assert.equal(fs.existsSync(path.join(out, name)), false, name);
  }
  assert.equal(fs.existsSync(path.join(out, 'functions', '_worker.js')), false);
  assert.equal(fs.existsSync(path.join(out, 'functions', 'api', 'contact.js')), true);
  const leaked = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.map') || entry.name.toLowerCase() === 'wrangler.toml') leaked.push(full);
    }
  }
  walk(out);
  assert.deepEqual(leaked, []);
  assertPublicArtifact(out);
});

test('contact POST, OPTIONS, and the queue refuse before any read, store, or email', async () => {
  const original = globalThis.fetch;
  let fetches = 0;
  globalThis.fetch = async () => {
    fetches += 1;
    throw new Error('outbound');
  };
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.push(args);
  console.error = (...args) => logs.push(args);
  try {
    const sinks = {
      DB: { prepare() { throw new Error('db'); } },
      CONTACT_QUEUE: { send() { throw new Error('queue'); } },
      RATE_LIMIT_KV: { get() { throw new Error('kv'); }, put() { throw new Error('kv'); } },
    };
    for (const env of [
      {},
      { COLLECTION_ENABLED: 'true', ENVIRONMENT: 'production' },
      { COLLECTION_ENABLED: 'on', ENVIRONMENT: 'production' },
      { COLLECTION_ENABLED: 'on', ENVIRONMENT: 'development' },
      { COLLECTION_ENABLED: 'on' },
      { ...sinks },
    ]) {
      const request = throwingRequest();
      const post = await onRequestPost({ request, env });
      const options = await onRequestOptions({ request, env });
      assert.equal(post.status, 403);
      assert.equal(options.status, 403);
      assert.equal(post.headers.get('cache-control'), 'no-store');
      assert.equal(request.reads(), 0);
      const text = await post.text();
      assert.equal(text.includes('@'), false);
      assert.match(text, /Collection is disabled/);
    }
    const get = onRequestGet();
    assert.equal(get.status, 405);
    const message = {
      get body() { throw new Error('payload read'); },
      ack() { this.acked = true; },
      retry() { throw new Error('retry'); },
    };
    const discarded = await processContactQueue(
      { messages: [message], queue: 'contact-staging' },
      sinksSafe(),
      {},
    );
    assert.equal(discarded.discarded, 1);
    assert.equal(message.acked, true);
    assert.equal(fetches, 0);
    const flat = JSON.stringify(logs);
    assert.equal(flat.includes('payload read'), false);
    assert.equal(flat.includes('@'), false);
  } finally {
    globalThis.fetch = original;
    console.log = originalLog;
    console.error = originalError;
  }
});

function sinksSafe() {
  return {
    DB: { prepare() { throw new Error('db'); } },
    CONTACT_QUEUE: { send() { throw new Error('queue'); } },
  };
}

test('no alternate handler export accepts a submission while the gate is closed', () => {
  const contact = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'contact.js'), 'utf8');
  assert.equal(contact.includes("|| 'production'"), false);
  assert.equal(contact.includes('|| "production"'), false);
  assert.equal(contact.includes('https://busaralabs.com'), false);
  assert.equal(/POSTMARK/i.test(contact), false);
  assert.equal(/err\.message/.test(contact), false);
  const consumer = fs.readFileSync(path.join(ROOT, 'workers', 'queue-consumer.js'), 'utf8');
  assert.match(consumer, /evaluateCollectionGate/);
  assert.equal(/POSTMARK/i.test(consumer), false);
  const moduleSource = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'contact.js'), 'utf8');
  assert.equal(moduleSource.includes('export function onRequestPut'), false);
  assert.equal(moduleSource.includes('export function onRequestDelete'), false);
  assert.equal(moduleSource.includes('export async function onRequestPut'), false);
});

test('package and workflow cannot upload the repository root or the first pages.dev URL', () => {
  const pkg = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
  assert.equal(pkg.includes('pages deploy .'), false);
  assert.equal(pkg.includes('pages dev .'), false);
  assert.match(pkg, /wrangler pages deploy public/);
  const workflow = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8');
  assert.equal(workflow.includes('pages deploy .'), false);
  assert.equal(workflow.includes('pages deployment list'), false);
  assert.equal(workflow.includes('grep "Production"'), false);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /https:\/\/staging\.busaralabs\.com\/wrangler\.toml/);
  assert.match(workflow, /https:\/\/busaralabs\.com\/wrangler\.toml/);
  assert.match(workflow, /secrets\.CLOUDFLARE_API_TOKEN/);
  assert.equal(workflow.includes('secrets.STAGING_CLOUDFLARE_API_TOKEN'), false);
});
