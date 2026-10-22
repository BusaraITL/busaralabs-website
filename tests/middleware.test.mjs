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
    assert.match(response.headers.get('Content-Security-Policy'), /form-action 'none'/);
    assert.doesNotMatch(response.headers.get('Content-Security-Policy'), /cloudflareinsights/);
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
