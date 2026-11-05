(function () {
  if (window.__shPT) return; window.__shPT = true;
  var KEY = 'sh-pt', EASE = 'cubic-bezier(.76,0,.24,1)';
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function overlay() {
    var o = document.createElement('div');
    o.setAttribute('aria-hidden', 'true');
    o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#141210;display:flex;align-items:center;justify-content:center;pointer-events:none;will-change:clip-path';
    var m = document.createElement('img'); m.src = 'assets/s-mark.svg'; m.alt = '';
    m.style.cssText = 'width:56px;height:auto;opacity:0;filter:brightness(0) invert(1);will-change:opacity,transform';
    var l = document.createElement('span');
    l.style.cssText = 'position:absolute;left:0;bottom:0;height:2px;width:100%;background:#A8843A;transform:scaleX(0);transform-origin:left';
    o.appendChild(m); o.appendChild(l); document.documentElement.appendChild(o);
    return { o: o, m: m, l: l };
  }
  var flag; try { flag = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
  if (flag && !rm) {
    var v = overlay(); v.m.style.opacity = 1; v.l.style.transform = 'scaleX(1)';
    var go = function () {
      setTimeout(function () {
        v.m.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
        var a = v.o.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 700, delay: 160, easing: EASE, fill: 'forwards' });
        a.onfinish = function () { v.o.remove(); };
      }, 120);
    };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    setTimeout(function () { if (v.o.isConnected) go(); }, 2500);
  }
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.querySelectorAll('[data-sh-pt]').forEach(function (n) { n.remove(); }); });
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (x) { return; }
    if (u.origin !== location.origin || u.pathname === location.pathname || !/\.dc\.html$/.test(decodeURIComponent(u.pathname))) return;
    e.preventDefault();
    try { sessionStorage.setItem(KEY, '1'); } catch (x) {}
    if (rm) { location.href = u.href; return; }
    var v = overlay(); v.o.setAttribute('data-sh-pt', '');
    v.o.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 600, easing: EASE, fill: 'forwards' });
    v.l.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 500, delay: 250, easing: EASE, fill: 'forwards' });
    v.m.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: 300, easing: 'ease-out', fill: 'forwards' })
      .onfinish = function () { location.href = u.href; };
  }, true);
})();
