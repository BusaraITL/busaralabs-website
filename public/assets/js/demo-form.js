/* Demonstration form. Transmits nothing, stores nothing (no fetch, no storage, no cookies).
   Output uses textContent only. CSP form-action 'none' blocks native submission as a backstop. */
(function () {
  'use strict';
  var cfg = window.BUSARA_CONFIG || {};
  var wrap = document.getElementById('contact-demo');
  var form = document.getElementById('demo-form');
  if (!wrap || !form) return;
  if (!cfg.contactDemo) { wrap.remove(); return; }
  wrap.hidden = false;
  var submit = document.getElementById('d-submit');
  var out = document.getElementById('demo-result');
  var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));

  function valid(el) { return el.value.trim() !== '' && el.checkValidity(); }
  function refresh() { submit.disabled = !required.every(valid); }
  form.addEventListener('input', function (e) {
    if (e.target.hasAttribute('required')) e.target.setAttribute('aria-invalid', valid(e.target) ? 'false' : 'true');
    refresh();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!required.every(valid)) return;
    form.reset();
    required.forEach(function (el) { el.removeAttribute('aria-invalid'); });
    refresh();
    out.textContent = 'Demonstration complete. Nothing was sent or saved, and the fields have been cleared. To reach Busara Labs, use hello@busaralabs.com.';
    out.hidden = false;
  });
  refresh();
})();
