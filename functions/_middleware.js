/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   functions/_middleware.js — per-request CSP with nonce
   ------------------------------------------------------------
   Cloudflare's bot-management / JavaScript Detections feature
   injects an inline <script> on every page, with content that
   changes per request (embeds a per-request token). A static
   CSP in _headers cannot accommodate this: hash-pinning fails
   immediately since the content is never the same twice, and
   'unsafe-inline' would weaken script-src for the whole site.

   Cloudflare's own docs state the supported fix: include a
   nonce in the CSP response header, and Cloudflare's edge will
   automatically read it and stamp the same nonce onto the
   scripts it injects. This middleware generates a fresh,
   cryptographically random nonce on every request and sets the
   CSP header dynamically. All other security headers remain in
   _headers as static rules — this file's only job is CSP.

   This site ships zero inline <script> or <style> of its own
   (verified — see commit history), so no nonce needs to be
   threaded into our own HTML at all. Only the response header
   carries it.

   Version: 1.0 | June 2026 | Classification: Public
   ============================================================ */

export async function onRequest(context) {
  const response = await context.next();

  // 16 random bytes, base64-encoded — standard nonce size/format
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = btoa(String.fromCharCode(...nonceBytes));

  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com`,
    "font-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "frame-ancestors 'none'"
  ].join('; ');

  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Content-Security-Policy', csp);
  return newResponse;
}
