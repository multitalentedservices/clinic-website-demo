/* Sehat Family Clinic (Demo) — premium layer, home page only.
   Restrained by design (this site is the accessibility exemplar):
   - NO Lenis here, deliberately: smooth-scroll hijacking is the one stack
     piece that works against this site's AA-first brief, and dropping it
     also keeps the unamended battery's 400 KB code-weight gate green
     (with Lenis the project measured 403 KB — a real FAIL, recorded in
     the upgrade fragment). Native scroll is preserved exactly (P2
     deviation, recorded honestly).
   - ONE signature moment (P3/P5): the hero photo sequence crossfades through
     three existing clinic photos, scrubbed by the hero's own scroll-out.
   - Count-up numbers block: the HTML already carries the final figures, so
     no-JS and reduced-motion visitors read the completed block; the count is
     presentation only and invents nothing (12 services / 4 departments /
     4 doctors / 6 open days — all counted from js/data.js). */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 / data-static): stand down like reduced
     motion — first hero frame and the printed figures are the final state. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  if (reduced || STATIC || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var frames = document.querySelectorAll('.hero-frame:not(.is-first)');
  if (frames.length) {
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    frames.forEach(function (f, i) { tl.to(f, { autoAlpha: 1, duration: 1, ease: 'none' }, i); });
  }

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!target) return;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { el.textContent = String(Math.round(obj.v)); },
          onComplete: function () { el.textContent = String(target); }
        });
      }
    });
  });
})();
