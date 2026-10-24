/* Resource isolation gate.
   Workers cannot read the Cloudflare binding id from env.DB.
   D1_DATABASE_ID, KV_NAMESPACE_ID, and QUEUE_NAME are plain
   vars that must match the binding block in wrangler.toml.
   A dashboard binding that disagrees with these vars is not
   detectable here. That case stays an operator check.

   Non-production never receives email or destructive cleanup.
   Production cleanup runs only when all three vars match the
   production identifiers. Missing vars refuse every side effect.
*/

'use strict';

export const RESOURCE_IDS = {
  production: {
    d1: '27a86a12-f597-4a23-9835-ee4f3e889185',
    kv: 'e0f93da5591d40d3938b6c938e7c8d2a',
    queue: 'contact-production',
  },
  staging: {
    d1: '0bf0fbac-152e-4427-9f1a-47e4873d23db',
    kv: '9133b26c873640f7af02b15e8b9a54a8',
    queue: 'contact-staging',
  },
};

const PRODUCTION_ORIGINS = new Set([
  'https://busaralabs.com',
  'https://www.busaralabs.com',
]);

const STAGING_ORIGINS = new Set([
  'https://staging.busaralabs.com',
]);

function text(value) {
  return typeof value === 'string' ? value : '';
}

export function evaluateResourceIsolation(env) {
  const source = env && typeof env === 'object' ? env : {};
  const environment = text(source.ENVIRONMENT);
  const d1 = text(source.D1_DATABASE_ID);
  const kv = text(source.KV_NAMESPACE_ID);
  const queue = text(source.QUEUE_NAME);
  const origin = text(source.CORS_ORIGIN);
  const prod = RESOURCE_IDS.production;
  const stage = RESOURCE_IDS.staging;

  if (!d1 || !kv || !queue) {
    return refuse('resource-ids-missing');
  }

  const usesProduction = d1 === prod.d1 || kv === prod.kv || queue === prod.queue;

  if (environment === 'production') {
    const match = d1 === prod.d1 && kv === prod.kv && queue === prod.queue;
    if (!match || !PRODUCTION_ORIGINS.has(origin)) {
      return refuse('production-resource-mismatch');
    }
    return {
      ok: true,
      reason: 'production-ids-match',
      email: true,
      destructive: true,
    };
  }

  if (environment !== 'staging' && environment !== 'preview') {
    return refuse('unknown-environment');
  }

  if (usesProduction || PRODUCTION_ORIGINS.has(origin)) {
    return refuse('non-production-bound-to-production');
  }

  const match = d1 === stage.d1 && kv === stage.kv && queue === stage.queue;
  if (!match || !STAGING_ORIGINS.has(origin)) {
    return refuse('non-production-resource-mismatch');
  }

  return {
    ok: true,
    reason: 'non-production-ids-match',
    email: false,
    destructive: false,
  };
}

function refuse(reason) {
  return { ok: false, reason, email: false, destructive: false };
}
