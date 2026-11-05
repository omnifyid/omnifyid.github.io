/* Omnify landing pages — hamburger menu for mobile (<= 640px).
   Usage: <script src="../hamburger.js" data-site="elevate" defer></script>
   Hides the desktop nav links on small screens and shows a ☰ button that opens a dropdown
   with the same links. Clicking a panel item triggers the original link (so page handlers still run). */
(function () {
  var BP = 640;
  var SITES = {
    elevate:      { nav: 'nav', hide: 'nav > div', links: 'nav > div a', bg: '#0f1410', fg: '#F4F2EE', line: 'rgba(244,242,238,.18)', pos: 'abs', host: 'header', hostTop: 68 },
    'first-floor':{ nav: 'nav', hide: 'nav > a', links: 'nav > a', bg: '#0b7a4f', fg: '#fff', line: 'rgba(255,255,255,.25)', pos: 'flow', panel: 'right' },
    'kopi-kala':  { nav: 'nav', hide: 'nav > div', links: 'nav > div a', bg: '#efeeeb', fg: '#141414', line: 'rgba(20,20,20,.15)', pos: 'abs' },
    'rumah-senja':{ nav: '.om-nav', hide: '.om-nav-l, .om-nav .om-hide', links: '.om-nav-l a, .om-nav .om-hide', bg: '#120e0b', fg: '#F3EBDD', line: 'rgba(243,235,221,.18)', pos: 'flow', mount: '.om-nav > div:last-child',
                    css: '.om-nav{gap:8px !important}.om-nav > a{gap:8px !important;min-width:0}.om-nav .om-logo{font-size:13px !important;letter-spacing:.16em !important}.om-nav svg{width:24px !important;height:24px !important}.om-nav > div:last-child{gap:8px !important}.om-nav a[href="#reserve"]{padding:10px 12px !important}' },
    'dapur-awan': { nav: '.om-dnav', hide: '.om-dlinks', links: '.om-dlinks a', bg: '#f1eff4', fg: '#17151f', line: 'rgba(23,21,31,.15)', pos: 'flow',
                    css: '.om-dnav{flex-wrap:nowrap !important;column-gap:10px !important}.om-dnav > div:first-child{min-width:0;gap:8px !important}.om-dnav > div:first-child > div{font-size:21px !important}.om-dnav svg{width:32px !important;height:32px !important}.om-bag{padding:9px 12px !important;font-size:14px !important}' },
    pualam:       { nav: '.om-hd', hide: '.om-hd-nav', links: '.om-hd-nav a', cta: '.om-hd-cta', bg: '#F6F4EF', fg: '#1E1C19', line: 'rgba(30,28,25,.15)', pos: 'flow', css: '.om-hd{flex-wrap:nowrap !important;justify-content:space-between}' },
    jangkar:      { nav: 'header', hide: 'header nav', links: 'header nav a', cta: 'header > a[data-om-booking]', bg: '#12352A', fg: '#F2EBDD', line: 'rgba(242,235,221,.2)', pos: 'flow', css: 'header{flex-wrap:nowrap !important}' }
  };
  var me = document.currentScript;
  var cfg = SITES[me && me.getAttribute('data-site')];
  if (!cfg) return;

  var css = document.createElement('style');
  css.textContent =
    '.om-burger,.om-mpanel{display:none !important}' +
    '@media (max-width:' + BP + 'px){' +
    cfg.hide + (cfg.cta ? ',' + cfg.cta : '') + '{display:none !important}' + (cfg.css || '') +
    '.om-burger{display:inline-flex !important;align-items:center;justify-content:center;flex:none;width:44px;height:44px;padding:0;border-radius:999px;' +
      'background:transparent;color:' + cfg.fg + ';border:1px solid ' + cfg.line + ';cursor:pointer;pointer-events:auto;order:9;position:relative;z-index:101}' +
    '.om-burger.abs{position:absolute;right:16px;top:12px}' +
    '.om-burger:focus-visible{outline:3px solid currentColor;outline-offset:3px}' +
    '.om-burger span{position:relative;display:block;width:18px;height:2px;background:currentColor;border-radius:2px;transition:background .2s}' +
    '.om-burger span::before,.om-burger span::after{content:"";position:absolute;left:0;width:18px;height:2px;background:currentColor;border-radius:2px;transition:transform .25s,top .25s}' +
    '.om-burger span::before{top:-6px}.om-burger span::after{top:6px}' +
    '.om-burger[aria-expanded=true] span{background:transparent}' +
    '.om-burger[aria-expanded=true] span::before{top:0;transform:rotate(45deg)}' +
    '.om-burger[aria-expanded=true] span::after{top:0;transform:rotate(-45deg)}' +
    '.om-mpanel{position:absolute;top:100%;left:0;right:0;z-index:100;display:none;flex-direction:column;padding:8px 20px 16px;' +
      'background:' + cfg.bg + ';color:' + cfg.fg + ';border-bottom:1px solid ' + cfg.line + ';box-shadow:0 18px 30px rgba(0,0,0,.18);pointer-events:auto;text-transform:none;letter-spacing:normal}' +
    '.om-mpanel.right{left:auto;right:12px;top:calc(100% + 6px);width:min(260px,calc(100vw - 24px));border:1px solid ' + cfg.line + ';border-radius:16px}' +
    '.om-mpanel.open{display:flex !important}' +
    '.om-mpanel button{all:unset;box-sizing:border-box;display:flex;align-items:center;min-height:48px;padding:0 4px;font:500 17px/1.3 system-ui,sans-serif;' +
      'color:' + cfg.fg + ';cursor:pointer;border-bottom:1px solid ' + cfg.line + '}' +
    '.om-mpanel button:last-child{border-bottom:0}' +
    '.om-mpanel button:focus-visible{outline:3px solid currentColor;outline-offset:-3px}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.om-burger span,.om-burger span::before,.om-burger span::after{transition:none}}';
  document.head.appendChild(css);

  var btn, panel, nav;

  function close() {
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Buka menu');
    panel.classList.remove('open');
  }
  function build() {
    nav = document.querySelector(cfg.nav);
    if (!nav) return false;
    var links = Array.prototype.slice.call(document.querySelectorAll(cfg.links + (cfg.cta ? ',' + cfg.cta : '')));
    if (!links.length) return false;
    if (btn && nav.contains(btn) && panel && panel.isConnected) return true;
    if (getComputedStyle(nav).position === 'static') nav.style.position = 'relative';
    nav.style.zIndex = '60';

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'om-burger' + (cfg.pos === 'abs' ? ' abs' : '');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Buka menu');
    btn.innerHTML = '<span aria-hidden="true"></span>';

    panel = document.createElement('aside');
    panel.className = 'om-mpanel' + (cfg.panel === 'right' ? ' right' : '');
    panel.setAttribute('role', 'menu');
    links.forEach(function (a) {
      var label = (a.textContent || '').trim();
      if (!label) return;
      var item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'menuitem');
      item.textContent = label;
      item.addEventListener('click', function () { close(); a.click(); });
      panel.appendChild(item);
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    (cfg.mount ? nav.querySelector(cfg.mount) || nav : nav).appendChild(btn);
    var host = cfg.host ? nav.closest(cfg.host) || nav : nav;
    if (host !== nav && getComputedStyle(host).position === 'static') host.style.position = 'relative';
    if (cfg.hostTop && host !== nav) panel.style.top = cfg.hostTop + 'px';
    host.appendChild(panel);
    return true;
  }

  document.addEventListener('click', function (e) { if (panel && !panel.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel && panel.classList.contains('open')) { close(); btn.focus(); } });
  window.matchMedia('(max-width:' + BP + 'px)').addEventListener('change', close);

  // pages render their DOM at runtime and may re-render the nav: keep the button in place
  var t;
  function ensure() { clearTimeout(t); t = setTimeout(function () { try { build(); } catch (e) {} }, 60); }
  new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
