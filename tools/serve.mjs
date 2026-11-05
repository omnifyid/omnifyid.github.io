// Tiny static server for checking the site locally (python's http.server drops connections
// when a page loads many assets at once). Usage: node tools/serve.mjs [port]  ->  http://localhost:8765/
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname), port = +process.argv[2] || 8765;
const M = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.jsx':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4','.md':'text/plain; charset=utf-8','.ico':'image/x-icon'};
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
  try { if (fs.statSync(f).isDirectory()) { if (!p.endsWith('/')) { res.writeHead(301, {Location: p + '/'}).end(); return; } f = path.join(f, 'index.html'); } } catch {}
  fs.stat(f, (e, st) => {
    if (e) { res.writeHead(404, {'content-type':'text/html'}); fs.createReadStream(path.join(root, '404.html')).pipe(res); return; }
    const type = M[path.extname(f).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;
    if (range) { const [a, b] = range.replace('bytes=', '').split('-'); const s = +a, en = b ? +b : st.size - 1;
      res.writeHead(206, {'content-type': type, 'content-range': `bytes ${s}-${en}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': en - s + 1, 'cache-control': 'no-store'}); fs.createReadStream(f, {start: s, end: en}).pipe(res); return; }
    res.writeHead(200, {'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-store'}); fs.createReadStream(f).pipe(res);
  });
}).listen(port, () => console.log('serving', root, port));
