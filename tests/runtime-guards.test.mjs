import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { onRequestDelete, onRequestGet, onRequestOptions, onRequestPost, onRequestPut } from '../functions/api/contact.js';

import { evaluateAbuseControls } from '../functions/lib/abuse-controls.js';
import { ENABLED_VALUE } from '../functions/lib/collection-gate.js';
import { RESOURCE_IDS } from '../functions/lib/resource-guard.js';

const { assertPublicArtifact } = createRequire(import.meta.url)('../scripts/assert-public-artifact.js');

function readyEnv(overrides = {}) {
  return {
    ENVIRONMENT: 'staging',
    CORS_ORIGIN: 'https://staging.busaralabs.com',
    D1_DATABASE_ID: RESOURCE_IDS.staging.d1,
    KV_NAMESPACE_ID: RESOURCE_IDS.staging.kv,
    QUEUE_NAME: RESOURCE_IDS.staging.queue,
    COLLECTION_ENABLED: ENABLED_VALUE,
    TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
    QUEUE_ENCRYPTION_KEY: 'ab'.repeat(32),
    RATE_LIMIT_KV: {
      async get() { return null; },
      async put() {},
    },
    DB: {
      prepare() {
        throw new Error('database was used');
      },
    },
    ...overrides,
  };
}

function formRequest() {
  return new Request('https://staging.busaralabs.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Synthetic message used only by the local test.',
      consent: 'agreed',
      'cf-turnstile-response': 'synthetic-token',
      consent_timestamp: '2026-10-22T00:00:00.000Z',
    }),
  });
}

test('a missing Turnstile secret refuses before the body is stored', async () => {
  let prepared = 0;
  const response = await onRequestPost({
    request: formRequest(),
    env: readyEnv({
      TURNSTILE_SECRET_KEY: '',
      DB: { prepare() { prepared += 1; } },
    }),
  });
  assert.equal(response.status, 403);
  assert.equal(prepared, 0);
});

test('a failed KV read fails closed and does not insert', async () => {
  let prepared = 0;
  const response = await onRequestPost({
    request: formRequest(),
    env: readyEnv({
      RATE_LIMIT_KV: { async get() { throw new Error('kv unavailable'); } },
      DB: { prepare() { prepared += 1; throw new Error('db'); } },
    }),
  });
  assert.equal(response.status, 429);
  assert.equal(prepared, 0);
  const body = await response.json();
  assert.equal(JSON.stringify(body).includes('ada@example.com'), false);
  assert.equal(JSON.stringify(body).includes('kv unavailable'), false);
});

test('a failed Turnstile check does not insert or echo the message', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ success: false }), { status: 200 });
  try {
    let prepared = 0;
    const response = await onRequestPost({
      request: formRequest(),
      env: readyEnv({
        DB: { prepare() { prepared += 1; throw new Error('db'); } },
      }),
    });
    assert.equal(response.status, 400);
    assert.equal(prepared, 0);
    const body = await response.json();
    assert.equal(body.field, 'turnstile');
    assert.equal(JSON.stringify(body).includes('Synthetic message'), false);
  } finally {
    globalThis.fetch = original;
  }
});

test('an accepted submission does not return the address or the row id', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ success: true }), { status: 200 });
  let sent = 0;
  try {
    const response = await onRequestPost({
      request: formRequest(),
      env: readyEnv({
        DB: {
          prepare() {
            return {
              bind() {
                return { async run() { return { meta: { last_row_id: 42 } }; } };
              },
            };
          },
        },
        CONTACT_QUEUE: { async send() { sent += 1; } },
      }),
    });
    assert.equal(response.status, 200);
    assert.equal(sent, 1);
    const body = await response.json();
    assert.equal(body.messageId, undefined);
    assert.equal(JSON.stringify(body).includes('ada@example.com'), false);
    assert.equal(JSON.stringify(body).includes('42'), false);
  } finally {
    globalThis.fetch = original;
  }
});

test('the built public directory passes the artifact guard', () => {
  assertPublicArtifact(path.join(process.cwd(), 'public'));
});

test('the public artifact guard is an allowlist', () => {
  const rejected = [
    'wrangler.toml',
    'WRANGLER.TOML',
    'Handover.md',
    'HANDOVER.md',
    'package.json',
    'package-lock.json',
    'build.js',
    'notes.md',
    '.env',
    'secret.pem',
    'app.js.map',
  ];
  for (const name of rejected) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
    fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html>');
    fs.writeFileSync(path.join(dir, name), 'x');
    assert.throws(() => assertPublicArtifact(dir), /non-public/, name);
  }
  for (const nested of ['workers/wrangler.toml', 'wrangler%2etoml', 'wrangler%252etoml', 'functions/_worker.js', '.git/HEAD', 'node_modules/pkg/index.js', 'docs/security/GATES.md', 'scripts/build.js', 'assets/js/main.js.map']) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
    fs.mkdirSync(path.join(dir, path.dirname(nested)), { recursive: true });
    fs.writeFileSync(path.join(dir, nested), 'x');
    assert.throws(() => assertPublicArtifact(dir), /non-public/, nested);
  }
});

test('the built headers allow only self-hosted scripts and do not noindex production', () => {
  const headers = fs.readFileSync(path.join(process.cwd(), 'public', '_headers'), 'utf8');
  assert.match(headers, /script-src 'self'/);
  assert.doesNotMatch(headers, /unsafe-inline/);
  assert.match(headers, /Strict-Transport-Security:/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /Referrer-Policy:/);
  assert.match(headers, /Permissions-Policy:/);
  const directives = headers.split('\n').filter((line) => /^\s+\S/.test(line) && !line.trim().startsWith('#'));
  assert.equal(directives.some((line) => line.includes('X-Robots-Tag')), false);
});

test('the candidate handler has no production fallback and does not name Postmark', () => {
  const contact = fs.readFileSync(new URL('../functions/api/contact.js', import.meta.url), 'utf8');
  const consumer = fs.readFileSync(new URL('../workers/queue-consumer.js', import.meta.url), 'utf8');
  assert.equal(contact.includes("|| 'production'"), false);
  assert.equal(contact.includes('|| "production"'), false);
  assert.equal(/POSTMARK/i.test(contact), false);
  assert.equal(/POSTMARK/i.test(consumer), false);
  assert.equal(onRequestPut().status, 405);
  assert.equal(onRequestDelete().status, 405);
  assert.equal(onRequestGet().status, 405);
});

test('a disabled contact path does not call the network', async () => {
  const original = globalThis.fetch;
  let fetches = 0;
  globalThis.fetch = async () => {
    fetches += 1;
    throw new Error('outbound');
  };
  try {
    const request = new Request('https://staging.busaralabs.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'name=Ada',
    });
    const response = await onRequestPost({
      request,
      env: { DB: { prepare() { throw new Error('db'); } }, CONTACT_QUEUE: { send() { throw new Error('queue'); } } },
    });
    assert.equal(response.status, 403);
    assert.equal(fetches, 0);
    const options = await onRequestOptions({ request, env: {} });
    assert.equal(options.status, 403);
    assert.equal(fetches, 0);
  } finally {
    globalThis.fetch = original;
  }
});

test('the workflow cannot fall back to a shared Cloudflare secret or a production URL', () => {
  const workflow = fs.readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /permissions:\n {2}contents: read/);
  assert.equal(workflow.includes('pull_request_target'), false);
  assert.equal(workflow.includes('secrets.CLOUDFLARE_API_TOKEN'), false);
  assert.equal(workflow.includes('secrets.CLOUDFLARE_ACCOUNT_ID'), false);
  assert.match(workflow, /secrets\.STAGING_CLOUDFLARE_API_TOKEN/);
  assert.match(workflow, /secrets\.PRODUCTION_CLOUDFLARE_API_TOKEN/);
  assert.equal(workflow.includes('pages deploy .'), false);
  assert.equal(workflow.includes('grep "Production"'), false);
  assert.equal(/uses: [^@\n]+@v\d/.test(workflow), false);
  assert.match(workflow, /actions\/checkout@11d5960a326750d5838078e36cf38b85af677262/);
  assert.match(workflow, /cloudflare\/wrangler-action@9acf94ace14e7dc412b076f2c5c20b8ce93c79cd/);
});

test('a closed contact endpoint is still rate limited without reading the body', async () => {
  let reads = 0;
  const request = new Request('https://staging.busaralabs.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'cf-connecting-ip': '203.0.113.10' },
    body: 'name=Ada',
  });
  const env = readyEnv({
    COLLECTION_ENABLED: '',
    RATE_LIMIT_IP_MAX: '1',
    RATE_LIMIT_KV: {
      async get() { return '1'; },
      async put() { throw new Error('should not increment when already limited'); },
    },
  });
  const verdict = await evaluateAbuseControls(request, env);
  assert.equal(verdict.status, 429);
  const response = await onRequestPost({
    request: {
      headers: request.headers,
      formData() { reads += 1; throw new Error('body was read'); },
    },
    env,
  });
  assert.equal(response.status, 429);
  assert.equal(reads, 0);
  const body = await response.json();
  assert.equal(JSON.stringify(body).includes('203.0.113.10'), false);
});

test('an oversized body is refused before the kill switch reads it', async () => {
  let reads = 0;
  const response = await onRequestPost({
    request: {
      headers: new Headers({ 'content-length': '9000' }),
      formData() { reads += 1; throw new Error('body was read'); },
    },
    env: { COLLECTION_ENABLED: '' },
  });
  assert.equal(response.status, 413);
  assert.equal(reads, 0);
});

test('options is rate limited while collection is off', async () => {
  const response = await onRequestOptions({
    request: {
      headers: new Headers({ 'cf-connecting-ip': '203.0.113.11' }),
    },
    env: readyEnv({
      COLLECTION_ENABLED: '',
      RATE_LIMIT_IP_MAX: '1',
      RATE_LIMIT_KV: {
        async get() { return '5'; },
        async put() { throw new Error('no write'); },
      },
    }),
  });
  assert.equal(response.status, 429);
});

test('get is not an admin or collection method', async () => {
  const response = onRequestGet();
  assert.equal(response.status, 405);
  assert.equal(JSON.stringify(await response.json()).includes('@'), false);
});

test('release config cannot deploy the repository root or enable collection', () => {
  const { assertReleaseSafe } = createRequire(import.meta.url)('../scripts/assert-release-safe.js');
  assert.doesNotThrow(() => assertReleaseSafe(process.cwd()));
  const preview = fs.readFileSync(path.join(process.cwd(), 'wrangler.toml'), 'utf8').split('[env.production]')[0];
  assert.equal(preview.includes('27a86a12-f597-4a23-9835-ee4f3e889185'), false);
  assert.equal(preview.includes('contact-production'), false);
});

test('no admin function is exported', () => {
  const api = path.join(process.cwd(), 'functions', 'api');
  const files = fs.readdirSync(api);
  assert.deepEqual(files, ['contact.js']);
});
