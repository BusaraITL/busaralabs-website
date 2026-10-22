import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { onRequestPost } from '../functions/api/contact.js';
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

test('the public artifact guard rejects operational files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html>');
  assert.doesNotThrow(() => assertPublicArtifact(dir));
  for (const name of ['wrangler.toml', 'HANDOVER.md', 'notes.md', '.env', 'secret.pem']) {
    const nested = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
    fs.writeFileSync(path.join(nested, name), 'x');
    assert.throws(() => assertPublicArtifact(nested), /non-public/, name);
  }
  const workers = fs.mkdtempSync(path.join(os.tmpdir(), 'busara-public-'));
  fs.mkdirSync(path.join(workers, 'workers'));
  assert.throws(() => assertPublicArtifact(workers), /workers/);
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

test('no admin function is exported', () => {
  const api = path.join(process.cwd(), 'functions', 'api');
  const files = fs.readdirSync(api);
  assert.deepEqual(files, ['contact.js']);
});
