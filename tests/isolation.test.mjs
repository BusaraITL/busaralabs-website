import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateResourceIsolation, RESOURCE_IDS } from '../functions/lib/resource-guard.js';
import { onRequestPost } from '../functions/api/contact.js';
import { processContactQueue } from '../workers/queue-consumer.js';
import worker from '../workers/_worker.js';
import { ENABLED_VALUE, PRODUCTION_ACK } from '../functions/lib/collection-gate.js';

function stagingBindings(overrides = {}) {
  return {
    ENVIRONMENT: 'staging',
    CORS_ORIGIN: 'https://staging.busaralabs.com',
    D1_DATABASE_ID: RESOURCE_IDS.staging.d1,
    KV_NAMESPACE_ID: RESOURCE_IDS.staging.kv,
    QUEUE_NAME: RESOURCE_IDS.staging.queue,
    COLLECTION_ENABLED: ENABLED_VALUE,
    TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
    QUEUE_ENCRYPTION_KEY: 'ab'.repeat(32),
    ...overrides,
  };
}

function productionBindings(overrides = {}) {
  return {
    ENVIRONMENT: 'production',
    CORS_ORIGIN: 'https://busaralabs.com',
    D1_DATABASE_ID: RESOURCE_IDS.production.d1,
    KV_NAMESPACE_ID: RESOURCE_IDS.production.kv,
    QUEUE_NAME: RESOURCE_IDS.production.queue,
    COLLECTION_ENABLED: ENABLED_VALUE,
    COLLECTION_PRODUCTION_ACK: PRODUCTION_ACK,
    ...overrides,
  };
}

function throwingRequest() {
  return new Request('https://staging.busaralabs.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'name=Ada',
  });
}

test('missing resource ids refuse staging and production', () => {
  assert.equal(evaluateResourceIsolation({ ENVIRONMENT: 'staging' }).ok, false);
  assert.equal(evaluateResourceIsolation({ ENVIRONMENT: 'production' }).reason, 'resource-ids-missing');
});

test('staging refuses when any identifier is a production identifier', () => {
  for (const overrides of [
    { D1_DATABASE_ID: RESOURCE_IDS.production.d1 },
    { KV_NAMESPACE_ID: RESOURCE_IDS.production.kv },
    { QUEUE_NAME: RESOURCE_IDS.production.queue },
    { CORS_ORIGIN: 'https://busaralabs.com' },
  ]) {
    const result = evaluateResourceIsolation(stagingBindings(overrides));
    assert.equal(result.ok, false, JSON.stringify(overrides));
    assert.equal(result.reason, 'non-production-bound-to-production');
    assert.equal(result.email, false);
    assert.equal(result.destructive, false);
  }
});

test('a matching staging config still cannot send mail or delete rows', () => {
  const result = evaluateResourceIsolation(stagingBindings());
  assert.equal(result.ok, true);
  assert.equal(result.email, false);
  assert.equal(result.destructive, false);
});

test('production cleanup is allowed only when every production identifier matches', () => {
  assert.equal(evaluateResourceIsolation(productionBindings()).destructive, true);
  const swapped = evaluateResourceIsolation(productionBindings({
    D1_DATABASE_ID: RESOURCE_IDS.staging.d1,
  }));
  assert.equal(swapped.destructive, false);
});

test('contact refuses a production database id before reading the body', async () => {
  let prepared = 0;
  const response = await onRequestPost({
    request: throwingRequest(),
    env: stagingBindings({
      D1_DATABASE_ID: RESOURCE_IDS.production.d1,
      DB: { prepare() { prepared += 1; throw new Error('db'); } },
    }),
  });
  assert.equal(response.status, 403);
  assert.equal(prepared, 0);
  const body = await response.json();
  assert.equal(JSON.stringify(body).includes('@'), false);
});

test('staging queue discards mail even when collection and staging ids are on', async () => {
  let reads = 0;
  let fetched = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    fetched += 1;
    throw new Error('sendgrid was called');
  };
  try {
    const result = await processContactQueue({
      queue: 'contact-staging',
      messages: [{
        get body() { reads += 1; return 'secret-body'; },
        ack() {},
        retry() { throw new Error('retry'); },
      }],
    }, stagingBindings(), {});
    assert.equal(result.reason, 'email-disabled');
    assert.equal(reads, 0);
    assert.equal(fetched, 0);
  } finally {
    globalThis.fetch = original;
  }
});

test('retention cleanup does not touch the database off production', async () => {
  let prepared = 0;
  const env = stagingBindings({
    DB: { prepare() { prepared += 1; throw new Error('db'); } },
  });
  let pending = null;
  await worker.scheduled({ cron: '0 2 * * *' }, env, {
    waitUntil(promise) { pending = promise; },
  });
  const result = await pending;
  assert.equal(result.deleted, false);
  assert.equal(prepared, 0);
});

test('retention cleanup does not run when production vars are missing', async () => {
  let prepared = 0;
  let pending = null;
  await worker.scheduled({ cron: '0 2 * * *' }, {
    ENVIRONMENT: 'production',
    DB: { prepare() { prepared += 1; throw new Error('db'); } },
  }, {
    waitUntil(promise) { pending = promise; },
  });
  const result = await pending;
  assert.equal(result.reason, 'resource-ids-missing');
  assert.equal(prepared, 0);
});
