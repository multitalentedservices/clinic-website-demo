/* Sehat Family Clinic (Demo) — appointment engine (clinic skin). Client-side demo only. */
(function () {
  'use strict';
  var root = document.querySelector('[data-booking]'); if (!root) return;
  var D = window.CLINIC_DATA, L = window.CLINIC_LOGIC;
  var BK = 'sehat_appointments';
  var state = { serviceId: null, doctorId: null, date: '', time: '', name: '', phone: '', note: '' };
  var qs = new URLSearchParams(location.search);
  if (qs.get('service') && L.serviceById(D.SERVICES, qs.get('service'))) state.serviceId = qs.get('service');
  if (qs.get('doctor') && L.doctorById(D.DOCTORS, qs.get('doctor'))) state.doctorId = qs.get('doctor');

  var steps = Array.prototype.slice.call(root.querySelectorAll('[data-step]'));
  var indicators = Array.prototype.slice.call(root.querySelectorAll('.steps li'));
  var current = 1;
  function show(n) {
    current = n;
    steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
    indicators.forEach(function (li, i) { if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
    var h = root.querySelector('[data-step="' + n + '"] h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: false }); }
    window.scrollTo({ top: root.offsetTop - 90, behavior: 'smooth' });
  }
  function err(step, msg) { var el = root.querySelector('[data-step-error="' + step + '"]'); if (el) el.textContent = msg || ''; }

  /* Step 1 — services */
  var svcHost = root.querySelector('[data-booking-services]');
  svcHost.innerHTML = D.SERVICES.map(function (s) {
    return '<label class="pick"><input type="radio" name="service" value="' + s.id + '"' + (state.serviceId === s.id ? ' checked' : '') + '>' +
      '<span class="pick-name">' + s.name + '</span><br><span class="meta">' + window.SehatRender.deptName(s.dept) + ' · ' + s.duration + ' min</span><br><span class="price">' + L.formatPKR(s.fee) + '</span></label>';
  }).join('');
  svcHost.addEventListener('change', function () { var c = svcHost.querySelector('input:checked'); state.serviceId = c ? c.value : null; if (state.serviceId) err(1, ''); renderDoctors(); });

  /* Step 2 — practitioners covering the chosen service */
  var docHost = root.querySelector('[data-booking-doctors]');
  function renderDoctors() {
    var svc = L.serviceById(D.SERVICES, state.serviceId);
    var pool = L.doctorsForService(D.DOCTORS, svc);
    if (state.doctorId && state.doctorId !== 'first' && !L.doctorById(pool, state.doctorId)) state.doctorId = null;
    var html = '<label class="pick"><input type="radio" name="doctor" value="first"' + (state.doctorId === 'first' ? ' checked' : '') + '><span class="pick-name">First available</span><br><span class="meta">The first practitioner for this service with a free slot on your day.</span></label>';
    html += pool.map(function (d) {
      return '<label class="pick"><input type="radio" name="doctor" value="' + d.id + '"' + (state.doctorId === d.id ? ' checked' : '') + '><span class="pick-name">' + d.name + '</span><br><span class="meta">' + d.speciality + ' · Available: ' + window.SehatRender.dayList(d.days) + '</span></label>';
    }).join('');
    docHost.innerHTML = html;
  }
  docHost.addEventListener('change', function () { var c = docHost.querySelector('input:checked'); state.doctorId = c ? c.value : null; if (state.doctorId) err(2, ''); renderSlots(); });
  renderDoctors();

  /* Step 3 — date + slots (doctor off-days + closed Sunday constrain) */
  var dateInput = root.querySelector('[data-booking-date]');
  dateInput.min = L.todayStr();
  var slotHost = root.querySelector('[data-booking-slots]');
  function chosenDoctor() { var svc = L.serviceById(D.SERVICES, state.serviceId); return (state.doctorId && state.doctorId !== 'first') ? L.doctorById(D.DOCTORS, state.doctorId) : null; }
  function renderSlots() {
    state.time = '';
    slotHost.innerHTML = '';
    if (!state.date) return;
    var doc = chosenDoctor();
    var msg = L.validateDateFor(state.date, doc);
    err(3, msg);
    if (msg) return;
    var svc = L.serviceById(D.SERVICES, state.serviceId);
    var resolved = L.resolveDoctor(D.DOCTORS, svc, state.doctorId, state.date);
    var key = resolved ? resolved.id : 'first';
    var slots = L.generateSlots(state.date, key);
    slotHost.innerHTML = slots.map(function (s) {
      var dis = s.taken || s.past;
      return '<button type="button" class="slot" data-time="' + s.time + '" aria-pressed="false"' + (dis ? ' disabled aria-label="' + s.time + (s.taken ? ', already booked' : ', time has passed') + '"' : '') + '>' + s.time + (s.taken ? ' · booked' : s.past ? ' · passed' : '') + '</button>';
    }).join('');
    var note = root.querySelector('[data-slot-note]');
    if (note) note.textContent = resolved ? 'Showing times for ' + resolved.name + ' on ' + state.date + '. Struck-through times are unavailable.' : '';
  }
  dateInput.addEventListener('change', function () { state.date = dateInput.value; renderSlots(); });
  dateInput.addEventListener('input', function () { state.date = dateInput.value; if (!L.validateDateFor(state.date, chosenDoctor())) err(3, ''); renderSlotsSoft(); });
  function renderSlotsSoft() { if (state.date && !L.validateDateFor(state.date, chosenDoctor())) renderSlots(); }
  slotHost.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-time]'); if (!b || b.disabled) return;
    slotHost.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', 'true'); state.time = b.getAttribute('data-time'); err(3, '');
  });

  /* Step 4 — patient details with LIVE error clearing */
  var nameI = root.querySelector('[data-patient-name]'), phoneI = root.querySelector('[data-patient-phone]'), noteI = root.querySelector('[data-patient-note]');
  function fieldErr(field, msg) { var el = root.querySelector('[data-error-for="' + field + '"]'); if (el) el.textContent = msg || ''; }
  nameI.addEventListener('input', function () { if (!L.validatePatient({ name: nameI.value, phone: phoneI.value }).name) fieldErr('name', ''); });
  phoneI.addEventListener('input', function () { if (!L.validatePatient({ name: nameI.value, phone: phoneI.value }).phone) fieldErr('phone', ''); });

  /* Step 5 — review + confirm */
  function renderReview() {
    var svc = L.serviceById(D.SERVICES, state.serviceId);
    var doc = L.resolveDoctor(D.DOCTORS, svc, state.doctorId, state.date);
    root.querySelector('[data-review]').innerHTML =
      '<p><strong>Service:</strong> ' + svc.name + ' (' + svc.duration + ' min)</p>' +
      '<p><strong>Practitioner:</strong> ' + (doc ? doc.name : 'First available') + '</p>' +
      '<p><strong>When:</strong> ' + state.date + ' at ' + state.time + '</p>' +
      '<p><strong>Patient:</strong> ' + state.name + ' · ' + L.normalisePhone(state.phone) + '</p>' +
      (state.note ? '<p><strong>Note:</strong> ' + state.note.replace(/</g, '&lt;') + '</p>' : '') +
      '<p><strong>Fee due at clinic:</strong> <span class="price">' + L.formatPKR(svc.fee) + '</span></p>';
    return doc;
  }

  root.addEventListener('click', function (e) {
    var next = e.target.closest('[data-next]'), back = e.target.closest('[data-back]');
    if (back) { show(current - 1); return; }
    if (!next) return;
    if (current === 1) { if (!state.serviceId) { err(1, 'Please choose a service to continue.'); return; } err(1, ''); renderDoctors(); show(2); }
    else if (current === 2) { if (!state.doctorId) { err(2, 'Please choose a practitioner, or First available.'); return; } err(2, ''); renderSlots(); show(3); }
    else if (current === 3) {
      var msg = L.validateDateFor(state.date, chosenDoctor());
      if (msg) { err(3, msg); return; }
      if (!state.time) { err(3, 'Please choose a time slot.'); return; }
      err(3, ''); show(4);
    } else if (current === 4) {
      var v = L.validatePatient({ name: nameI.value, phone: phoneI.value });
      fieldErr('name', v.name); fieldErr('phone', v.phone);
      if (v.name || v.phone) return;
      state.name = nameI.value.trim(); state.phone = phoneI.value; state.note = noteI.value.trim();
      renderReview(); show(5);
    }
  });

  var confirmBtn = root.querySelector('[data-confirm]');
  confirmBtn.addEventListener('click', function () {
    var svc = L.serviceById(D.SERVICES, state.serviceId);
    var doc = L.resolveDoctor(D.DOCTORS, svc, state.doctorId, state.date);
    var booking = { serviceId: state.serviceId, doctorId: doc ? doc.id : 'first', date: state.date, time: state.time, name: state.name, phone: L.normalisePhone(state.phone), note: state.note, fee: svc.fee };
    booking.ref = L.makeRef(booking);
    try { var all = JSON.parse(localStorage.getItem(BK) || '[]'); all.push(booking); localStorage.setItem(BK, JSON.stringify(all)); } catch (x) {}
    if (window.SehatAnalytics) window.SehatAnalytics.track('appointment_complete', { ref: booking.ref, service: booking.serviceId });
    steps.forEach(function (s) { s.hidden = true; });
    indicators.forEach(function (li) { li.removeAttribute('aria-current'); });
    var done = root.querySelector('[data-confirmation]');
    done.hidden = false;
    done.innerHTML = '<h2 tabindex="-1">Appointment recorded — ' + booking.ref + '</h2>' +
      '<p><strong>' + svc.name + '</strong> with <strong>' + (doc ? doc.name : 'First available') + '</strong> on <strong>' + booking.date + '</strong> at <strong>' + booking.time + '</strong> for ' + booking.name + '. Fee due at clinic: <strong>' + L.formatPKR(svc.fee) + '</strong>.</p>' +
      '<p><strong>Demo notice:</strong> this is a demo website for a fictional clinic. No real appointment has been booked and no one will contact you. Your booking is saved only in this browser — see it any time under My Appointments below.</p>';
    done.querySelector('h2').focus();
    renderMine();
  });

  /* My Appointments */
  function renderMine() {
    var host = document.querySelector('[data-my-appointments]'); if (!host) return;
    var all = []; try { all = JSON.parse(localStorage.getItem(BK) || '[]'); } catch (x) {}
    if (!all.length) { host.innerHTML = '<p class="meta">No demo appointments saved in this browser yet.</p>'; return; }
    host.innerHTML = all.map(function (b) {
      var s = L.serviceById(D.SERVICES, b.serviceId), d = L.doctorById(D.DOCTORS, b.doctorId);
      return '<div class="faq-item"><h3>' + b.ref + ' — ' + (s ? s.name : b.serviceId) + '</h3><p class="meta">' + (d ? d.name : 'First available') + ' · ' + b.date + ' at ' + b.time + ' · ' + L.formatPKR(b.fee) + ' · Demo booking</p></div>';
    }).join('');
  }
  renderMine();
  if (state.serviceId) renderDoctors();
})();
