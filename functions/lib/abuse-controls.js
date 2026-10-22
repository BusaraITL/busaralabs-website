/* Abuse controls for /api/contact.
   These run while collection is off. They do not read the body.
   KV is used only after the resource guard accepts the environment,
   so a staging request cannot write a production rate-limit key
   when the plain vars still say production. The edge rate-limit
   rule in the operator checklist covers requests this module
   cannot safely count. */

'use strict';

import { evaluateResourceIsolation } from './resource-guard.js';

export const MAX_BODY_BYTES = 8192;

export function declaredBodyTooLarge(request) {
  const raw = request.headers && request.headers.get ? request.headers.get('content-length') : '';
  if (raw == null || raw === '') return false;
  if (!/^\d+$/.test(String(raw))) return true;
  return Number(raw) > MAX_BODY_BYTES;
}

export async function evaluateAbuseControls(request, env) {
  if (declaredBodyTooLarge(request)) {
    return { blocked: true, status: 413, reason: 'body-too-large' };
  }

  const isolation = evaluateResourceIsolation(env);
  if (!isolation.ok) {
    return { blocked: false, reason: 'kv-not-used' };
  }

  const source = env && typeof env === 'object' ? env : {};
  const limit = positiveInt(source.RATE_LIMIT_IP_MAX, 10);
  const limited = await consumeLimit(source.RATE_LIMIT_KV, await clientKey(request), limit);
  if (limited) return { blocked: true, status: 429, reason: 'rate-limited' };
  return { blocked: false, reason: 'within-limit' };
}

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

async function clientKey(request) {
  const ip = request.headers && request.headers.get ? (request.headers.get('CF-Connecting-IP') || 'unknown') : 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(ip)));
  const hex = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return 'closed:' + hex.slice(0, 16);
}

async function consumeLimit(kv, key, limit) {
  if (!kv || typeof kv.get !== 'function' || typeof kv.put !== 'function') return true;
  try {
    const current = await kv.get(key);
    const count = current == null ? 0 : Number.parseInt(current, 10);
    if (!Number.isFinite(count) || count >= limit) return true;
    await kv.put(key, String(count + 1), { expirationTtl: 60 });
    return false;
  } catch {
    return true;
  }
}
