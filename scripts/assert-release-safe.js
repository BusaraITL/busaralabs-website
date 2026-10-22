/* Refuse a release whose upload root or collection switch
   would undo the guards. A Cloudflare dashboard rollback to a
   deployment that uploaded "." is outside this script. That
   rollback is forbidden in docs/security/RELEASE-RECORD.md. */

'use strict';

const fs = require('fs');
const path = require('path');

const PRODUCTION_D1 = '27a86a12-f597-4a23-9835-ee4f3e889185';
const PRODUCTION_KV = 'e0f93da5591d40d3938b6c938e7c8d2a';

function assertReleaseSafe(root) {
  const errors = [];
  const wrangler = fs.readFileSync(path.join(root, 'wrangler.toml'), 'utf8');
  const worker = fs.readFileSync(path.join(root, 'workers', 'wrangler.worker.toml'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');

  if (!/pages_build_output_dir\s*=\s*"public"/.test(wrangler)) {
    errors.push('pages_build_output_dir must be "public"');
  }
  if (/pages_build_output_dir\s*=\s*"\."/.test(wrangler)) {
    errors.push('pages_build_output_dir must not be the repository root');
  }
  if (/pages deploy \./.test(workflow)) {
    errors.push('workflow deploys the repository root');
  }
  if (/pull_request_target/.test(workflow)) {
    errors.push('workflow uses pull_request_target');
  }
  for (const [label, text] of [['wrangler.toml', wrangler], ['workers/wrangler.worker.toml', worker]]) {
    if (assigned(text, 'COLLECTION_ENABLED') || assigned(text, 'COLLECTION_PRODUCTION_ACK')) {
      errors.push(label + ' assigns a collection switch');
    }
  }
  const preview = codeOnly(wrangler.split('[env.production]')[0]);
  if (preview.includes(PRODUCTION_D1) || preview.includes(PRODUCTION_KV) || preview.includes('contact-production')) {
    errors.push('preview bindings include a production resource id');
  }
  const staging = codeOnly(worker.split('[env.production]')[0]);
  if (staging.includes(PRODUCTION_D1) || staging.includes(PRODUCTION_KV) || staging.includes('contact-production')) {
    errors.push('staging worker bindings include a production resource id');
  }
  if (/\[\[.*r2_buckets\]\]/.test(wrangler + worker) || /\[\[.*services\]\]/.test(wrangler + worker)) {
    errors.push('unexpected R2 or service binding');
  }

  if (errors.length) {
    throw new Error('Release is not safe:\n' + errors.join('\n'));
  }
}

function codeOnly(text) {
  return text.split('\n').filter((line) => !line.trim().startsWith('#')).join('\n');
}

function assigned(text, name) {
  return text.split('\n').some((line) => {
    const code = line.split('#')[0];
    return new RegExp('^\\s*' + name + '\\s*=').test(code);
  });
}

module.exports = { assertReleaseSafe };

if (require.main === module) {
  assertReleaseSafe(path.resolve(process.argv[2] || path.join(__dirname, '..')));
  console.log('Release configuration keeps the public directory and the collection switch off.');
}
