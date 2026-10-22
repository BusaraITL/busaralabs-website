import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateCollectionGate, ENABLED_VALUE, PRODUCTION_ACK } from '../functions/lib/collection-gate.js';
import { onRequestPost, onRequestOptions } from '../functions/api/contact.js';
import { processContactQueue } from '../workers/queue-consumer.js';

function throwingRequest() {
  return {
    method: 'POST',
    headers: {
      get(name) {
        return String(name).toLowerCase() === 'content-type'
          ? 'application/x-www-form-urlencoded'
          : null;
      },
    },
    formData() {
      throw new Error('body was read');
    },
  };
}

function dbThatMustNotRun() {
  return {
    prepare() {
      throw new Error('database was used');
    },
  };
}

test('missing, empty, and lookalike flags stay disabled', () => {
  for (const flag of [undefined, '', 'true', '1', 'yes', 'ON', 'On', 'on ', ' enabled']) {
    const env = flag === undefined ? {} : { COLLECTION_ENABLED: flag, ENVIRONMENT: 'staging' };
    const gate = evaluateCollectionGate(env);
    assert.equal(gate.allowed, false, JSON.stringify(flag));
    assert.equal(gate.reason, 'missing-or-invalid-flag');
  }
});

test('production cannot activate on the flag alone', () => {
  const gate = evaluateCollectionGate({
    COLLECTION_ENABLED: ENABLED_VALUE,
    ENVIRONMENT: 'production',
  });
  assert.equal(gate.allowed, false);
  assert.equal(gate.reason, 'production-not-acknowledged');

  const wrong = evaluateCollectionGate({
    COLLECTION_ENABLED: ENABLED_VALUE,
    ENVIRONMENT: 'production',
    COLLECTION_PRODUCTION_ACK: 'yes',
  });
  assert.equal(wrong.allowed, false);
});

test('an unknown or missing environment stays disabled even when the flag is on', () => {
  for (const environment of ['', 'prod', 'development', 'PRODUCTION']) {
    const gate = evaluateCollectionGate({
      COLLECTION_ENABLED: ENABLED_VALUE,
      ENVIRONMENT: environment,
    });
    assert.equal(gate.allowed, false, environment);
    assert.equal(gate.reason, 'unknown-environment');
  }
  assert.equal(evaluateCollectionGate({ COLLECTION_ENABLED: ENABLED_VALUE }).allowed, false);
});

test('staging and preview allow only the exact flag, and production needs the acknowledgement', () => {
  assert.equal(evaluateCollectionGate({
    COLLECTION_ENABLED: ENABLED_VALUE,
    ENVIRONMENT: 'staging',
  }).allowed, true);
  assert.equal(evaluateCollectionGate({
    COLLECTION_ENABLED: ENABLED_VALUE,
    ENVIRONMENT: 'preview',
  }).allowed, true);
  assert.equal(evaluateCollectionGate({
    COLLECTION_ENABLED: ENABLED_VALUE,
    ENVIRONMENT: 'production',
    COLLECTION_PRODUCTION_ACK: PRODUCTION_ACK,
  }).allowed, true);
});

test('POST and OPTIONS reject before the body or database is touched', async () => {
  const env = { DB: dbThatMustNotRun(), COLLECTION_ENABLED: 'true', ENVIRONMENT: 'production' };
  const post = await onRequestPost({ request: throwingRequest(), env });
  const options = await onRequestOptions({ request: throwingRequest(), env });
  assert.equal(post.status, 403);
  assert.equal(options.status, 403);
  const body = await post.json();
  assert.equal(body.success, false);
  assert.match(body.error, /disabled/i);
  assert.equal(JSON.stringify(body).includes('@'), false);
  assert.equal(post.headers.get('Cache-Control'), 'no-store');
});

test('the queue consumer acks without reading payloads while disabled', async () => {
  let reads = 0;
  let acked = 0;
  let fetched = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    fetched += 1;
    throw new Error('fetch was called');
  };
  try {
    const message = {
      get body() {
        reads += 1;
        return 'payload-secret';
      },
      ack() { acked += 1; },
      retry() { throw new Error('retry'); },
    };
    const result = await processContactQueue({
      queue: 'contact-production',
      messages: [message],
    }, { ENVIRONMENT: 'production' }, {});
    assert.equal(result.discarded, 1);
    assert.equal(reads, 0);
    assert.equal(acked, 1);
    assert.equal(fetched, 0);
  } finally {
    globalThis.fetch = original;
  }
});
