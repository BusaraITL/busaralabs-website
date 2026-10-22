/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   functions/_middleware.js — CSP, and noindex off production
   ------------------------------------------------------------
   CSP is per request so Cloudflare can stamp a nonce onto any
   script it injects. This site does not load analytics. The
   policy does not allow static.cloudflareinsights.com.

   form-action 'none' blocks a form post while collection is off.
   mailto links are anchors, not form actions.

   Indexing: production hostnames are busaralabs.com and
   www.busaralabs.com. Every other host, including
   staging.busaralabs.com and *.pages.dev, gets
   X-Robots-Tag: noindex, nofollow and a disallow-all robots.txt.
   This is not Cloudflare Access. It does not prove the project
   bindings are isolated.
   ============================================================ */

const PRODUCTION_HOSTS = new Set(['busaralabs.com', 'www.busaralabs.com']);

function isProductionHost(hostname) {
  return PRODUCTION_HOSTS.has(String(hostname || '').toLowerCase());
}

function contentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "font-src 'self'",
    "base-uri 'self'",
    "form-action 'none'",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const production = isProductionHost(url.hostname);

  if (!production && url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const response = await context.next();
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  const nonce = btoa(String.fromCharCode(...nonceBytes));

  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', contentSecurityPolicy(nonce));
  if (!production) headers.set('X-Robots-Tag', 'noindex, nofollow');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
