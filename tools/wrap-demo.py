# Move showcase/<slug>/index.html to site.html and write the Omnify shell as index.html.
# Usage: python3 tools/wrap-demo.py showcase/<slug> "Name" web|mobile "FnB/#fnb-01"
import sys, pathlib, re, html
# usage: wrap.py <dir> <name> <view> <back>
d, name, view, back = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
idx = d / 'index.html'
s = idx.read_text(encoding='utf-8')
if 'demo-bar.js' in s: sys.exit(f'{d}: already wrapped')
title = f'{name} · Demo Omnify'
if '<title>' not in s:
    m = re.search(r'<head[^>]*>', s, re.I)
    s = s[:m.end()] + f'<title>{html.escape(name)}</title>' + s[m.end():]
(d / 'site.html').write_text(s, encoding='utf-8')
idx.write_text(f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0f1410">
<link rel="icon" type="image/svg+xml" href="../../favicon.svg">
</head>
<body>
<!-- Omnify demo shell: bar + Web/Mobile tabs + the demo (site.html) in an iframe. See ../demo-bar.js -->
<script src="../demo-bar.js" data-name="{html.escape(name)}" data-src="site.html" data-view="{view}" data-back="{back}"></script>
</body>
</html>
''', encoding='utf-8')
print('wrapped', d)
