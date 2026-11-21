/* Sehat Family Clinic (Demo) — pure logic, shared by the site and the Node test battery. No DOM. */
(function (global) {
  'use strict';
  var OPEN_HOUR = 9, LAST_START = 19, CLOSED_WEEKDAY = 0; /* closed Sundays */
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayStr(now) { now = now || new Date(); return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()); }
  function parseDate(s) { var p = String(s || '').split('-'); return new Date(+p[0], (+p[1]) - 1, +p[2]); }
  function isPastDate(s, now) { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return true; return s < todayStr(now); }
  function weekdayOf(s) { return parseDate(s).getDay(); }
  function isClosedDay(s) { return weekdayOf(s) === CLOSED_WEEKDAY; }
  function filterServices(services, dept) { if (!dept || dept === 'all') return services.slice(); return services.filter(function (x) { return x.dept === dept; }); }
  function serviceById(services, id) { for (var i = 0; i < services.length; i++) if (services[i].id === id) return services[i]; return null; }
  function doctorById(doctors, id) { for (var i = 0; i < doctors.length; i++) if (doctors[i].id === id) return doctors[i]; return null; }
  function doctorsForService(doctors, service) { if (!service) return doctors.slice(); return doctors.filter(function (d) { return d.dept === service.dept; }); }
  function doctorAvailableOn(doctor, dateStr) { return doctor.days.indexOf(weekdayOf(dateStr)) !== -1; }
  function resolveDoctor(doctors, service, doctorId, dateStr) {
    var pool = doctorsForService(doctors, service);
    if (doctorId && doctorId !== 'first') return doctorById(doctors, doctorId);
    for (var i = 0; i < pool.length; i++) if (doctorAvailableOn(pool[i], dateStr)) return pool[i];
    return pool[0] || null;
  }
  function hashCode(str) { var h = 0; for (var i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0; return Math.abs(h); }
  function slotTimes() { var out = []; for (var h = OPEN_HOUR; h <= LAST_START; h++) out.push(pad(h) + ':00'); return out; }
  function generateSlots(dateStr, doctorKey, now) {
    now = now || new Date();
    var today = todayStr(now), nowMins = now.getHours() * 60 + now.getMinutes();
    return slotTimes().map(function (t) {
      var mins = (+t.slice(0, 2)) * 60;
      return { time: t, taken: hashCode(dateStr + '|' + doctorKey + '|' + t) % 4 === 0, past: dateStr === today && mins <= nowMins };
    });
  }
  function validateDateFor(dateStr, doctor, now) {
    if (!dateStr) return 'Please choose a date.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Please choose a valid date.';
    if (isPastDate(dateStr, now)) return 'That date is in the past — please choose a future date.';
    if (isClosedDay(dateStr)) return 'The clinic is closed on Sundays — please choose another day.';
    if (doctor && !doctorAvailableOn(doctor, dateStr)) return doctor.name + ' is not available on ' + DAY_NAMES[weekdayOf(dateStr)] + 's — please choose one of their working days.';
    return null;
  }
  function normalisePhone(raw) { return String(raw || '').replace(/[\s-]/g, '').replace(/^\+92/, '0'); }
  function validPhone(raw) { return /^03\d{9}$/.test(normalisePhone(raw)); }
  function validatePatient(p) {
    var e = {};
    if (!p.name || p.name.trim().length < 3) e.name = 'Please enter the patient\u2019s full name.';
    if (!validPhone(p.phone)) e.phone = 'Please enter a valid Pakistani mobile number (e.g. 0321 1234567).';
    return e;
  }
  function validateLead(l) {
    var e = validatePatient(l);
    if (!l.message || l.message.trim().length < 10) e.message = 'Please write a short message (at least 10 characters).';
    return e;
  }
  function makeRef(b) { return 'SF-DEMO-' + (1000 + hashCode(b.serviceId + b.doctorId + b.date + b.time + b.phone) % 9000); }
  function formatPKR(n) { return 'PKR ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  global.CLINIC_LOGIC = { OPEN_HOUR: OPEN_HOUR, LAST_START: LAST_START, CLOSED_WEEKDAY: CLOSED_WEEKDAY, DAY_NAMES: DAY_NAMES, todayStr: todayStr, isPastDate: isPastDate, weekdayOf: weekdayOf, isClosedDay: isClosedDay, filterServices: filterServices, serviceById: serviceById, doctorById: doctorById, doctorsForService: doctorsForService, doctorAvailableOn: doctorAvailableOn, resolveDoctor: resolveDoctor, slotTimes: slotTimes, generateSlots: generateSlots, validateDateFor: validateDateFor, normalisePhone: normalisePhone, validPhone: validPhone, validatePatient: validatePatient, validateLead: validateLead, makeRef: makeRef, formatPKR: formatPKR };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.CLINIC_LOGIC;
})(typeof window !== 'undefined' ? window : globalThis);
