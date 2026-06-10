/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Queue Consumer — Contact Form Email Delivery
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 2.2
   Classification: Internal
   ============================================================
   Consumes messages from CONTACT_QUEUE and delivers
   notification emails via SendGrid.

   Flow:
   1. Receive batch from _worker.js
   2. Decrypt payload (AES-256-GCM)
   3. Validate payload schema (payload-contract.js)
   4. Send notification email via SendGrid
   5. Update D1 submission status
   6. Acknowledge or retry message

   ODPC NOTE (Kenya DPA 2019):
   - § 49: No personal data written to logs
   - § 49: Email delivery failures logged by submission ID only
   - § 48: Submission status updated for audit trail
   - Migration: swap env.DB binding for Angani PostgreSQL adapter
     with no changes to this file's logic
   ============================================================ */

'use strict';

import { validatePayload, SUBMISSION_STATUS } from './payload-contract.js';

// ============================================================
// CONSTANTS
// ============================================================
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';
const FROM_EMAIL       = 'hello@busaralabs.com';
const FROM_NAME        = 'BIT Labs Website';
const MAX_RETRIES      = 3;

// ============================================================
// MAIN EXPORT
// Called by _worker.js queue handler for every batch.
// ============================================================

/**
 * Process a batch of queue messages.
 * @param {MessageBatch} batch — Cloudflare Queue batch
 * @param {object} env         — Worker environment bindings
 * @param {object} ctx         — Execution context
 */
export async function processContactQueue(batch, env, ctx) {
  const results = await Promise.allSettled(
    batch.messages.map(msg => processMessage(msg, env))
  );

  // Log batch summary — no personal data
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  const failed    = results.filter(r => r.status === 'rejected').length;

  console.log('[queue-consumer] Batch processed:', {
    queue:     batch.queue,
    total:     batch.messages.length,
    succeeded,
    failed,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================
// MESSAGE PROCESSOR
// ============================================================

async function processMessage(message, env) {
  let submissionId = null;

  try {
    // Step 1: Decrypt payload
    const payload = await decryptPayload(message.body, env.QUEUE_ENCRYPTION_KEY);

    // Step 2: Validate schema
    const validated = validatePayload(payload);
    submissionId = validated.submissionId;

    // Step 3: Mark as processing
    await updateSubmissionStatus(env.DB, submissionId, SUBMISSION_STATUS.PROCESSING);

    // Step 4: Send notification email
    await sendNotificationEmail(validated, env);

    // Step 5: Mark as sent
    await updateSubmissionStatus(env.DB, submissionId, SUBMISSION_STATUS.SENT, {
      email_sent_at: new Date().toISOString(),
    });

    // Step 6: Acknowledge — removes from queue
    message.ack();

    console.log('[queue-consumer] Message processed successfully:', {
      submissionId,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[queue-consumer] Message processing failed:', {
      submissionId,  // ID only — no personal data
      error:         err.message,
      retries:       message.attempts,
      timestamp:     new Date().toISOString(),
    });

    // Update DB with error — ID and sanitised error message only
    if (submissionId) {
      await updateSubmissionStatus(env.DB, submissionId, SUBMISSION_STATUS.FAILED, {
        email_error: sanitiseErrorMessage(err.message),
      }).catch(() => {}); // Don't throw if status update fails
    }

    // Retry if under limit — otherwise acknowledge to prevent infinite loop
    if (message.attempts < MAX_RETRIES) {
      message.retry();
    } else {
      console.error('[queue-consumer] Max retries exceeded — acknowledging to DLQ:', {
        submissionId,
        attempts: message.attempts,
      });
      message.ack();
    }

    throw err;
  }
}

// ============================================================
// EMAIL DELIVERY — SendGrid
// ============================================================

async function sendNotificationEmail(payload, env) {
  const notifyEmail = env.NOTIFY_EMAIL;

  if (!notifyEmail) {
    throw new Error('NOTIFY_EMAIL secret is not configured');
  }

  if (!env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY secret is not configured');
  }

  // Sanitise display values before inserting into email body
  const safeName    = escapeHtml(payload.name);
  const safeEmail   = escapeHtml(payload.email);
  const safeMessage = escapeHtml(payload.message);

  const emailBody = {
    personalizations: [{
      to: [{ email: notifyEmail }],
    }],
    from: {
      email: FROM_EMAIL,
      name:  FROM_NAME,
    },
    subject: `[BIT Labs] New contact form submission #${payload.submissionId}`,
    content: [
      {
        type:  'text/plain',
        value: buildPlainTextEmail(safeName, safeEmail, safeMessage, payload),
      },
      {
        type:  'text/html',
        value: buildHtmlEmail(safeName, safeEmail, safeMessage, payload),
      },
    ],
  };

  const response = await fetch(SENDGRID_API_URL, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(emailBody),
  });

  if (!response.ok) {
    // Do not log response body — may contain API details
    throw new Error(`SendGrid delivery failed: HTTP ${response.status}`);
  }
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

function buildPlainTextEmail(name, email, message, payload) {
  return [
    'NEW CONTACT FORM SUBMISSION',
    '============================',
    '',
    `Submission ID : #${payload.submissionId}`,
    `Environment   : ${payload.environment}`,
    `Received      : ${payload.enqueuedAt}`,
    `Consent given : ${payload.consentTs}`,
    '',
    'FROM',
    '----',
    `Name    : ${name}`,
    `Email   : ${email}`,
    '',
    'MESSAGE',
    '-------',
    message,
    '',
    '============================',
    'Busara Infrastructure & Technology Labs',
    'compliance@busaralabs.com',
  ].join('\n');
}

function buildHtmlEmail(name, email, message, payload) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Contact Submission</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#001A33;">
  <h2 style="border-bottom:2px solid #C9A84C;padding-bottom:8px;">
    New Contact Form Submission
  </h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:6px 0;color:#666;width:140px;">Submission ID</td>
        <td style="padding:6px 0;font-weight:600;">#${payload.submissionId}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Environment</td>
        <td style="padding:6px 0;">${payload.environment}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Received</td>
        <td style="padding:6px 0;">${payload.enqueuedAt}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Consent given</td>
        <td style="padding:6px 0;">${payload.consentTs}</td></tr>
  </table>
  <h3 style="color:#C9A84C;">From</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td>
        <td style="padding:6px 0;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Email</td>
        <td style="padding:6px 0;">
          <a href="mailto:${email}" style="color:#001A33;">${email}</a>
        </td></tr>
  </table>
  <h3 style="color:#C9A84C;">Message</h3>
  <div style="background:#F8F6F1;border-left:4px solid #C9A84C;padding:16px;
              white-space:pre-wrap;line-height:1.6;">${message}</div>
  <hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
  <p style="color:#999;font-size:12px;">
    Busara Infrastructure &amp; Technology Labs Ltd &bull;
    <a href="mailto:compliance@busaralabs.com" style="color:#999;">
      compliance@busaralabs.com
    </a>
  </p>
</body>
</html>`;
}

// ============================================================
// DATABASE HELPERS
// ============================================================

async function updateSubmissionStatus(db, submissionId, status, extra = {}) {
  const now    = new Date().toISOString();
  const fields = { status, updated_at: now, ...extra };

  const setClauses = Object.keys(fields)
    .map(k => `${k} = ?`)
    .join(', ');
  const values = [...Object.values(fields), submissionId];

  await db.prepare(`
    UPDATE contact_submissions
    SET ${setClauses}
    WHERE id = ?
  `).bind(...values).run();
}

// ============================================================
// ENCRYPTION HELPERS
// AES-256-GCM — queue payloads are encrypted before enqueue
// and decrypted here before processing.
// ============================================================

async function decryptPayload(encryptedBody, encryptionKey) {
  // If no encryption key configured (local dev), treat as plaintext
  if (!encryptionKey) {
    return typeof encryptedBody === 'string'
      ? JSON.parse(encryptedBody)
      : encryptedBody;
  }

  try {
    const { iv, ciphertext } = typeof encryptedBody === 'string'
      ? JSON.parse(encryptedBody)
      : encryptedBody;

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      hexToBuffer(encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: hexToBuffer(iv) },
      keyMaterial,
      hexToBuffer(ciphertext)
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (err) {
    throw new Error('Payload decryption failed');
  }
}

// ============================================================
// UTILITY HELPERS
// ============================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Strip potentially sensitive detail from error messages
 * before persisting to the database.
 */
function sanitiseErrorMessage(message) {
  // Truncate and remove anything that looks like a credential or path
  return String(message)
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/key[=:]\s*\S+/gi, 'key=[REDACTED]')
    .slice(0, 200);
}
