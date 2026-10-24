import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/_middleware.js';

async function run(url) {
  return onRequest({
    request: new Request(url),
    async next() {
      return new Response('ok', { headers: { 'content-type': 'text/html; charset=utf-8' } });
    },
  });
}

test('production hosts are not given a noindex header', async () => {
  for (const host of ['https://busaralabs.com/', 'https://www.busaralabs.com/about']) {
    const response = await run(host);
    assert.equal(response.headers.get('X-Robots-Tag'), null, host);
    const csp = response.headers.get('Content-Security-Policy');
    assert.match(csp, /form-action 'none'/);
    assert.match(csp, /script-src 'self'/);
    assert.doesNotMatch(csp, /unsafe-inline|nonce-|cloudflareinsights/);
    assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=63072000; includeSubDomains; preload');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
    assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
    assert.match(response.headers.get('Permissions-Policy'), /camera=\(\)/);
  }
});

test('staging and pages hosts are noindex, including robots.txt', async () => {
  const staging = await run('https://staging.busaralabs.com/');
  assert.equal(staging.headers.get('X-Robots-Tag'), 'noindex, nofollow');

  const preview = await run('https://abc123.busaralabs-website.pages.dev/');
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, nofollow');

  const robots = await run('https://staging.busaralabs.com/robots.txt');
  assert.match(await robots.text(), /Disallow: \//);
  assert.equal(robots.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});
