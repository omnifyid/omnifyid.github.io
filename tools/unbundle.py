# Turn an exported "Bundled Page" .html into showcase/<slug>/index.html + assets/.
# Usage: python3 -I tools/unbundle.py "~/Downloads/export/Name.html" showcase/<slug>
# Then run tools/wrap-demo.py to move it to site.html and add the Omnify shell.
# Unpack a "Bundled Page" single-file export into <out>/index.html + <out>/assets/*.
import sys, json, re, base64, gzip, pathlib, mimetypes, html
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
s = src.read_text(encoding='utf-8')
def block(t):
    m = re.search(r'<script type="%s">(.*?)</script>' % re.escape(t), s, re.S)
    return m.group(1) if m else None
manifest = json.loads(block('__bundler/manifest'))
template = json.loads(block('__bundler/template'))
ext = json.loads(block('__bundler/ext_resources') or '[]')
pages = json.loads(block('__bundler/page_order') or '[]')
assert not pages, 'nested pages not supported'
EXT = {'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/svg+xml':'.svg','image/gif':'.gif','image/avif':'.avif',
       'font/woff2':'.woff2','font/woff':'.woff','font/ttf':'.ttf','font/otf':'.otf','application/javascript':'.js','text/javascript':'.js',
       'text/css':'.css','video/mp4':'.mp4','text/html':'.html','application/json':'.json','text/plain':'.txt','text/jsx':'.jsx','text/babel':'.jsx'}
(out / 'assets').mkdir(parents=True, exist_ok=True)
paths = {}
for uuid, e in manifest.items():
    b = base64.b64decode(e['data'])
    if e.get('compressed'): b = gzip.decompress(b)
    x = EXT.get(e['mime']) or mimetypes.guess_extension(e['mime']) or '.bin'
    p = 'assets/%s%s' % (uuid[:8], x)
    (out / p).write_bytes(b)
    paths[uuid] = p
for uuid, p in paths.items():
    template = template.replace(uuid, p)
template = re.sub(r'\s+integrity="[^"]*"', '', template, flags=re.I)
template = re.sub(r'\s+crossorigin="[^"]*"', '', template, flags=re.I)
res = {e['id']: paths[e['uuid']] for e in ext if e['uuid'] in paths}
rs = '<script>window.__resources = ' + json.dumps(res).replace('</', '<\\/') + ';</script>'
m = re.search(r'<head[^>]*>', template, re.I)
template = template[:m.end()] + rs + template[m.end():]
(out / 'index.html').write_text(template, encoding='utf-8')
print(out, len(paths), 'assets', sum((out/p).stat().st_size for p in paths.values())//1024, 'KB', 'html', len(template)//1024, 'KB')
