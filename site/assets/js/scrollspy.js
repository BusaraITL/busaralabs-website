/* Marks the nav link for the section in view with aria-current="true".
   A section becomes current when its top reaches the line just below the sticky header,
   so a short section (About, Careers) stays current after a nav click even when the next
   section is already on screen. A nav click sets the item at once and holds it until that
   scroll settles, so passing over other sections during a smooth scroll does not move it. */
(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'))
    .filter(function (el) { return map[el.id]; });
  if (!sections.length) return;
  var header = document.querySelector('.site-header');
  var held = null, settle = null, ticking = false;

  function set(id) {
    Object.keys(map).forEach(function (k) {
      if (k === id) map[k].setAttribute('aria-current', 'true'); else map[k].removeAttribute('aria-current');
    });
  }
  function compute() {
    var line = (header ? header.getBoundingClientRect().bottom : 0) + 24;
    var current = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) current = sections[i].id; else break;
    }
    return current;
  }
  function update() {
    ticking = false;
    if (held) return;
    set(compute());
  }
  window.addEventListener('scroll', function () {
    if (held) {
      /* the click-initiated scroll is still moving: keep the clicked item until it stops */
      clearTimeout(settle);
      settle = setTimeout(function () { held = null; }, 200);
      return;
    }
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1);
      held = id;
      set(id);
      clearTimeout(settle);
      settle = setTimeout(function () { held = null; }, 1200);
    });
  });
  window.addEventListener('resize', function () { if (!held) set(compute()); });
  set(compute());
})();
