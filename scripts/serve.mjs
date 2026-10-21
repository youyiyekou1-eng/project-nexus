import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const safePath = normalize(pathname).replace(/^([.][.][/\\])+/, '');
  const requested = join(root, safePath === '/' ? 'index.html' : safePath);
  try {
    const body = await readFile(requested);
    res.writeHead(200, { 'Content-Type': types[extname(requested)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    } catch {
      res.writeHead(500); res.end('Build first with npm run build');
    }
  }
}).listen(port, '0.0.0.0', () => console.log(`Project Nexus listening on http://0.0.0.0:${port}`));
