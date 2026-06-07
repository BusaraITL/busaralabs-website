/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Queue Payload Contract — Contact Form Message Schema
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 6.1
   Classification: Internal
   ============================================================
   Defines the canonical shape of every message placed on the
   CONTACT_QUEUE. Both the producer (functions/api/contact.js)
   and the consumer (workers/queue-consumer.js) import from
   this file — single source of truth for the message schema.

   ODPC NOTE (Kenya DPA 2019):
   - Fields marked [PERSONAL DATA] are Tier 1 data.
   - They must never be logged in plaintext.
   - They are encrypted before being placed on the queue
     using AES-256-GCM (QUEUE_ENCRYPTION_KEY secret).
   - Migration path: when D1 → Angani PostgreSQL, only the
     DB binding changes. This contract remains unchanged.
   ============================================================ */

'use strict';

// ============================================================
// CONSTANTS
// ============================================================

/** Maximum field lengths — must match functions/api/contact.js */
export const FIELD_LIMITS = {
  NAME_MIN:    2,
  NAME_MAX:    100,
  EMAIL_MAX:   254,   // RFC 5321
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 2000,
};

/** Valid queue message versions — increment on breaking changes */
export const SCHEMA_VERSION = '1.0';

/** Valid submission statuses — must match D1 schema CHECK constraint */
export const SUBMISSION_STATUS = {
  RECEIVED:   'received',
  PROCESSING: 'processing',
  SENT:       'sent',
  FAILED:     'failed',
  DELETED:    'deleted',
};

// ============================================================
// PAYLOAD SCHEMA
// Documents the shape of every queue message.
// Producer must call buildPayload() — never construct manually.
// ============================================================

/**
 * Build a validated, versioned queue payload.
 *
 * @param {object} fields
 * @param {number} fields.submissionId  — D1 row ID (inserted before enqueue)
 * @param {string} fields.name          — [PERSONAL DATA] contact name
 * @param {string} fields.email         — [PERSONAL DATA] contact email
 * @param {string} fields.message       — [PERSONAL DATA] contact message
 * @param {string} fields.consentTs     — ISO 8601 consent timestamp
 * @param {string} fields.environment   — 'development' | 'staging' | 'production'
 * @returns {object} validated payload ready for queue
 * @throws {ValidationError} if any field fails validation
 */
export function buildPayload({ submissionId, name, email, message, consentTs, environment }) {

  // Validate all fields before building payload
  validateSubmissionId(submissionId);
  validateName(name);
  validateEmail(email);
  validateMessage(message);
  validateConsentTimestamp(consentTs);
  validateEnvironment(environment);

  return {
    version:      SCHEMA_VERSION,
    submissionId,
    name,         // [PERSONAL DATA] — encrypted at rest in queue
    email,        // [PERSONAL DATA] — encrypted at rest in queue
    message,      // [PERSONAL DATA] — encrypted at rest in queue
    consentTs,
    environment,
    enqueuedAt:   new Date().toISOString(),
  };
}

/**
 * Validate an incoming queue message before processing.
 * Called by queue-consumer.js on every dequeued message.
 *
 * @param {object} payload — raw parsed message body
 * @returns {object} validated payload
 * @throws {ValidationError} if schema is invalid or version mismatch
 */
export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Payload must be a non-null object', 'INVALID_PAYLOAD');
  }

  if (payload.version !== SCHEMA_VERSION) {
    throw new ValidationError(
      `Unsupported payload version: ${payload.version}. Expected: ${SCHEMA_VERSION}`,
      'VERSION_MISMATCH'
    );
  }

  validateSubmissionId(payload.submissionId);
  validateName(payload.name);
  validateEmail(payload.email);
  validateMessage(payload.message);
  validateConsentTimestamp(payload.consentTs);
  validateEnvironment(payload.environment);

  return payload;
}

// ============================================================
// FIELD VALIDATORS
// Each validator throws ValidationError on failure.
// ============================================================

function validateSubmissionId(id) {
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError(
      'submissionId must be a positive integer',
      'INVALID_SUBMISSION_ID'
    );
  }
}

function validateName(name) {
  if (typeof name !== 'string') {
    throw new ValidationError('name must be a string', 'INVALID_NAME');
  }
  const trimmed = name.trim();
  if (trimmed.length < FIELD_LIMITS.NAME_MIN || trimmed.length > FIELD_LIMITS.NAME_MAX) {
    throw new ValidationError(
      `name must be ${FIELD_LIMITS.NAME_MIN}–${FIELD_LIMITS.NAME_MAX} characters`,
      'INVALID_NAME'
    );
  }
  // No HTML tags
  if (/<[^>]*>/g.test(trimmed)) {
    throw new ValidationError('name contains invalid characters', 'INVALID_NAME');
  }
}

function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new ValidationError('email must be a string', 'INVALID_EMAIL');
  }
  // RFC 5322 — simplified but production-safe pattern
  const RFC5322 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!RFC5322.test(email)) {
    throw new ValidationError('email format is invalid', 'INVALID_EMAIL');
  }
  if (email.length > FIELD_LIMITS.EMAIL_MAX) {
    throw new ValidationError(
      `email must not exceed ${FIELD_LIMITS.EMAIL_MAX} characters`,
      'INVALID_EMAIL'
    );
  }
  // Header injection guard — newlines in email headers are an attack vector
  if (/[\r\n]/.test(email)) {
    throw new ValidationError('email contains invalid characters', 'INVALID_EMAIL');
  }
}

function validateMessage(message) {
  if (typeof message !== 'string') {
    throw new ValidationError('message must be a string', 'INVALID_MESSAGE');
  }
  const trimmed = message.trim();
  if (trimmed.length < FIELD_LIMITS.MESSAGE_MIN || trimmed.length > FIELD_LIMITS.MESSAGE_MAX) {
    throw new ValidationError(
      `message must be ${FIELD_LIMITS.MESSAGE_MIN}–${FIELD_LIMITS.MESSAGE_MAX} characters`,
      'INVALID_MESSAGE'
    );
  }
  // Block script injection
  if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(trimmed)) {
    throw new ValidationError('message contains invalid content', 'INVALID_MESSAGE');
  }
}

function validateConsentTimestamp(ts) {
  if (typeof ts !== 'string' || isNaN(Date.parse(ts))) {
    throw new ValidationError(
      'consentTs must be a valid ISO 8601 timestamp',
      'INVALID_CONSENT_TIMESTAMP'
    );
  }
}

function validateEnvironment(env) {
  const VALID = ['development', 'staging', 'production'];
  if (!VALID.includes(env)) {
    throw new ValidationError(
      `environment must be one of: ${VALID.join(', ')}`,
      'INVALID_ENVIRONMENT'
    );
  }
}

// ============================================================
// VALIDATION ERROR CLASS
// Safe client-facing .message — internal detail in .code only.
// Never expose .code or stack traces to API responses.
// ============================================================

export class ValidationError extends Error {
  /**
   * @param {string} message — safe, human-readable description
   * @param {string} code    — internal error code (never sent to client)
   */
  constructor(message, code) {
    super(message);
    this.name    = 'ValidationError';
    this.code    = code;
  }
}
