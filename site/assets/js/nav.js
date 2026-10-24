/* Accessible mobile menu: aria-expanded, focus management, Escape, focus loop. */
(function () {
  'use strict';
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  var label = btn.querySelector('.nav-toggle-label');
  var mq = window.matchMedia('(max-width: 63.99rem)');
  btn.hidden = false;

  function links() { return Array.prototype.slice.call(nav.querySelectorAll('a')); }
  function isOpen() { return btn.getAttribute('aria-expanded') === 'true'; }

  function open() {
    btn.setAttribute('aria-expanded', 'true');
    label.textContent = 'Close';
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
    var first = links()[0];
    if (first) first.focus();
  }
  function close(returnFocus) {
    btn.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (returnFocus) btn.focus();
  }

  btn.addEventListener('click', function () { if (isOpen()) close(true); else open(); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a') && isOpen()) close(false); });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key === 'Tab') {
      var items = [btn].concat(links());
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  mq.addEventListener('change', function (e) { if (!e.matches && isOpen()) close(false); });
})();
