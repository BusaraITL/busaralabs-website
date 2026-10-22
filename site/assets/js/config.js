/* Prototype feature flags. No network endpoints exist in this prototype by design.
   Set contactDemo to false to remove the demonstration form entirely. */
(function () {
  'use strict';
  window.BUSARA_CONFIG = Object.freeze({ contactDemo: true });
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
})();
