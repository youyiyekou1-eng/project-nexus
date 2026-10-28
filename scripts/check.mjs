import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const required = [
  'index.html',
  'vault.html',
  'styles.css',
  'vault.css',
  'app.js',
  'vault.js',
  'data/evidence-summary.json',
  'public/manus-routes.json',
];

for (const file of required) await access(resolve(root, file));
const routes = JSON.parse(await readFile(resolve(root, 'public/manus-routes.json'), 'utf8'));
const paths = routes.routes.map((route) => route.path);
if (!paths.includes('/') || !paths.includes('/vault.html')) throw new Error('route manifest is incomplete');
const summary = JSON.parse(await readFile(resolve(root, 'data/evidence-summary.json'), 'utf8'));
if (summary.security.secretsPublished !== false) throw new Error('public secret policy failed');
if (summary.security.walletAddressesRedacted !== true) throw new Error('wallet redaction policy failed');
if (!summary.claims.some((claim) => claim.status === 'unverified')) throw new Error('unverified state is missing');
const source = await Promise.all(['index.html', 'vault.html', 'app.js', 'vault.js'].map((file) => readFile(resolve(root, file), 'utf8')));
const joined = source.join('\n');
if (/0x[a-f0-9]{40}/i.test(joined)) throw new Error('full wallet-like address found in public source');
if (/-----BEGIN [A-Z ]+ KEY-----/.test(joined)) throw new Error('private key material found in public source');
console.log(`CHECK_OK files=${required.length} routes=${paths.length} claims=${summary.claims.length}`);
