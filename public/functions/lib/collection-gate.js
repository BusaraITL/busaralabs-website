/* ============================================================
   Collection kill switch
   ------------------------------------------------------------
   Every submission path must call evaluateCollectionGate before
   it reads, stores, logs, or forwards a payload.

   Disabled unless COLLECTION_ENABLED is exactly "on".
   Missing, empty, "true", "1", "yes", and any other value are
   disabled. An unknown ENVIRONMENT is disabled.

   Production cannot be activated by COLLECTION_ENABLED alone.
   ENVIRONMENT=production also requires COLLECTION_PRODUCTION_ACK
   to be exactly PRODUCTION_ACK. That acknowledgement is not a
   secret; it is a second deliberate switch so production cannot
   turn on because a preview flag was copied across.

   This module does not read the request and does not log values.
   ============================================================ */

'use strict';

export const ENABLED_VALUE = 'on';
export const PRODUCTION_ACK = 'I-ACKNOWLEDGE-PRODUCTION-COLLECTION';

const NON_PRODUCTION = new Set(['staging', 'preview']);

export function evaluateCollectionGate(env) {
  const source = env && typeof env === 'object' ? env : {};
  const flag = typeof source.COLLECTION_ENABLED === 'string' ? source.COLLECTION_ENABLED : '';
  const environment = typeof source.ENVIRONMENT === 'string' ? source.ENVIRONMENT : '';

  if (flag !== ENABLED_VALUE) {
    return { allowed: false, reason: 'missing-or-invalid-flag' };
  }

  if (environment === 'production') {
    const ack = typeof source.COLLECTION_PRODUCTION_ACK === 'string'
      ? source.COLLECTION_PRODUCTION_ACK
      : '';
    if (ack !== PRODUCTION_ACK) {
      return { allowed: false, reason: 'production-not-acknowledged' };
    }
    return { allowed: true, reason: 'production-acknowledged' };
  }

  if (!NON_PRODUCTION.has(environment)) {
    return { allowed: false, reason: 'unknown-environment' };
  }

  return { allowed: true, reason: 'enabled-' + environment };
}

export function collectionDisabledBody() {
  return {
    success: false,
    error: 'Collection is disabled. This endpoint does not accept submissions.',
  };
}
