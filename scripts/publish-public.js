/* Copy the current site into public/ by allowlist.
   The Pages upload is this directory. Operational files in the
   repository root are not on the allowlist, so they are not served.
   This script does not change page copy or the contact handler.
*/

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const ROOT_FILES = ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'site.webmanifest'];

function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  for (const name of fs.readdirSync(ROOT)) {
    if (name.endsWith('.html')) {
      fs.copyFileSync(path.join(ROOT, name), path.join(OUT, name));
    }
  }
  for (const name of ROOT_FILES) {
    const source = path.join(ROOT, name);
    if (!fs.existsSync(source)) throw new Error('Missing site file ' + name);
    fs.copyFileSync(source, path.join(OUT, name));
  }
  fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'functions'), path.join(OUT, 'functions'), { recursive: true });

  require('./assert-public-artifact').assertPublicArtifact(OUT);
  const html = fs.readdirSync(OUT).filter((name) => name.endsWith('.html'));
  if (html.length < 8) throw new Error('Public directory is missing site pages');
  console.log('Published ' + html.length + ' HTML files into public/');
}

main();
