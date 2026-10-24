/* Local browser checks against public/. Uses the system Chrome.
   Not part of npm test: the CI image may not have Chrome.
   Exit 1 on overflow, console errors, failed assets, external requests,
   or serious axe violations. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
const ROOT = path.join(import.meta.dirname, '..', 'public');
const OUT = process.env.QA_OUT || '/tmp/busara-qa';
const CHROME = process.env.CHROME || '/usr/local/bin/google-chrome';
const WIDTHS = [360, 390, 768, 1024, 1440];
const PAGES = [
  '/', '/about', '/doctrine', '/work', '/paamoja', '/research-journal',
  '/careers', '/contact', '/privacy-policy', '/terms-of-service',
  '/cookie-policy', '/disclaimer',
];

fs.mkdirSync(OUT, { recursive: true });

function serve(root) {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json',
  };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    let file = path.join(root, rel);
    if (!file.startsWith(root)) {
      res.writeHead(400); res.end(); return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      const html = file.endsWith('.html') ? file : file + '.html';
      if (fs.existsSync(html)) file = html;
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404); res.end('missing'); return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const findings = [];
function fail(kind, detail) { findings.push({ result: 'FAIL', kind, detail }); }
function pass(kind, detail) { findings.push({ result: 'PASS', kind, detail }); }

const server = await serve(ROOT);
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function inspect(page, label) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('request', (req) => {
    const host = new URL(req.url()).host;
    if (!host.startsWith('127.0.0.1')) fail('external-request', label + ' ' + req.url());
  });
  page.on('requestfailed', (req) => fail('failed-request', label + ' ' + req.url() + ' ' + req.failure()?.errorText));
  page.on('response', (res) => {
    if (res.status() >= 400) fail('http-error', label + ' ' + res.status() + ' ' + res.url());
  });
  return errors;
}

try {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = await inspect(page, width + 'px');
    for (const route of PAGES) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return { scroll: doc.scrollWidth, client: doc.clientWidth };
      });
      if (overflow.scroll > overflow.client + 1) {
        fail('overflow', width + ' ' + route + ' ' + overflow.scroll + '>' + overflow.client);
      }
    }
    if (errors.length) fail('console', width + ' ' + errors.join(' | '));
    await context.close();
  }
  if (!findings.some((item) => item.kind === 'overflow')) pass('overflow', 'no horizontal overflow at 360, 390, 768, 1024, 1440');
  if (!findings.some((item) => item.kind === 'console')) pass('console', 'no page errors or console errors');
  if (!findings.some((item) => item.kind === 'external-request')) pass('external-request', 'all requests stayed on 127.0.0.1');
  if (!findings.some((item) => item.kind === 'failed-request') && !findings.some((item) => item.kind === 'http-error')) {
    pass('assets', 'no failed responses');
  }

  const shot = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await shot.newPage();
  await inspect(page, 'shots');
  async function save(route, file, selector) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const target = selector ? page.locator(selector).first() : page;
    if (selector) await target.screenshot({ path: path.join(OUT, file) });
    else await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  }
  await save('/', 'home-1440.png');
  await save('/', 'hero-1440.png', '.hero');
  await save('/doctrine', 'doctrine-l6-drawing-1440.png', '.st-l6');
  await save('/doctrine', 'doctrine-l6-layer-1440.png', '.layer-l6');
  await save('/paamoja', 'handover-1440.png', '.handover');
  await save('/paamoja', 'paamoja-status-1440.png', '.pm-status');
  await save('/paamoja', 'paamoja-journey-1440.png', '.journey');
  await save('/work', 'work-1440.png', '.register');
  await save('/about', 'about-tblock-1440.png', '.tblock--inline');
  await save('/', 'footer-1440.png', '.site-footer');
  await shot.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mpage = await mobile.newPage();
  await inspect(mpage, 'mobile');
  await mpage.goto(base + '/', { waitUntil: 'networkidle' });
  await mpage.screenshot({ path: path.join(OUT, 'home-390.png'), fullPage: true });
  await mpage.locator('.hero').screenshot({ path: path.join(OUT, 'hero-390.png') });
  await mpage.goto(base + '/doctrine', { waitUntil: 'networkidle' });
  await mpage.locator('.st-l6').screenshot({ path: path.join(OUT, 'doctrine-l6-390.png') });
  await mpage.goto(base + '/paamoja', { waitUntil: 'networkidle' });
  await mpage.locator('.handover').screenshot({ path: path.join(OUT, 'handover-390.png') });
  await mpage.locator('.pm-status').screenshot({ path: path.join(OUT, 'paamoja-status-390.png') });
  await mpage.goto(base + '/contact', { waitUntil: 'networkidle' });
  await mpage.locator('.nav-toggle').click();
  await mpage.screenshot({ path: path.join(OUT, 'menu-390.png') });
  const expanded = await mpage.locator('.nav-toggle').getAttribute('aria-expanded');
  if (expanded !== 'true') fail('keyboard', 'menu did not open');
  await mpage.keyboard.press('Escape');
  const closed = await mpage.locator('.nav-toggle').getAttribute('aria-expanded');
  if (closed !== 'false') fail('keyboard', 'Escape did not close the menu');
  else pass('keyboard', 'mobile menu opens and Escape closes it at 390');
  await mobile.close();

  const narrow = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const npage = await narrow.newPage();
  await npage.goto(base + '/contact', { waitUntil: 'networkidle' });
  await npage.locator('.nav-toggle').click();
  await npage.screenshot({ path: path.join(OUT, 'menu-360.png') });
  await narrow.close();

  const nojs = await browser.newContext({ viewport: { width: 390, height: 800 }, javaScriptEnabled: false });
  const nj = await nojs.newPage();
  await nj.goto(base + '/contact', { waitUntil: 'networkidle' });
  const demoHidden = await nj.locator('#contact-demo').getAttribute('hidden');
  const note = await nj.locator('.collection-note').textContent();
  const navVisible = await nj.locator('.site-nav').isVisible();
  if (demoHidden === null) fail('no-js', 'demonstration form is visible without JavaScript');
  else pass('no-js', 'demonstration form stays hidden without JavaScript');
  if (!note || !/disabled/i.test(note)) fail('no-js', 'collection note missing');
  else pass('no-js-note', 'disabled collection note is in the HTML');
  if (!navVisible) fail('no-js', 'primary nav hidden without JavaScript');
  else pass('no-js-nav', 'primary nav is visible without JavaScript');
  await nj.screenshot({ path: path.join(OUT, 'contact-nojs-390.png'), fullPage: true });
  await nojs.close();

  const motion = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const motionPage = await motion.newPage();
  await motionPage.goto(base + '/', { waitUntil: 'networkidle' });
  const motionCss = await motionPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  if (motionCss !== 'auto') fail('reduced-motion', 'scroll-behavior is ' + motionCss);
  else pass('reduced-motion', 'scroll-behavior is auto when reduced motion is requested');
  await motion.close();

  const axePath = require.resolve('axe-core/axe.js');
  const axeContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const axePage = await axeContext.newPage();
  const axeSummary = [];
  for (const route of ['/', '/doctrine', '/paamoja', '/work', '/contact', '/research-journal', '/privacy-policy']) {
    await axePage.goto(base + route, { waitUntil: 'networkidle' });
    await axePage.addScriptTag({ path: axePath });
    const result = await axePage.evaluate(async () => {
      const outcome = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] },
      });
      return outcome.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        nodes: item.nodes.slice(0, 3).map((node) => node.target.join(' ')),
      }));
    });
    axeSummary.push({ route, violations: result });
    const serious = result.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    if (serious.length) fail('axe', route + ' ' + JSON.stringify(serious));
  }
  fs.writeFileSync(path.join(OUT, 'axe.json'), JSON.stringify(axeSummary, null, 2));
  if (!findings.some((item) => item.kind === 'axe')) pass('axe', 'no serious or critical wcag2a/aa violations on the checked pages');
  await axeContext.close();
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(path.join(OUT, 'findings.json'), JSON.stringify(findings, null, 2));
const failed = findings.filter((item) => item.result === 'FAIL');
for (const item of findings) console.log(item.result + ' ' + item.kind + ' — ' + item.detail);
if (failed.length) {
  console.error('QA failures: ' + failed.length);
  process.exit(1);
}
