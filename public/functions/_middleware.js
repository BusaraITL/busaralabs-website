/* ============================================================
   BUSARA INFRASTRUCTURE & TECHNOLOGY LABS LTD
   functions/_middleware.js — CSP, and noindex off production
   ------------------------------------------------------------
   CSP allows only this origin. Scripts are files under /assets.
   There is no nonce and no unsafe-inline, so an injected inline
   script does not run.

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

function contentSecurityPolicy() {
  return [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    "script-src 'self'",
    "font-src 'self'",
    "base-uri 'self'",
    "form-action 'none'",
    "connect-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
}

const SECURITY_HEADERS = {
  'Content-Security-Policy': contentSecurityPolicy(),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
};

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
        ...SECURITY_HEADERS,
      },
    });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  if (!production) headers.set('X-Robots-Tag', 'noindex, nofollow');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
