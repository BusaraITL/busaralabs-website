/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Workers Entry Point — Queue, Durable Objects, Cron
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 2.1
   Classification: Internal
   ============================================================
   This is the main Workers entry point declared in wrangler.toml
   as `main = "workers/_worker.js"`.

   Responsibilities:
   1. Route queue batch events to the queue consumer
   2. Export Durable Object classes for rate limiting
   3. Handle scheduled cron triggers (data retention cleanup)

   ODPC NOTE (Kenya DPA 2019 § 49):
   - Cron trigger enforces 90-day retention policy
   - No personal data is logged in this file
   - All errors use generic messages — no internal detail exposed
   ============================================================ */

'use strict';

import { processContactQueue } from './queue-consumer.js';
import { RateLimiter }         from './rate-limiter.js';

// ============================================================
// DURABLE OBJECT EXPORTS
// RateLimiter implements per-IP and per-email rate limiting.
// Must be exported from the entry point for Wrangler to bind.
// ============================================================
export { RateLimiter };

// ============================================================
// DEFAULT EXPORT — Worker event handlers
// ============================================================
export default {

  // ----------------------------------------------------------
  // QUEUE HANDLER
  // Receives batches from CONTACT_QUEUE and delegates to the
  // queue consumer for email delivery and status updates.
  // ----------------------------------------------------------
  async queue(batch, env, ctx) {
    try {
      await processContactQueue(batch, env, ctx);
    } catch (err) {
      // Log internally — never expose to queue infrastructure
      console.error('[_worker] Queue batch processing error:', {
        queue:     batch.queue,
        batchSize: batch.messages.length,
        error:     err.message,
      });
      // Re-throw so Cloudflare retries the batch
      throw err;
    }
  },

  // ----------------------------------------------------------
  // SCHEDULED HANDLER (Cron)
  // Trigger: configured in wrangler.toml [triggers]
  // Purpose: enforce 90-day data retention (ODPC § 49)
  // Schedule: daily at 02:00 UTC
  // ----------------------------------------------------------
  async scheduled(event, env, ctx) {
    console.log('[_worker] Scheduled trigger fired:', {
      cron:      event.cron,
      timestamp: new Date().toISOString(),
    });

    ctx.waitUntil(runRetentionCleanup(env));
  },
};

// ============================================================
// RETENTION CLEANUP
// Deletes contact_submissions rows where expires_at has passed.
// ODPC Kenya DPA 2019 § 49 — data minimisation and retention.
// ============================================================
async function runRetentionCleanup(env) {
  try {
    const result = await env.DB.prepare(`
      DELETE FROM contact_submissions
      WHERE expires_at < datetime('now')
        AND deleted_at IS NULL
    `).run();

    console.log('[_worker] Retention cleanup complete:', {
      rowsDeleted: result.meta?.changes ?? 0,
      timestamp:   new Date().toISOString(),
    });
  } catch (err) {
    // Log failure — does not affect live traffic
    console.error('[_worker] Retention cleanup failed:', {
      error:     err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
