/* Sehat Family Clinic (Demo) — reveal system (lessons 2+11) + pageview stub event. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;
  function reveal(el) { el.classList.add('in'); }
  window.SehatReveal = {
    observe: function (root) {
      (root || document).querySelectorAll('.reveal:not(.in)').forEach(function (el) {
        if (reduced || !io) reveal(el); else io.observe(el);
      });
    }
  };
  if (!reduced && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '45% 0px 45% 0px' });
  }
  window.SehatReveal.observe(document);
  setTimeout(function () { document.querySelectorAll('.reveal').forEach(reveal); }, 2000);
  if (window.SehatAnalytics) window.SehatAnalytics.track('pageview', { page: location.pathname.split('/').pop() || 'index.html' });
})();
