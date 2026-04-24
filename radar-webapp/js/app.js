/* ============================================================
   app.js – Shared navigation utilities
   ============================================================ */

(function () {
  'use strict';

  // Mark active nav link based on current page filename
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === page) {
        a.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setActiveNav);
})();
