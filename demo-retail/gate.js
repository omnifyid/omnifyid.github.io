// PIN gate for the private demo. Asks for a 6-digit PIN once per calendar day per device.
// Note: this is a client-side gate on a static site. It keeps casual visitors out, but it
// is not real access control — anyone who reads the source can bypass it.
(function () {
  'use strict';
  var PIN_HASH = '0f601686cd5f4bb9cf974701d4b8b676b1e17e2c5fe996db0701984112bf4823'; // sha256 of the PIN
  var KEY = 'om-demo-gate';
  var LEN = 6;
  var MAX_TRIES = 5;
  var COOLDOWN_MS = 30000;

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function read() {
    try { return localStorage.getItem(KEY); } catch (e) {}
    try { return sessionStorage.getItem(KEY); } catch (e) {}
    return null;
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); return; } catch (e) {}
    try { sessionStorage.setItem(KEY, v); } catch (e) {}
  }
  function unlocked() { return read() === today(); }

  var root = document.documentElement;
  var style = document.createElement('style');
  style.textContent =
    'html.om-gated body>*:not(#om-gate){visibility:hidden!important}' +
    'html.om-gated,html.om-gated body{overflow:hidden!important}' +
    '#om-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px 16px;' +
      'background:radial-gradient(90% 70% at 85% 105%,#2F7A1F 0%,rgba(47,122,31,0) 60%),radial-gradient(70% 55% at 0% 0%,#1B3A17 0%,rgba(27,58,23,0) 65%),linear-gradient(160deg,#10140F 30%,#16301A 100%);' +
      'color:#EAF3E6;font-family:Geist,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;overflow:auto}' +
    '#om-gate *{box-sizing:border-box}' +
    '#om-gate .g-card{width:100%;max-width:400px;display:flex;flex-direction:column;gap:28px;animation:omGateUp .4s ease}' +
    '#om-gate .g-logo img{display:block;height:44px;width:auto;max-width:100%}' +
    '#om-gate h1{margin:0 0 8px;font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.15}' +
    '#om-gate p{margin:0;color:#A9B3A5;font-size:15px;line-height:1.5}' +
    '#om-gate .g-boxes{position:relative;display:grid;grid-template-columns:repeat(6,1fr);gap:10px}' +
    '#om-gate .g-box{height:60px;border-radius:12px;border:1.5px solid rgba(234,243,230,.18);background:rgba(234,243,230,.06);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:600;transition:border-color .15s,background .15s}' +
    '#om-gate .g-box.on{border-color:#7ED76A;background:rgba(126,215,106,.10)}' +
    '#om-gate .g-box.fill::after{content:"";width:12px;height:12px;border-radius:50%;background:#EAF3E6}' +
    '#om-gate.err .g-box{border-color:#F08A7E}' +
    '#om-gate.err .g-boxes{animation:omGateShake .35s ease}' +
    '#om-gate input{position:absolute;inset:0;width:100%;height:100%;opacity:0;border:0;font-size:16px;color:transparent;background:transparent;caret-color:transparent;cursor:text}' +
    '#om-gate .g-msg{min-height:21px;font-size:14px;font-weight:500;color:#F08A7E}' +
    '#om-gate .g-foot{font-size:12px;color:#7E897A}' +
    '@keyframes omGateUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '@keyframes omGateBlink{0%,49%{opacity:1}50%,100%{opacity:0}}' +
    '@keyframes omGateShake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}' +
    '@media (prefers-reduced-motion:reduce){#om-gate *{animation:none!important;transition:none!important}}' +
    '@media (max-width:380px){#om-gate .g-boxes{gap:6px}#om-gate .g-box{height:52px}}';
  document.head.appendChild(style);

  async function sha256(s) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  var gate = null;

  function lock() {
    if (gate) return;
    root.classList.add('om-gated');
    if (document.body) build(); else document.addEventListener('DOMContentLoaded', build, { once: true });
  }

  function build() {
    if (gate || unlocked()) { root.classList.remove('om-gated'); return; }
    gate = document.createElement('div');
    gate.id = 'om-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'om-gate-t');
    var boxes = '';
    for (var i = 0; i < LEN; i++) boxes += '<div class="g-box" aria-hidden="true"></div>';
    gate.innerHTML =
      '<div class="g-card">' +
        '<div class="g-logo"><img src="../brand/logo-white.svg" alt="Omnify Lab" width="161" height="44"></div>' +
        '<div><h1 id="om-gate-t">Demo privat</h1><p>Masukkan PIN 6 digit untuk membuka demo ini.</p></div>' +
        '<div class="g-boxes">' + boxes +
          '<input id="om-gate-pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" aria-label="PIN 6 digit" aria-describedby="om-gate-msg">' +
        '</div>' +
        '<div id="om-gate-msg" class="g-msg" role="alert"></div>' +
        '<div class="g-foot">Akses berlaku sampai akhir hari ini di perangkat ini.</div>' +
      '</div>';
    document.body.appendChild(gate);

    var input = gate.querySelector('input');
    var boxEls = gate.querySelectorAll('.g-box');
    var msg = gate.querySelector('.g-msg');
    var tries = 0, lockedUntil = 0, busy = false, timer = null;

    function paint() {
      var v = input.value;
      var focused = document.activeElement === input;
      boxEls.forEach(function (b, i) {
        b.classList.toggle('fill', i < v.length);
        b.classList.toggle('on', focused && i === Math.min(v.length, LEN - 1));
      });
    }
    function cooldown() {
      var left = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (left > 0) {
        input.disabled = true;
        msg.textContent = 'Terlalu banyak percobaan. Coba lagi dalam ' + left + ' detik.';
        timer = setTimeout(cooldown, 1000);
      } else {
        input.disabled = false; tries = 0; msg.textContent = ''; input.focus(); paint();
      }
    }
    async function check() {
      if (busy) return;
      busy = true;
      var ok = false;
      try { ok = (await sha256(input.value)) === PIN_HASH; } catch (e) {}
      busy = false;
      if (ok) {
        write(today());
        gate.remove(); gate = null;
        root.classList.remove('om-gated');
        return;
      }
      tries++;
      gate.classList.remove('err'); void gate.offsetWidth; gate.classList.add('err');
      input.value = ''; paint();
      if (tries >= MAX_TRIES) { lockedUntil = Date.now() + COOLDOWN_MS; cooldown(); }
      else msg.textContent = 'PIN salah. Sisa ' + (MAX_TRIES - tries) + ' percobaan.';
    }

    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '').slice(0, LEN);
      if (input.value.length) { gate.classList.remove('err'); if (Date.now() >= lockedUntil) msg.textContent = ''; }
      paint();
      if (input.value.length === LEN) check();
    });
    input.addEventListener('focus', paint);
    input.addEventListener('blur', paint);
    gate.addEventListener('click', function () { if (!input.disabled) input.focus(); });
    input.focus();
    paint();
  }

  if (!unlocked()) lock();

  // Re-lock an open tab once the day rolls over.
  function recheck() { if (!unlocked()) lock(); }
  setInterval(recheck, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) recheck(); });
})();
