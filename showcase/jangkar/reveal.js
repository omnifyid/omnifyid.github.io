// Scroll reveal for the Jangkar demo (added by Omnify).
// The page is rendered by support.js after load, so this waits for the content, then tags
// headings, cards and grid items below the fold and fades them up as they scroll into view.
// Untagged or re-rendered elements simply stay visible, so nothing can get stuck hidden.
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var css = document.createElement('style');
  css.textContent =
    '.om-rv{opacity:0;transform:translateY(32px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1);transition-delay:var(--om-d,0ms)}' +
    '.om-rv.om-in{opacity:1;transform:none}' +
    '.om-rv img{transform:scale(1.08);transition:transform 1.6s cubic-bezier(.16,1,.3,1);transition-delay:var(--om-d,0ms)}' +
    '.om-rv.om-in img{transform:none}' +
    '.om-hero-in{opacity:0;transform:translateY(24px);animation:om-up 1s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--om-d,0ms)}' +
    '@keyframes om-up{to{opacity:1;transform:none}}' +
    '#top>img{animation:om-zoom 2.4s cubic-bezier(.16,1,.3,1) both}@keyframes om-zoom{from{transform:scale(1.12)}to{transform:none}}';
  document.head.appendChild(css);

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('om-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });

  var heroDone = false;
  function hero() {
    var top = document.getElementById('top');
    if (heroDone || !top) return;
    heroDone = true;
    var parts = top.querySelectorAll(':scope > div[style*="z-index"] > *, :scope > div:last-child > div > *');
    Array.prototype.forEach.call(parts, function (el, i) { el.style.setProperty('--om-d', (120 + i * 110) + 'ms'); el.classList.add('om-hero-in'); });
  }

  function tag(el, delay) {
    if (el.dataset.omRv || el.closest('.om-rv')) return;
    el.dataset.omRv = '1';
    // Only hide what is still below the fold, so nothing visible blinks.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.style.setProperty('--om-d', delay + 'ms');
    el.classList.add('om-rv');
    io.observe(el);
  }

  function scan() {
    hero();
    var blocks = document.querySelectorAll('section:not(#top), footer');
    Array.prototype.forEach.call(blocks, function (sec) {
      sec.querySelectorAll('h2').forEach(function (h) { tag(h, 0); var p = h.nextElementSibling; if (p && p.tagName === 'P') tag(p, 120); });
      sec.querySelectorAll('*').forEach(function (el) {
        var par = el.parentElement;
        if (!par || el.dataset.omRv) return;
        var d = getComputedStyle(par).display;
        if ((d === 'grid' || d === 'inline-grid') && par.children.length > 1 && el.offsetHeight > 40) {
          var i = Array.prototype.indexOf.call(par.children, el);
          tag(el, (i % 4) * 90);
        }
      });
      if (sec.tagName === 'FOOTER') Array.prototype.forEach.call(sec.children, function (c, i) { tag(c, i * 90); });
    });
  }

  var timer;
  function later() { clearTimeout(timer); timer = setTimeout(scan, 120); }
  new MutationObserver(later).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', later);
})();
