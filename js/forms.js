/* Sehat Family Clinic (Demo) — lead (general enquiry) form. Demo only: writes to a local log. */
(function () {
  'use strict';
  var form = document.querySelector('[data-lead-form]'); if (!form) return;
  var L = window.CLINIC_LOGIC;
  var KEY = 'sehat_lead_log';
  function err(name, msg) { var el = form.querySelector('[data-error-for="' + name + '"]'); if (el) el.textContent = msg || ''; }
  function values() { return { name: form.elements.name.value, phone: form.elements.phone.value, message: form.elements.message.value }; }
  ['name', 'phone', 'message'].forEach(function (n) {
    form.elements[n].addEventListener('input', function () {
      var e = L.validateLead(values());
      if (!e[n]) err(n, '');
    });
  });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = values(); var e = L.validateLead(v);
    err('name', e.name); err('phone', e.phone); err('message', e.message);
    if (e.name || e.phone || e.message) { var bad = form.querySelector('.error-text:not(:empty)'); if (bad) { var f = form.elements[bad.getAttribute('data-error-for')]; if (f) f.focus(); } return; }
    var entry = { name: v.name.trim(), phone: L.normalisePhone(v.phone), message: v.message.trim(), at: new Date().toISOString() };
    try { var log = JSON.parse(localStorage.getItem(KEY) || '[]'); log.push(entry); localStorage.setItem(KEY, JSON.stringify(log)); } catch (x) {}
    if (window.SehatAnalytics) window.SehatAnalytics.track('lead_submit', { form: 'general-enquiry' });
    var ok = document.querySelector('[data-lead-success]');
    if (ok) { ok.hidden = false; ok.innerHTML = '<h2>Thank you, ' + v.name.trim().split(' ')[0] + ' — your enquiry is recorded (demo).</h2><p>This is a demo website: your message was saved only in this browser\u2019s local demo log. No message has been sent to a real clinic.</p>'; ok.setAttribute('tabindex', '-1'); ok.focus(); }
    form.reset();
  });
})();
