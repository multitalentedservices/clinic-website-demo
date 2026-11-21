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

  /* Mobile nav (hamburger <=768px) */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { mainNav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Open menu'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) { mainNav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Open menu'); navToggle.focus(); }
    });
  }
  if (window.SehatAnalytics) window.SehatAnalytics.track('pageview', { page: location.pathname.split('/').pop() || 'index.html' });
})();
