import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'index.html'), resolve(dist, 'index.html'));
await cp(resolve(root, 'styles.css'), resolve(dist, 'styles.css'));
await cp(resolve(root, 'app.js'), resolve(dist, 'app.js'));
await cp(resolve(root, 'vault.html'), resolve(dist, 'vault.html'));
await cp(resolve(root, 'vault.css'), resolve(dist, 'vault.css'));
await cp(resolve(root, 'vault.js'), resolve(dist, 'vault.js'));
await cp(resolve(root, 'data'), resolve(dist, 'data'), { recursive: true });
for (const file of ['manus-routes.json', 'nexus-mark.svg', 'robots.txt']) {
  await cp(resolve(root, 'public', file), resolve(dist, file));
}
console.log(`Built Project Nexus LP to ${dist}`);
