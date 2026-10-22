import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const PUBLIC = path.join(process.cwd(), 'public');

function htmlFiles() {
  return fs.readdirSync(PUBLIC).filter((name) => name.endsWith('.html'));
}

function readPublic(name) {
  return fs.readFileSync(path.join(PUBLIC, name), 'utf8');
}

function visible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');
}

function loadClassic(file, key) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return sandbox.window[key];
}

test('every internal link and asset resolves, and no third-party URL is referenced', () => {
  const files = htmlFiles();
  assert.ok(files.includes('index.html'));
  const errors = [];
  for (const file of files) {
    const html = readPublic(file);
    assert.equal(html.includes('style='), false, file + ' has an inline style');
    const refs = html.match(/(?:href|src)="([^"]+)"/g) || [];
    for (const ref of refs) {
      const value = ref.slice(ref.indexOf('"') + 1, -1);
      if (value.startsWith('mailto:') || value.startsWith('#')) continue;
      if (value.startsWith('https://busaralabs.com')) continue;
      if (/^https?:/i.test(value)) {
        errors.push(file + ' external ' + value);
        continue;
      }
      const clean = value.split('#')[0].split('?')[0];
      const rel = clean === '/' ? 'index.html' : clean.replace(/^\//, '');
      const candidates = [
        path.join(PUBLIC, rel),
        path.join(PUBLIC, rel + '.html'),
        path.join(PUBLIC, rel, 'index.html'),
      ];
      if (!candidates.some((item) => fs.existsSync(item))) errors.push(file + ' missing ' + value);
    }
  }
  assert.deepEqual(errors, []);
});

test('public JavaScript does not inject HTML or call the network', () => {
  const jsDir = path.join(PUBLIC, 'assets', 'js');
  for (const name of fs.readdirSync(jsDir)) {
    const source = fs.readFileSync(path.join(jsDir, name), 'utf8');
    assert.equal(/innerHTML|outerHTML|insertAdjacentHTML|eval\(/.test(source), false, name);
    assert.equal(/fetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(source), false, name);
  }
});

test('journal data and the no-JS page use the same strings', () => {
  const entries = loadClassic(path.join(process.cwd(), 'assets/js/data-journal.js'), 'BUSARA_JOURNAL');
  const page = visible(readPublic('research-journal.html'));
  assert.ok(page.includes('Each status marks that entry only'));
  for (const entry of entries) {
    assert.equal(entry.status, 'Recorded');
    assert.ok(page.includes(entry.stage), entry.stage);
    assert.ok(page.includes(entry.theme), entry.theme);
    assert.ok(page.includes(entry.outcome), entry.outcome);
    for (const paragraph of entry.body) assert.ok(page.includes(paragraph), paragraph.slice(0, 48));
    for (const item of entry.observations || []) assert.ok(page.includes(item), item);
  }
  assert.equal(page.includes('Completed'), false);
  assert.equal(page.includes('validated'), false);
});

test('doctrine data strings are present in the doctrine page', () => {
  const page = visible(readPublic('doctrine.html'));
  const chain = loadClassic(path.join(process.cwd(), 'assets/js/data-doctrine-chain.js'), 'BUSARA_DOCTRINE_CHAIN');
  const method = loadClassic(path.join(process.cwd(), 'assets/js/data-doctrine-methodology.js'), 'BUSARA_DOCTRINE_METHODOLOGY');
  for (const stage of chain.concat(method)) {
    assert.ok(page.includes(stage.title), stage.title);
    assert.ok(page.includes(stage.purpose), stage.title + ' purpose');
    assert.ok(page.includes(stage.outputs || stage.leadsTo), stage.title + ' output');
  }
});

test('founder content corrections are present and the rejected wording is gone', () => {
  const all = visible(htmlFiles().map(readPublic).join('\n'));
  const required = [
    'Initiatives we are developing.',
    'What it is developing',
    'What we are developing.',
    'is working to turn an observed problem into trustworthy infrastructure',
    'Organisations building or operating infrastructure who want to work with us',
    'Entry recorded',
    'Paamoja — in development · Formal validation pending',
    'Status In development',
    'Milestone 03 Formal validation pending',
    'Operational status No service is currently operating',
    'identified as a shared problem through early conversations; formal validation is pending',
    'Busara Labs is developing infrastructure — beginning with Paamoja, and whatever follows it.',
    'Neither stage is complete.',
    'do not record an identity study',
  ];
  for (const phrase of required) assert.ok(all.includes(phrase), phrase);

  const banned = [
    'What it builds',
    'What we have actually built',
    'large and active',
    'Studied as part of the Paamoja inquiry',
    'alongside us',
    'BIT Labs',
    'in development in Nairobi',
    'turns an observed problem',
    'blockchain',
    'wallet',
  ];
  for (const phrase of banned) assert.equal(all.includes(phrase), false, phrase);

  const withoutMethod = all.replace('A need that cannot be validated is not yet a need.', '');
  assert.equal(/\bvalidated\b/i.test(withoutMethod), false, withoutMethod.match(/.{0,40}validated.{0,40}/i)?.[0]);
  assert.equal(/\b(now|is|are|been) (live|operational|launched)\b/i.test(all), false);
});

test('sheet families stay separate and the approved cross-references exist', () => {
  const all = htmlFiles().map(readPublic).join('\n');
  for (let n = 1; n <= 11; n += 1) {
    const id = 'A-' + String(n).padStart(2, '0');
    assert.ok(all.includes('>' + id + '<'), id);
  }
  for (const id of ['P-01', 'P-02', 'P-03']) assert.ok(all.includes(id), id);
  assert.match(all, />P-01</);
  assert.match(all, /P-02 · The journey/);
  assert.match(all, /P-03 · Current vision/);
  assert.ok(all.includes('A-01 of A-11'));
  assert.ok(all.includes('A-06 of A-11'));
  assert.ok(all.includes('A-07 of A-11'));
  assert.ok(all.includes('A-01 to A-11 · P-01 to P-03'));
  assert.ok(all.includes('Sheets A-01 to A-08'));
  assert.ok(all.includes('Sheets P-01 to P-03'));
  assert.ok(all.includes('>A</th>') || all.includes('>A<'));
  assert.equal(all.includes('A-12'), false);
  assert.equal(all.includes('P-04'), false);
  assert.equal(all.includes('of A-08'), false);
});

test('the deploy artifact is the public directory and does not contain repository internals', () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), '.github/workflows/deploy.yml'), 'utf8');
  const wrangler = fs.readFileSync(path.join(process.cwd(), 'wrangler.toml'), 'utf8');
  assert.match(workflow, /pages deploy public/);
  assert.equal(workflow.includes('pages deploy .'), false);
  assert.match(wrangler, /pages_build_output_dir = "public"/);
  assert.equal(fs.existsSync(path.join(PUBLIC, 'wrangler.toml')), false);
  assert.equal(fs.existsSync(path.join(PUBLIC, 'HANDOVER.md')), false);
  assert.equal(fs.existsSync(path.join(PUBLIC, 'workers')), false);
  assert.equal(fs.existsSync(path.join(PUBLIC, 'functions', 'api', 'contact.js')), true);
});

test('navigation order and current page are set without a hash-only menu', () => {
  const expected = ['Home', 'About', 'Doctrine', 'Our Work', 'Paamoja', 'Journal', 'Careers', 'Contact'];
  const home = readPublic('index.html');
  const labels = [...home.matchAll(/<ul class="nav-list">([\s\S]*?)<\/ul>/g)][0][1]
    .match(/>([^<]+)<\/a>/g)
    .map((item) => item.slice(1, -4));
  assert.deepEqual(labels, expected);
  assert.match(readPublic('careers.html'), /href="\/careers" aria-current="page"/);
  assert.match(readPublic('about.html'), /href="\/about" aria-current="page"/);
  assert.equal(home.includes('href="#about"'), false);
});
