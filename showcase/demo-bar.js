// Omnify Lab showcase shell: bar (back · Web/Mobile tabs · WhatsApp) + the demo in an iframe.
//
// Each showcase/<slug>/index.html is only this, the demo itself lives next to it (site.html):
//   <script src="../demo-bar.js" data-name="Rumah Senja" data-src="site.html"
//           data-view="web" data-back="FnB/#fnb-01"></script>
//
// data-name  Project name (tab title + WhatsApp message).
// data-src   The demo page, relative to this folder. Default "site.html".
// data-view  Default view: "web" (landing pages) or "mobile" (booking apps).
//            ?view=web|mobile in the URL overrides it, and the tabs keep the URL in sync.
// data-back  Fallback "back" target (from the site root) when the page was opened directly.
//            A valid ?from=... in the URL (added by the portfolio cards) wins over it.
//
// On screens narrower than 700px the tabs are hidden: the visitor is already on a phone,
// so the demo simply fills the screen under the bar.
(function () {
  'use strict';
  var me = document.currentScript;
  var attr = function (n, d) { return (me && me.getAttribute(n)) || d; };
  var WA = '6282119688218';
  var name = attr('data-name', 'Demo');
  var src = attr('data-src', 'site.html');
  var q = new URLSearchParams(location.search);
  var SAFE = /^(FnB|Marketplace|Lainnya)\/(#[A-Za-z0-9_-]+)?$/; // never redirect off-site
  var back = SAFE.test(q.get('from') || '') ? q.get('from') : attr('data-back', '');
  if (!SAFE.test(back)) back = '';
  var view = /^(web|mobile)$/.test(q.get('view') || '') ? q.get('view') : (attr('data-view', 'web') === 'mobile' ? 'mobile' : 'web');
  var lang = 'id';
  try { lang = localStorage.getItem('omnify-lang') || 'id'; } catch (e) {}
  var t = lang === 'en'
    ? { back: 'Back to portfolio', backS: 'Back', wa: 'Consult via WhatsApp', waS: 'Consult', web: 'Web', mobile: 'Mobile',
        msg: "Hi Omnify Lab, I just tried the " + name + " demo and I'd like something similar for my business." }
    : { back: 'Kembali ke portofolio', backS: 'Kembali', wa: 'Konsultasi via WhatsApp', waS: 'Konsultasi', web: 'Web', mobile: 'Mobile',
        msg: 'Halo Omnify Lab, saya baru coba demo ' + name + ' dan ingin dibuatkan yang serupa untuk bisnis saya.' };
  if (!document.title) document.title = name + ' · Demo Omnify Lab';

  var H = 56, PW = 390, PH = 844, BEZEL = 12;
  var css = [
    'html,body{margin:0;height:100%;overflow:hidden;background:#e9ebe6}',
    "#om-bar{position:fixed;left:0;right:0;top:0;z-index:2;height:" + H + "px;padding:env(safe-area-inset-top) max(16px,env(safe-area-inset-right)) 0 max(16px,env(safe-area-inset-left));box-sizing:content-box;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;background:#0f1410;color:#eef4ea;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased}",
    '#om-bar a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;white-space:nowrap;border-radius:8px;min-height:40px;box-sizing:border-box}',
    '#om-bar .om-back{color:#eef4ea;padding:0 6px;justify-self:start}#om-bar .om-back:hover{color:#fff;text-decoration:underline;text-underline-offset:4px}',
    '#om-bar .om-wa{justify-self:end;background:oklch(0.8 0.17 140);color:#0f1410;padding:0 16px}#om-bar .om-wa:hover{background:oklch(0.86 0.15 140)}',
    '#om-tabs{display:flex;gap:2px;padding:3px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}',
    '#om-tabs button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:7px;padding:0 14px;height:34px;border-radius:7px;color:#a9b5a6;font:600 13px/1 inherit;font-family:inherit}',
    '#om-tabs button:hover{color:#fff}#om-tabs button[aria-selected=true]{background:#eef4ea;color:#0f1410}',
    '#om-tabs button:focus-visible,#om-bar a:focus-visible{outline:2px solid oklch(0.8 0.17 140);outline-offset:2px}',
    '#om-stage{position:fixed;left:0;right:0;bottom:0;top:calc(' + H + 'px + env(safe-area-inset-top));overflow:hidden}',
    '#om-phone{position:absolute;left:50%;top:50%;width:' + PW + 'px;height:' + PH + 'px;transform-origin:center center}',
    '#om-frame{display:block;border:0;width:100%;height:100%;background:#fff}',
    '.om-web #om-phone{position:static;width:100%;height:100%;transform:none!important}',
    '.om-mobile #om-stage{background:radial-gradient(120% 90% at 50% 0%,#f4f5f1 0%,#dfe2db 100%)}',
    '.om-mobile #om-phone{border-radius:52px;padding:' + BEZEL + 'px;background:#0f1410;box-shadow:0 0 0 1px rgba(0,0,0,.25),0 40px 90px -20px rgba(15,20,16,.45);box-sizing:content-box}',
    '.om-mobile #om-frame{border-radius:' + (52 - BEZEL) + 'px}',
    '.om-s{display:none}',
    '@media (max-width:699px){#om-tabs{display:none}#om-bar{grid-template-columns:1fr 1fr}.om-l{display:none}.om-s{display:inline}}',
    '@media (prefers-reduced-motion:no-preference){#om-phone{transition:transform .25s cubic-bezier(.2,.8,.2,1)}}'
  ].join('\n');

  // Scrollbars inside the demo: thin with a transparent track on Web, none in the Mobile phone
  // (a real phone shows no scrollbar, and a classic one would eat ~15px of the 390px screen).
  var SB = {
    web: 'html,*{scrollbar-width:thin;scrollbar-color:rgba(128,128,128,.55) transparent}',
    mobile: 'html,body,*{scrollbar-width:none!important}*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}'
  };

  function icon(d) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var I = {
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>', go: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    web: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
  };

  function mount() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var meta = document.querySelector('meta[name=viewport]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';

    var bar = document.createElement('nav'); bar.id = 'om-bar'; bar.setAttribute('aria-label', 'Omnify Lab demo');
    var backA = document.createElement('a'); backA.className = 'om-back'; backA.href = '../../' + back;
    backA.innerHTML = icon(I.back) + '<span class="om-l">' + t.back + '</span><span class="om-s">' + t.backS + '</span>';
    backA.addEventListener('click', function (e) {
      // Came from the portfolio on this site: go back so its scroll position is kept.
      try {
        if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) { e.preventDefault(); history.back(); }
      } catch (err) {}
    });
    var tabs = document.createElement('div'); tabs.id = 'om-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'View');
    var btn = {};
    ['web', 'mobile'].forEach(function (v) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
      b.innerHTML = icon(I[v]) + '<span>' + t[v] + '</span>';
      b.addEventListener('click', function () { setView(v, true); });
      tabs.appendChild(b); btn[v] = b;
    });
    var wa = document.createElement('a'); wa.className = 'om-wa'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t.msg);
    wa.innerHTML = '<span class="om-l">' + t.wa + '</span><span class="om-s">' + t.waS + '</span>' + icon(I.go);
    bar.appendChild(backA); bar.appendChild(tabs); bar.appendChild(wa);

    var stage = document.createElement('main'); stage.id = 'om-stage';
    var phone = document.createElement('div'); phone.id = 'om-phone';
    // A #section in the shell URL is passed on to the demo, e.g. showcase/rumah-senja/#reserve
    var frame = document.createElement('iframe'); frame.id = 'om-frame'; frame.title = name; frame.src = src + location.hash;
    frame.setAttribute('allow', 'autoplay; fullscreen; clipboard-write');
    phone.appendChild(frame); stage.appendChild(phone);
    function styleFrame() {
      try {
        var d = frame.contentDocument; if (!d || !d.head) return;
        var s = d.getElementById('om-sb');
        if (!s) { s = d.createElement('style'); s.id = 'om-sb'; d.head.appendChild(s); }
        s.textContent = SB[document.documentElement.classList.contains('om-mobile') ? 'mobile' : 'web'];
      } catch (e) {}
    }
    frame.addEventListener('load', styleFrame);
    document.body.appendChild(bar); document.body.appendChild(stage);

    var narrow = window.matchMedia('(max-width:699px)');
    function fit() {
      if (!document.documentElement.classList.contains('om-mobile')) return;
      var w = stage.clientWidth - 32, h = stage.clientHeight - 40;
      var s = Math.min(1, w / (PW + 2 * BEZEL), h / (PH + 2 * BEZEL));
      phone.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
    }
    function setView(v, user) {
      var eff = narrow.matches ? 'web' : v;   // a phone already shows the mobile layout
      view = v;
      var root = document.documentElement;
      root.classList.toggle('om-mobile', eff === 'mobile');
      root.classList.toggle('om-web', eff !== 'mobile');
      ['web', 'mobile'].forEach(function (k) { btn[k].setAttribute('aria-selected', String(k === v)); btn[k].tabIndex = k === v ? 0 : -1; });
      fit(); styleFrame();
      if (user) {
        var u = new URL(location.href); u.searchParams.set('view', v);
        history.replaceState(history.state, '', u.pathname + u.search + u.hash);
        btn[v].focus();
      }
    }
    tabs.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setView(view === 'web' ? 'mobile' : 'web', true); }
    });
    window.addEventListener('resize', function () { setView(view, false); });
    if (narrow.addEventListener) narrow.addEventListener('change', function () { setView(view, false); });
    setView(view, false);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
