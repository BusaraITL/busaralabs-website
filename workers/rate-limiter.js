/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Rate Limiter — Durable Object
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 4.1
   Classification: Internal
   ============================================================
   Durable Object implementing distributed rate limiting.
   Exported from workers/_worker.js for Wrangler binding.

   Two limit types enforced:
   - Per-IP:    RATE_LIMIT_IP_MAX per hour (env var)
   - Per-email: RATE_LIMIT_EMAIL_MAX per hour (env var)

   NOTE: Primary rate limiting uses KV (contact.js).
   This Durable Object is the fallback for burst protection
   when KV consistency is insufficient.
   ============================================================ */

'use strict';

export class RateLimiter {
  constructor(state, env) {
    this.state = state;
    this.env   = env;
  }

  async fetch(request) {
    const url    = new URL(request.url);
    const key    = url.searchParams.get('key');
    const limit  = parseInt(url.searchParams.get('limit') || '5');
    const window = parseInt(url.searchParams.get('window') || '3600');

    if (!key) {
      return new Response(JSON.stringify({ error: 'key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now     = Math.floor(Date.now() / 1000);
    const stored  = await this.state.storage.get(key);
    const record  = stored || { count: 0, resetAt: now + window };

    // Reset window if expired
    if (now > record.resetAt) {
      record.count   = 0;
      record.resetAt = now + window;
    }

    record.count += 1;
    await this.state.storage.put(key, record);

    const allowed  = record.count <= limit;
    const remaining = Math.max(0, limit - record.count);

    return new Response(JSON.stringify({
      allowed,
      count:     record.count,
      limit,
      remaining,
      resetAt:   record.resetAt,
    }), {
      status:  allowed ? 200 : 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
