/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS
   Contact Form Module — Validation, Turnstile, ODPC consent
   Version: 1.0 | June 2026
   Ref: BUSARALABS-WEBSITE-COMPLETE-SPEC.md § 3.2, § 4.5, § 6.1
   ============================================================
   ODPC COMPLIANCE (Kenya DPA 2019):
   - § 21: Consent checkbox mandatory — cannot submit without it
   - § 24: Consent links to Privacy Policy
   - § 49: No personal data in error logs
   Turnstile verification is server-side — client sends token only.
   ============================================================ */

'use strict';

// ── CONSTANTS ─────────────────────────────────────────────────
const FORM_SELECTOR    = '#contact-form';
const API_ENDPOINT     = '/api/contact';
const MIN_MSG_LENGTH   = 10;
const MAX_MSG_LENGTH   = 2000;
const MAX_NAME_LENGTH  = 100;

// ── INIT ─────────────────────────────────────────────────────
export function initForm() {
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  // Real-time validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearFieldError(field));
  });

  // Form submission
  form.addEventListener('submit', handleSubmit);
}

// ── SUBMISSION HANDLER ────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;

  // Validate all fields before submitting
  const isValid = validateForm(form);
  if (!isValid) return;

  // Disable form during submission
  setFormState(form, 'loading');

  try {
    const formData = new FormData(form);

    // Add consent timestamp — ODPC § 21 requirement
    formData.append('consent_timestamp', new Date().toISOString());
    formData.append('page_url', window.location.href);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body:   new URLSearchParams(formData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setFormState(form, 'success');
      showMessage(form, 'success',
        'Thank you — your message has been received. We will respond within 24 hours.'
      );
      form.reset();
      // Reset Turnstile widget after successful submission
      if (window.turnstile) {
        window.turnstile.reset();
      }
    } else if (response.status === 429) {
      setFormState(form, 'error');
      showMessage(form, 'error',
        'Too many submissions. Please try again in 1 hour.'
      );
    } else {
      setFormState(form, 'error');
      showMessage(form, 'error',
        data.error || 'Something went wrong. Please try again.'
      );
    }

  } catch (err) {
    // Network error — do not log err.message (may contain PII in stack)
    setFormState(form, 'error');
    showMessage(form, 'error',
      'Network error. Please check your connection and try again.'
    );
  }
}

// ── FORM VALIDATION ───────────────────────────────────────────
function validateForm(form) {
  let isValid = true;

  // Validate each named field
  form.querySelectorAll('input[name], textarea[name]').forEach(field => {
    if (!validateField(field)) isValid = false;
  });

  // Consent checkbox — ODPC § 21 mandatory
  const consent = form.querySelector('input[name="consent"]');
  if (consent && !consent.checked) {
    showFieldError(consent,
      'You must consent to data processing to submit this form.'
    );
    isValid = false;
  }

  // Turnstile token — must be present
  const turnstile = form.querySelector('[name="cf-turnstile-response"]');
  if (turnstile && !turnstile.value) {
    showMessage(form, 'error', 'Please complete the security check.');
    isValid = false;
  }

  return isValid;
}

function validateField(field) {
  const name  = field.name;
  const value = field.value.trim();

  switch (name) {
    case 'name':
      if (!value) {
        showFieldError(field, 'Name is required.');
        return false;
      }
      if (value.length > MAX_NAME_LENGTH) {
        showFieldError(field, `Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
        return false;
      }
      break;

    case 'email':
      if (!value) {
        showFieldError(field, 'Email address is required.');
        return false;
      }
      // RFC 5322 simplified — server validates fully
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
      break;

    case 'message':
      if (!value) {
        showFieldError(field, 'Message is required.');
        return false;
      }
      if (value.length < MIN_MSG_LENGTH) {
        showFieldError(field, `Message must be at least ${MIN_MSG_LENGTH} characters.`);
        return false;
      }
      if (value.length > MAX_MSG_LENGTH) {
        showFieldError(field, `Message must be ${MAX_MSG_LENGTH} characters or fewer.`);
        return false;
      }
      break;
  }

  clearFieldError(field);
  return true;
}

// ── FORM STATE ────────────────────────────────────────────────
function setFormState(form, state) {
  const submit = form.querySelector('[type="submit"]');
  const states = ['loading', 'success', 'error'];

  states.forEach(s => form.classList.remove(`form--${s}`));

  if (state !== 'idle') {
    form.classList.add(`form--${state}`);
  }

  if (submit) {
    submit.disabled = state === 'loading';
    submit.textContent = state === 'loading' ? 'Sending…' : 'Send Message';
  }
}

// ── ERROR / MESSAGE DISPLAY ───────────────────────────────────
function showFieldError(field, message) {
  clearFieldError(field);
  field.setAttribute('aria-invalid', 'true');
  field.classList.add('field--error');

  const errorEl = document.createElement('span');
  errorEl.className  = 'field-error';
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');
  errorEl.id = `${field.id || field.name}-error`;
  field.setAttribute('aria-describedby', errorEl.id);

  field.parentNode.appendChild(errorEl);
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.classList.remove('field--error');

  const existing = field.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
}

function showMessage(form, type, text) {
  // Remove existing message
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className   = `form-message form-message--${type}`;
  msg.textContent = text;
  msg.setAttribute('role', type === 'error' ? 'alert' : 'status');
  msg.setAttribute('aria-live', 'polite');

  // Insert before submit button
  const submit = form.querySelector('[type="submit"]');
  if (submit) {
    form.insertBefore(msg, submit.parentNode || submit);
  } else {
    form.appendChild(msg);
  }

  // Scroll message into view
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
