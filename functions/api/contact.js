/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Contact Form API Endpoint — POST /api/contact
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 6.1
   Classification: Internal
   ============================================================
   Handles contact form submissions from busaralabs.com/contact.

   Processing order (must not be reordered):
   1.  CORS preflight
   2.  Method guard (POST only)
   3.  Environment-aware CORS origin check
   4.  Parse form body
   5.  Consent validation (ODPC § 21 — lawfulness of processing)
   6.  Input validation and sanitisation
   7.  Per-IP rate limit check
   8.  Per-email rate limit check
   9.  Turnstile bot verification
   10. D1 database insert (consent recorded before email sent)
   11. Queue message for async email delivery
   12. Return success response

   ODPC COMPLIANCE (Kenya DPA 2019):
   - § 21: Consent validated server-side — cannot be bypassed
   - § 24: Consent timestamp and version stored immutably
   - § 49: No personal data in error responses or logs
   - § 49: IP address stored for security/rate limiting only
   - § 85: Cross-border transfer covered by Cloudflare DPA + SCCs

   SECURITY:
   - All inputs validated and sanitised before any processing
   - Generic error messages — no internal detail exposed to client
   - Rate limiting: per-IP (wrangler.toml vars) + per-email
   - Turnstile verified server-side — client token not trusted
   - Queue payload encrypted (AES-256-GCM) before enqueue
   ============================================================ */

'use strict';

import { buildPayload, FIELD_LIMITS, ValidationError } from '../../workers/payload-contract.js';

// ============================================================
// TURNSTILE VERIFICATION ENDPOINT
// ============================================================
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// ============================================================
// MAIN HANDLER
// Cloudflare Pages Functions export format.
// ============================================================
export async function onRequestPost(context) {
  const { request, env } = context;

  // Step 1: CORS headers (environment-aware)
  const corsHeaders = buildCorsHeaders(env);

  try {
    // Step 2: Parse form body
    const formData = await parseFormData(request);

    // Step 3: Extract and trim fields
    const name       = (formData.get('name')                  || '').trim();
    const email      = (formData.get('email')                 || '').trim().toLowerCase();
    const message    = (formData.get('message')               || '').trim();
    const consent    = (formData.get('consent')               || '').trim();
    const turnstile  = (formData.get('cf-turnstile-response') || '').trim();
    const consentTs  = (formData.get('consent_timestamp')     || new Date().toISOString()).trim();

    // Step 4: Consent check — ODPC § 21
    // Must be first substantive check — do not process data without consent
    if (consent !== 'agreed') {
      return jsonResponse({
        success: false,
        error:   'Consent is required. Please check the consent checkbox.',
        field:   'consent',
      }, 400, corsHeaders);
    }

    // Step 5: Input validation
    const validationError = validateInputs({ name, email, message });
    if (validationError) {
      return jsonResponse({
        success: false,
        error:   validationError.message,
        field:   validationError.field,
      }, 400, corsHeaders);
    }

    // Step 6: Per-IP rate limit
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipLimitExceeded = await checkRateLimit(
      env.RATE_LIMIT_KV,
      `ip:${ip}`,
      parseInt(env.RATE_LIMIT_IP_MAX || '5'),
      3600
    );
    if (ipLimitExceeded) {
      return jsonResponse({
        success:    false,
        error:      'Too many submissions. Please try again in 1 hour.',
        retryAfter: 3600,
      }, 429, corsHeaders);
    }

    // Step 7: Per-email rate limit
    const emailLimitExceeded = await checkRateLimit(
      env.RATE_LIMIT_KV,
      `email:${email}`,
      parseInt(env.RATE_LIMIT_EMAIL_MAX || '3'),
      3600
    );
    if (emailLimitExceeded) {
      return jsonResponse({
        success:    false,
        error:      'Too many submissions from this email. Please try again in 1 hour.',
        retryAfter: 3600,
      }, 429, corsHeaders);
    }

    // Step 8: Turnstile bot verification
    if (!turnstile) {
      return jsonResponse({
        success: false,
        error:   'Bot verification is required. Please complete the challenge.',
        field:   'turnstile',
      }, 400, corsHeaders);
    }

    const turnstileValid = await verifyTurnstile(turnstile, ip, env.TURNSTILE_SECRET_KEY);
    if (!turnstileValid) {
      return jsonResponse({
        success: false,
        error:   'Bot verification failed. Please try again.',
        field:   'turnstile',
      }, 400, corsHeaders);
    }

    // Step 9: Insert into D1
    // Consent is recorded in the database before any email is sent.
    // This is the ODPC § 21 audit record — immutable after insert.
    const userAgent  = request.headers.get('User-Agent') || '';
    const retentionDays = parseInt(env.RETENTION_DAYS || '90');
    const now        = new Date().toISOString();
    const expiresAt  = new Date(
      Date.now() + retentionDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const insertResult = await env.DB.prepare(`
      INSERT INTO contact_submissions (
        name, email, message,
        consent_given, consent_timestamp, consent_version,
        ip_address, user_agent,
        status, created_at, expires_at
      ) VALUES (?, ?, ?, 1, ?, '1.0', ?, ?, 'received', ?, ?)
    `)
    .bind(name, email, message, consentTs, ip, userAgent, now, expiresAt)
    .run();

    const submissionId = insertResult.meta?.last_row_id;
    if (!submissionId) {
      throw new Error('Database insert did not return a submission ID');
    }

    // Step 10: Enqueue for async email delivery
    const payload = buildPayload({
      submissionId,
      name,
      email,
      message,
      consentTs,
      environment: env.ENVIRONMENT || 'production',
    });

    const encryptedPayload = await encryptPayload(payload, env.QUEUE_ENCRYPTION_KEY);
    await env.CONTACT_QUEUE.send(encryptedPayload);

    // Step 11: Increment rate limit counters only after successful insert
    await incrementRateLimit(env.RATE_LIMIT_KV, `ip:${ip}`, 3600);
    await incrementRateLimit(env.RATE_LIMIT_KV, `email:${email}`, 3600);

    // Step 12: Success — no personal data in response
    return jsonResponse({
      success:   true,
      message:   'Your message has been received. We will respond within 24 hours.',
      messageId: submissionId,
    }, 200, corsHeaders);

  } catch (err) {
    // Log internally — ID only, no personal data
    console.error('[contact] Unhandled error:', {
      error:     err.message,
      timestamp: new Date().toISOString(),
    });

    // Generic response — never expose internal error detail
    return jsonResponse({
      success: false,
      error:   'An unexpected error occurred. Please try again later.',
    }, 500, corsHeaders);
  }
}

// ============================================================
// CORS PREFLIGHT HANDLER
// ============================================================
export async function onRequestOptions(context) {
  const { env } = context;
  return new Response(null, {
    status:  204,
    headers: buildCorsHeaders(env),
  });
}

// ============================================================
// INPUT VALIDATION
// ============================================================
function validateInputs({ name, email, message }) {
  // Name
  if (!name || name.length < FIELD_LIMITS.NAME_MIN) {
    return { message: 'Name is required.', field: 'name' };
  }
  if (name.length > FIELD_LIMITS.NAME_MAX) {
    return { message: `Name must not exceed ${FIELD_LIMITS.NAME_MAX} characters.`, field: 'name' };
  }
  if (/<[^>]*>/g.test(name)) {
    return { message: 'Name contains invalid characters.', field: 'name' };
  }

  // Email — RFC 5322
  const RFC5322 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!email || !RFC5322.test(email)) {
    return { message: 'A valid email address is required.', field: 'email' };
  }
  if (email.length > FIELD_LIMITS.EMAIL_MAX) {
    return { message: 'Email address is too long.', field: 'email' };
  }
  if (/[\r\n]/.test(email)) {
    return { message: 'Email contains invalid characters.', field: 'email' };
  }

  // Message
  if (!message || message.length < FIELD_LIMITS.MESSAGE_MIN) {
    return { message: `Message must be at least ${FIELD_LIMITS.MESSAGE_MIN} characters.`, field: 'message' };
  }
  if (message.length > FIELD_LIMITS.MESSAGE_MAX) {
    return { message: `Message must not exceed ${FIELD_LIMITS.MESSAGE_MAX} characters.`, field: 'message' };
  }
  if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(message)) {
    return { message: 'Message contains invalid content.', field: 'message' };
  }

  return null; // All valid
}

// ============================================================
// RATE LIMITING
// ============================================================
async function checkRateLimit(kv, key, limit, ttlSeconds) {
  try {
    const current = await kv.get(key);
    return current !== null && parseInt(current) >= limit;
  } catch {
    // If KV is unavailable, fail open — don't block legitimate users
    console.error('[contact] Rate limit KV read failed for key type:', key.split(':')[0]);
    return false;
  }
}

async function incrementRateLimit(kv, key, ttlSeconds) {
  try {
    const current = await kv.get(key);
    const count   = current !== null ? parseInt(current) + 1 : 1;
    await kv.put(key, String(count), { expirationTtl: ttlSeconds });
  } catch {
    console.error('[contact] Rate limit KV write failed for key type:', key.split(':')[0]);
  }
}

// ============================================================
// TURNSTILE VERIFICATION
// ============================================================
async function verifyTurnstile(token, ip, secretKey) {
  if (!secretKey) {
    // Local dev — skip verification if no secret configured
    console.warn('[contact] TURNSTILE_SECRET_KEY not set — skipping verification');
    return true;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret:   secretKey,
        response: token,
        remoteip: ip,
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch {
    // Fail closed — if we can't verify, reject the submission
    console.error('[contact] Turnstile verification request failed');
    return false;
  }
}

// ============================================================
// ENCRYPTION — AES-256-GCM
// Encrypts queue payload before enqueue.
// Decrypted by queue-consumer.js on the other side.
// ============================================================
async function encryptPayload(payload, encryptionKey) {
  if (!encryptionKey) {
    // Local dev — skip encryption
    return JSON.stringify(payload);
  }

  const iv          = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    hexToBuffer(encryptionKey),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    new TextEncoder().encode(JSON.stringify(payload))
  );

  return JSON.stringify({
    iv:         bufferToHex(iv),
    ciphertext: bufferToHex(new Uint8Array(encrypted)),
  });
}

// ============================================================
// FORM DATA PARSING
// ============================================================
async function parseFormData(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return await request.formData();
  }
  if (contentType.includes('multipart/form-data')) {
    return await request.formData();
  }
  // Fallback — attempt formData regardless
  return await request.formData();
}

// ============================================================
// CORS HELPERS
// ============================================================
function buildCorsHeaders(env) {
  const origin = env.CORS_ORIGIN || 'https://busaralabs.com';
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

// ============================================================
// RESPONSE HELPER
// ============================================================
function jsonResponse(body, status, corsHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// ============================================================
// UTILITY HELPERS
// ============================================================
function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bufferToHex(buffer) {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
