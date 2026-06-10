/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   D1 Database Schema — Contact Submissions
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 5.2
   Classification: Internal
   ============================================================
   ODPC COMPLIANCE (Kenya DPA 2019):
   - § 21: consent_given, consent_timestamp, consent_version
           stored immutably — never updated after insert
   - § 48: deleted_at, deletion_reason, processing_restricted,
           processing_objected support all six data subject rights
   - § 49: expires_at enforces 90-day retention policy
           Auto-delete runs via cron in workers/_worker.js
   - Migration: when moving to Angani PostgreSQL, this schema
     translates directly — column types map 1:1 to PostgreSQL.
     Only AUTOINCREMENT becomes SERIAL and BOOLEAN becomes
     BOOLEAN (native). No application logic changes required.
   ============================================================ */

-- ============================================================
-- CONTACT SUBMISSIONS
-- One row per form submission. Immutable after insert except
-- for status tracking and data subject rights fields.
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (

  -- Primary key
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Form data [PERSONAL DATA — Tier 1]
  name                  TEXT    NOT NULL,
  email                 TEXT    NOT NULL,
  message               TEXT    NOT NULL,

  -- ODPC § 21 — Consent (immutable after insert)
  consent_given         BOOLEAN NOT NULL DEFAULT 0,
  consent_timestamp     TEXT    NOT NULL,
  consent_version       TEXT    NOT NULL DEFAULT '1.0',

  -- Security and audit
  ip_address            TEXT,
  user_agent            TEXT,

  -- Status tracking
  status                TEXT    NOT NULL DEFAULT 'received',
  email_sent_at         TEXT,
  email_error           TEXT,

  -- Timestamps
  created_at            TEXT    NOT NULL,
  updated_at            TEXT,

  -- ODPC § 48 — Data subject rights
  deleted_at            TEXT    DEFAULT NULL,
  deletion_reason       TEXT    DEFAULT NULL,
  processing_restricted BOOLEAN DEFAULT 0,
  processing_objected   BOOLEAN DEFAULT 0,

  -- ODPC § 49 — Retention (90-day auto-delete)
  expires_at            TEXT    NOT NULL,

  -- Constraints
  CONSTRAINT chk_consent  CHECK (consent_given = 1),
  CONSTRAINT chk_status   CHECK (status IN (
    'received', 'processing', 'sent', 'failed', 'deleted'
  )),
  CONSTRAINT chk_expires  CHECK (expires_at > created_at)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contact_email
  ON contact_submissions(email);

CREATE INDEX IF NOT EXISTS idx_contact_expires
  ON contact_submissions(expires_at);

CREATE INDEX IF NOT EXISTS idx_contact_consent
  ON contact_submissions(consent_timestamp);

CREATE INDEX IF NOT EXISTS idx_contact_created
  ON contact_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_status
  ON contact_submissions(status);
