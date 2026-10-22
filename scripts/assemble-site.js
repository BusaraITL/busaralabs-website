/* Assemble the multi-page site into public/.
   Source of truth for the drawing sheets: site/prototype.html
   Journal entries are rendered from assets/js/data-journal.js so the
   no-JS HTML and the data file stay the same strings.
   No new runtime dependency. */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const ORIGIN = 'https://busaralabs.com';

const PAGES = {
  index: {
    file: 'index.html',
    path: '/',
    title: 'Busara Labs — Infrastructure for Trust',
    description: 'Busara Labs. Paamoja, its first public initiative, is in development. Formal validation is pending. No service is currently operating.',
  },
  about: {
    file: 'about.html',
    path: '/about',
    title: 'About — Busara Labs',
    description: 'Busara Labs begins with people, institutions, and observed problems.',
  },
  doctrine: {
    file: 'doctrine.html',
    path: '/doctrine',
    title: 'Doctrine — Busara Labs',
    description: 'The Busara Doctrine: purpose, beliefs, method, limits, and the initiatives being developed.',
  },
  work: {
    file: 'work.html',
    path: '/work',
    title: 'Our Work — Busara Labs',
    description: 'What is published, what is in development, and what is still a question. Paamoja is not operating.',
  },
  paamoja: {
    file: 'paamoja.html',
    path: '/paamoja',
    title: 'Paamoja — Busara Labs',
    description: 'Paamoja is in development. Formal validation is pending. No service is currently operating.',
  },
  'research-journal': {
    file: 'research-journal.html',
    path: '/research-journal',
    title: 'Research Journal — Busara Labs',
    description: 'A public record of institutional learning. Entry status describes the entry, not a completed phase.',
  },
  careers: {
    file: 'careers.html',
    path: '/careers',
    title: 'Careers — Busara Labs',
    description: 'There are no open positions. Application intake is not enabled. Do not send CVs or identity documents.',
  },
  contact: {
    file: 'contact.html',
    path: '/contact',
    title: 'Contact — Busara Labs',
    description: 'Email Busara Labs from your own mail application. This website does not collect form submissions.',
  },
};

const NAV = [
  ['index', 'Home', '/'],
  ['about', 'About', '/about'],
  ['doctrine', 'Doctrine', '/doctrine'],
  ['work', 'Our Work', '/work'],
  ['paamoja', 'Paamoja', '/paamoja'],
  ['research-journal', 'Journal', '/research-journal'],
  ['careers', 'Careers', '/careers'],
  ['contact', 'Contact', '/contact'],
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadClassic(file, key) {
  const sandbox = { window: {} };
  vm.runInNewContext(read(file), sandbox, { filename: file });
  if (!sandbox.window[key]) throw new Error('Missing ' + key + ' in ' + file);
  return sandbox.window[key];
}

function renderJournal(entries) {
  const items = entries.map((entry) => {
    if (entry.status !== 'Recorded') {
      throw new Error('Journal entry ' + entry.id + ' must use status Recorded, not ' + entry.status);
    }
    const paragraphs = entry.body.map((paragraph) => '          <p>' + esc(paragraph) + '</p>').join('\n');
    const observations = (entry.observations || []).map((item) => '<li>' + esc(item) + '</li>').join('');
    return [
      '      <li><article class="entry" aria-labelledby="entry-' + esc(entry.id) + '">',
      '        <p class="entry-meta"><span class="mono">Entry ' + esc(entry.id) + '</span><span class="status status--recorded">Entry recorded</span><span class="mono muted">' + esc(entry.date) + '</span></p>',
      '        <h4 id="entry-' + esc(entry.id) + '">' + esc(entry.stage) + '</h4>',
      '        <p class="entry-theme">' + esc(entry.theme) + '</p>',
      '        <div class="entry-body">',
      paragraphs,
      '        </div>',
      '        <div class="entry-obs"><p class="mono muted">' + esc(entry.observationsLabel || '') + '</p><ul>' + observations + '</ul></div>',
      '        <div class="entry-outcome"><p class="mono">What it established</p><p>' + esc(entry.outcome) + '</p></div>',
      '      </article></li>',
    ].join('\n');
  }).join('\n');
  return '<ol class="journal" aria-label="Research Journal entries, in sequence">\n' + items + '\n    </ol>';
}

function replaceJournal(html) {
  const entries = loadClassic('assets/js/data-journal.js', 'BUSARA_JOURNAL');
  const rendered = renderJournal(entries);
  const start = html.indexOf('<ol class="journal"');
  const end = html.indexOf('</ol>', start);
  if (start < 0 || end < 0) throw new Error('Journal list not found in prototype');
  return html.slice(0, start) + rendered + html.slice(end + '</ol>'.length);
}

function matchClose(html, start, open, close) {
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const nextOpen = html.indexOf(open, i);
    const nextClose = html.indexOf(close, i);
    if (nextClose < 0) throw new Error('Unclosed ' + open);
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + open.length;
    } else {
      depth -= 1;
      i = nextClose + close.length;
      if (depth === 0) return i;
    }
  }
  throw new Error('Unclosed ' + open);
}

function extractBlocks(mainHtml) {
  const blocks = [];
  let i = 0;
  while (i < mainHtml.length) {
    const sectionAt = mainHtml.indexOf('<section', i);
    const handoverAt = mainHtml.indexOf('<div class="handover"', i);
    let start = -1;
    let open = '';
    let close = '';
    if (sectionAt === -1 && handoverAt === -1) break;
    if (handoverAt !== -1 && (sectionAt === -1 || handoverAt < sectionAt)) {
      start = handoverAt;
      open = '<div';
      close = '</div>';
    } else {
      start = sectionAt;
      open = '<section';
      close = '</section>';
    }
    const end = matchClose(mainHtml, start, open, close);
    blocks.push(mainHtml.slice(start, end));
    i = end;
  }
  if (!blocks.length) throw new Error('No sheets found');
  return blocks;
}

function dataPage(block) {
  const match = block.match(/\bdata-page="([^"]+)"/);
  return match ? match[1] : '';
}

function groupPages(blocks) {
  const pages = [];
  let current = null;
  blocks.forEach((block) => {
    const id = dataPage(block);
    if (!current || (id && id !== current.id)) {
      current = { id: id || 'index', blocks: [] };
      pages.push(current);
    }
    current.blocks.push(block);
  });
  return pages;
}

function collectIds(html) {
  const ids = [];
  const re = /\sid="([^"]+)"/g;
  let match;
  while ((match = re.exec(html))) ids.push(match[1]);
  return ids;
}

function rewriteLinks(html, pageId, idToPage) {
  return html.replace(/href="#([^"]+)"/g, (full, id) => {
    const target = idToPage.get(id);
    if (!target) return full;
    if (target === pageId) return 'href="#' + id + '"';
    const dest = PAGES[target];
    if (!dest) return full;
    return 'href="' + dest.path + '#' + id + '"';
  }).replace(/(?:href|src)="assets\//g, (attr) => attr.replace('assets/', '/assets/'));
}

function normalizeHeadings(html) {
  let out = html
    .replace(/<h4\b/g, '<h@4').replace(/<\/h4>/g, '</h@4>')
    .replace(/<h3\b/g, '<h@3').replace(/<\/h3>/g, '</h@3>')
    .replace(/<h2\b/g, '<h@2').replace(/<\/h2>/g, '</h@2>');
  out = out.replace('<h@2', '<h1').replace('</h@2>', '</h1>');
  out = out
    .replace(/<h@2\b/g, '<h2').replace(/<\/h@2>/g, '</h2>')
    .replace(/<h@3\b/g, '<h2').replace(/<\/h@3>/g, '</h2>')
    .replace(/<h@4\b/g, '<h3').replace(/<\/h@4>/g, '</h3>');
  return out;
}

function navHtml(current) {
  const items = NAV.map(([id, label, href]) => {
    const currentAttr = id === current ? ' aria-current="page"' : '';
    return '        <li><a href="' + href + '"' + currentAttr + '>' + label + '</a></li>';
  }).join('\n');
  return [
    '<header class="site-header">',
    '  <div class="wrap">',
    '    <a class="brand" href="/" aria-label="Busara Labs, home">',
    '      <svg viewBox="30 40 140 120" aria-hidden="true" focusable="false"><polygon points="30,40 170,40 135,160 65,160" fill="#001A33"/><text x="100" y="93.3" font-family="\'DM Serif Display\', Georgia, serif" font-size="100" fill="#C9A84C" text-anchor="middle" dominant-baseline="central">B</text></svg>',
    '      <span><span class="brand-name">Busara Labs</span><span class="brand-tag">Infrastructure for Trust</span></span>',
    '    </a>',
    '    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" hidden><span class="nav-toggle-bars" aria-hidden="true"></span><span class="nav-toggle-label">Menu</span></button>',
    '    <nav class="site-nav" id="site-nav" aria-label="Primary">',
    '      <ul class="nav-list">',
    items,
    '      </ul>',
    '      <p class="nav-meta">Busara Infrastructure &amp; Technology Labs Ltd · Nairobi, Kenya</p>',
    '    </nav>',
    '  </div>',
    '</header>',
  ].join('\n');
}

function footerHtml() {
  return [
    '<footer class="site-footer">',
    '  <div class="wrap">',
    '    <div class="foot-sheet">',
    '      <div class="foot-cols">',
    '        <div class="foot-id">',
    '          <p class="brand"><svg viewBox="30 40 140 120" width="40" height="40" aria-hidden="true" focusable="false"><polygon points="30,40 170,40 135,160 65,160" fill="#001A33"/><text x="100" y="93.3" font-family="\'DM Serif Display\', Georgia, serif" font-size="100" fill="#C9A84C" text-anchor="middle" dominant-baseline="central">B</text></svg><span><span class="brand-name">Busara Labs</span><span class="brand-tag">Infrastructure for Trust</span></span></p>',
    '          <p class="foot-index"><span>Sheets</span><span>A-01 to A-11 · P-01 to P-03</span></p>',
    '        </div>',
    '        <nav aria-label="Footer: sections"><h2>Sections</h2><ul><li><a href="/about">About</a></li><li><a href="/doctrine">Doctrine</a></li><li><a href="/work">Our Work</a></li><li><a href="/paamoja">Paamoja</a></li><li><a href="/research-journal">Journal</a></li><li><a href="/careers">Careers</a></li><li><a href="/contact">Contact</a></li></ul></nav>',
    '        <nav aria-label="Footer: knowledge"><h2>Knowledge</h2><ul><li><a href="/doctrine">Doctrine</a></li><li><a href="/research-journal">Research Journal</a></li></ul></nav>',
    '        <nav aria-label="Footer: legal"><h2>Legal</h2><ul><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms-of-service">Terms &amp; Conditions</a></li><li><a href="/cookie-policy">Cookie Policy</a></li><li><a href="/disclaimer">Disclaimer</a></li></ul></nav>',
    '      </div>',
    '      <div class="foot-legal">',
    '        <span>© 2026 Busara Infrastructure &amp; Technology Labs Ltd. Registered in Kenya.</span>',
    '        <span>This website does not collect form data.</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>',
  ].join('\n');
}

function pageShell({ title, description, canonical, robots, current, mainClass, mainHtml, scripts }) {
  const robotMeta = robots ? '<meta name="robots" content="' + robots + '">\n' : '';
  const scriptTags = scripts.map((src) => '<script src="' + src + '" defer></script>').join('\n');
  return [
    '<!doctype html>',
    '<html lang="en-KE" class="no-js">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    robotMeta + '<title>' + esc(title) + '</title>',
    '<meta name="description" content="' + esc(description) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:title" content="' + esc(title) + '">',
    '<meta property="og:description" content="' + esc(description) + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:type" content="website">',
    '<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<link rel="stylesheet" href="/assets/css/fonts.css">',
    '<link rel="stylesheet" href="/assets/css/tokens.css">',
    '<link rel="stylesheet" href="/assets/css/base.css">',
    '<link rel="stylesheet" href="/assets/css/layout.css">',
    '<link rel="stylesheet" href="/assets/css/components.css">',
    scriptTags,
    '</head>',
    '<body>',
    '<a class="skip" href="#main">Skip to content</a>',
    navHtml(current),
    '<main id="main"' + (mainClass ? ' class="' + mainClass + '"' : '') + '>',
    mainHtml,
    '</main>',
    footerHtml(),
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function sheetPages(prototype) {
  const withJournal = replaceJournal(prototype);
  const mainStart = withJournal.indexOf('<main id="main">');
  const mainEnd = withJournal.indexOf('</main>');
  if (mainStart < 0 || mainEnd < 0) throw new Error('main not found');
  const mainHtml = withJournal.slice(mainStart + '<main id="main">'.length, mainEnd);
  const grouped = groupPages(extractBlocks(mainHtml));
  const idToPage = new Map();
  grouped.forEach((page) => {
    const html = page.blocks.join('\n');
    collectIds(html).forEach((id) => {
      if (idToPage.has(id)) throw new Error('Duplicate id ' + id);
      idToPage.set(id, page.id);
    });
  });
  const expected = Object.keys(PAGES);
  grouped.forEach((page) => {
    if (!PAGES[page.id]) throw new Error('Unexpected page ' + page.id);
  });
  expected.forEach((id) => {
    if (!grouped.some((page) => page.id === id)) throw new Error('Missing page ' + id);
  });

  const files = [];
  grouped.forEach((page) => {
    const meta = PAGES[page.id];
    let body = rewriteLinks(page.blocks.join('\n'), page.id, idToPage);
    const inner = page.id !== 'index';
    if (inner) body = normalizeHeadings(body);
    const scripts = ['/assets/js/config.js', '/assets/js/nav.js', '/assets/js/scrollspy.js'];
    if (page.id === 'contact') scripts.push('/assets/js/demo-form.js');
    files.push({
      file: meta.file,
      html: pageShell({
        title: meta.title,
        description: meta.description,
        canonical: ORIGIN + meta.path,
        current: page.id,
        mainClass: inner ? 'page-inner' : '',
        mainHtml: body,
        scripts,
      }),
    });
  });
  return files;
}

function legalPages() {
  const dir = path.join(ROOT, 'site', 'legal');
  return fs.readdirSync(dir).filter((name) => name.endsWith('.html')).map((name) => {
    const id = name.replace(/\.html$/, '');
    const titles = {
      'privacy-policy': ['Privacy Policy — Busara Labs', 'How busaralabs.com handles data while collection is disabled.'],
      'terms-of-service': ['Terms & Conditions — Busara Labs', 'Terms for using the Busara Labs website.'],
      'cookie-policy': ['Cookie Policy — Busara Labs', 'What this website does and does not store on your device.'],
      disclaimer: ['Disclaimer — Busara Labs', 'The Busara Labs website is informational. Paamoja is not operating.'],
    };
    const pair = titles[id];
    if (!pair) throw new Error('Unknown legal page ' + name);
    const body = fs.readFileSync(path.join(dir, name), 'utf8').trim();
    return {
      file: name,
      html: pageShell({
        title: pair[0],
        description: pair[1],
        canonical: ORIGIN + '/' + id,
        current: '',
        mainClass: 'page-inner legal-sheet',
        mainHtml: body,
        scripts: ['/assets/js/config.js', '/assets/js/nav.js', '/assets/js/scrollspy.js'],
      }),
    };
  });
}

function notFoundPage() {
  return pageShell({
    title: 'Page not found — Busara Labs',
    description: 'This page does not exist.',
    canonical: ORIGIN + '/404',
    robots: 'noindex, nofollow',
    current: '',
    mainClass: 'page-inner legal-sheet',
    mainHtml: [
      '<section class="sheet" aria-labelledby="missing-title">',
      '  <div class="wrap">',
      '    <p class="sheet-ref"><span>404</span><span>Busara Labs</span></p>',
      '    <h1 id="missing-title">This page does not exist.</h1>',
      '    <p class="lead">The address may be mistyped, or the page may have moved.</p>',
      '    <div class="actions"><a class="btn" href="/">Back to Home <span class="arrow" aria-hidden="true">→</span></a></div>',
      '  </div>',
      '</section>',
    ].join('\n'),
    scripts: ['/assets/js/config.js', '/assets/js/nav.js', '/assets/js/scrollspy.js'],
  });
}

function copyDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

function main() {
  const prototype = read('site/prototype.html');
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const pages = sheetPages(prototype).concat(legalPages());
  pages.push({ file: '404.html', html: notFoundPage() });
  pages.forEach((page) => {
    fs.writeFileSync(path.join(OUT, page.file), page.html);
  });
  copyDir(path.join(ROOT, 'site', 'assets'), path.join(OUT, 'assets'));
  copyDir(path.join(ROOT, 'functions'), path.join(OUT, 'functions'));
  copyDir(path.join(ROOT, 'site', 'static'), OUT);
  const banned = ['wrangler.toml', 'HANDOVER.md', 'package.json'];
  banned.forEach((name) => {
    if (fs.existsSync(path.join(OUT, name))) throw new Error('Refusing to publish ' + name);
  });
  if (fs.existsSync(path.join(OUT, 'workers'))) throw new Error('Refusing to publish workers/');
  console.log('Assembled ' + pages.length + ' HTML files into public/');
}

main();
