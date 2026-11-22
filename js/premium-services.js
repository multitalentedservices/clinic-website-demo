/* Sehat Family Clinic (Demo) — premium layer, services page only.
   Swiper services slider. Under reduced motion (or if Swiper fails to load)
   the slider is never initialised: the CSS grid fallback in style.css keeps
   all twelve services visible as ordinary cards — the designed static state.
   No autoplay: movement is only ever the visitor's own. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 / data-static): the CSS grid fallback
     keeps all twelve services visible — the designed static state. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  if (reduced || STATIC || !window.Swiper) return;
  new Swiper('.svc-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    keyboard: { enabled: true },
    a11y: { enabled: true },
    pagination: { el: '.svc-pagination', clickable: true },
    navigation: { nextEl: '.svc-next', prevEl: '.svc-prev' },
    breakpoints: {
      700: { slidesPerView: 2 },
      1080: { slidesPerView: 3 }
    }
  });
})();
