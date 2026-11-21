/* Sehat Family Clinic (Demo) — Node test battery. Shares js/logic.js + js/data.js with the site (lesson 13). */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const L = require(path.join(ROOT, 'js/logic.js'));
const D = require(path.join(ROOT, 'js/data.js'));
let pass = 0, fail = 0; const failures = [];
function ok(cond, name) { if (cond) pass++; else { fail++; failures.push(name); } console.log((cond ? 'PASS' : 'FAIL') + '  ' + name); }
const NOW = new Date(2026, 10, 24, 10, 0); // Tue 24 Nov 2026, 10:00 fixed clock

/* Data integrity */
ok(D.SERVICES.length === 12, 'data: 12 services');
ok(D.DOCTORS.length === 4, 'data: 4 doctors');
ok(D.DEPARTMENTS.length === 4, 'data: 4 departments');
ok(D.SERVICES.every(s => s.fee > 0 && s.duration > 0 && s.name && s.desc.length > 20), 'data: every service has fee/duration/desc');
ok(new Set(D.SERVICES.map(s => s.id)).size === 12, 'data: service ids unique');
ok(D.DOCTORS.every(d => d.days.length >= 3 && d.days.indexOf(0) === -1), 'data: doctors never work closed Sunday');
ok(D.DOCTORS.every(d => L.doctorsForService(D.DOCTORS, L.serviceById(D.SERVICES, D.SERVICES.find(s => s.dept === d.dept).id)).indexOf(d) !== -1), 'data: each doctor covers own department');
ok(D.FAQS.length === 5, 'data: 5 FAQs');
ok(!/cure|guarantee[sd]? (a|the|your)|miracle/i.test(JSON.stringify(D)), 'data: no cure/guarantee claims in data');

/* Filter logic */
ok(L.filterServices(D.SERVICES, 'all').length === 12, 'filter: all = 12');
ok(L.filterServices(D.SERVICES, 'dental').length === 3, 'filter: dental = 3');
ok(L.filterServices(D.SERVICES, 'children').every(s => s.dept === 'children'), 'filter: children only children');

/* Doctors for service */
ok(L.doctorsForService(D.DOCTORS, L.serviceById(D.SERVICES, 'dent-exam')).map(d => d.id).join() === 'omar', 'doctors: dental -> Omar only');
ok(L.doctorsForService(D.DOCTORS, L.serviceById(D.SERVICES, 'gen-consult')).map(d => d.id).join() === 'amina', 'doctors: general -> Amina only');

/* Dates */
ok(L.todayStr(NOW) === '2026-11-24', 'date: todayStr fixed clock');
ok(L.isPastDate('2026-11-23', NOW) === true && L.isPastDate('2026-11-25', NOW) === false, 'date: past detection');
ok(L.isClosedDay('2026-11-29') === true, 'date: 2026-11-29 is closed Sunday');
ok(/past/.test(L.validateDateFor('2026-11-20', null, NOW)), 'validate: past date rejected');
ok(/Sundays/.test(L.validateDateFor('2026-11-29', null, NOW)), 'validate: closed Sunday rejected');
const omar = L.doctorById(D.DOCTORS, 'omar'); // works Tue-Sat
ok(/not available on Mondays/.test(L.validateDateFor('2026-11-30', omar, NOW)), 'validate: doctor off-day (Monday) rejected by name');
ok(L.validateDateFor('2026-11-25', omar, NOW) === null, 'validate: Omar Wednesday accepted');
ok(/choose a date/.test(L.validateDateFor('', null, NOW)), 'validate: empty date rejected');

/* Slots */
ok(L.slotTimes().length === 11 && L.slotTimes()[0] === '09:00' && L.slotTimes()[10] === '19:00', 'slots: 11 slots 09:00-19:00 from clinic hours');
const s1 = L.generateSlots('2026-11-25', 'omar', NOW), s2 = L.generateSlots('2026-11-25', 'omar', NOW);
ok(JSON.stringify(s1) === JSON.stringify(s2), 'slots: deterministic');
ok(s1.some(s => s.taken) && s1.some(s => !s.taken), 'slots: taken mix present');
const todaySlots = L.generateSlots('2026-11-24', 'amina', NOW);
ok(todaySlots.find(s => s.time === '09:00').past === true && todaySlots.find(s => s.time === '19:00').past === false, 'slots: today elapsed slots marked past');

/* Resolution */
ok(L.resolveDoctor(D.DOCTORS, L.serviceById(D.SERVICES, 'skin-consult'), 'first', '2026-11-25').id === 'bilal', 'resolve: first available skin Wed -> Bilal');
ok(L.resolveDoctor(D.DOCTORS, L.serviceById(D.SERVICES, 'skin-consult'), 'first', '2026-11-28').id === 'bilal', 'resolve: first available skin Sat -> Bilal (works Sat)');

/* Patient + lead validation */
ok(Object.keys(L.validatePatient({ name: 'Fatima Khan', phone: '0321 1234567' })).length === 0, 'patient: valid passes');
ok(!!L.validatePatient({ name: 'Al', phone: '0321 1234567' }).name, 'patient: short name rejected');
ok(!!L.validatePatient({ name: 'Fatima Khan', phone: '12345' }).phone, 'patient: bad phone rejected');
ok(L.validPhone('+92 321 1234567') === true, 'patient: +92 format accepted');
ok(!!L.validateLead({ name: 'Fatima Khan', phone: '03211234567', message: 'short' }).message, 'lead: short message rejected');
ok(Object.keys(L.validateLead({ name: 'Fatima Khan', phone: '03211234567', message: 'Please share your timings.' })).length === 0, 'lead: valid passes');

/* Fees + refs */
ok(L.formatPKR(1500) === 'PKR 1,500' && L.formatPKR(5000) === 'PKR 5,000', 'fees: PKR formatting');
const bk = { serviceId: 'dent-exam', doctorId: 'omar', date: '2026-11-25', time: '10:00', phone: '03211234567' };
ok(/^SF-DEMO-\d{4}$/.test(L.makeRef(bk)) && L.makeRef(bk) === L.makeRef(bk), 'ref: SF-DEMO-#### deterministic');

/* Contrast — WCAG AA asserted from hex (this brief makes AA mandatory) */
function lum(hex) { const c = hex.replace('#', ''); const f = i => { const v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(0) + 0.7152 * f(2) + 0.0722 * f(4); }
function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const PAIRS = [
  ['body ink #14313B on white', '#14313B', '#FFFFFF', 4.5], ['ink on surface #F2F7F7', '#14313B', '#F2F7F7', 4.5],
  ['muted #3D5A63 on white', '#3D5A63', '#FFFFFF', 4.5], ['muted on surface', '#3D5A63', '#F2F7F7', 4.5],
  ['white on accent #0E5A6D (buttons)', '#FFFFFF', '#0E5A6D', 4.5], ['accent-dark #0A4351 on white (links)', '#0A4351', '#FFFFFF', 4.5],
  ['white on accent-dark (hover)', '#FFFFFF', '#0A4351', 4.5], ['accent-dark on tint #E6F0F1 (badges)', '#0A4351', '#E6F0F1', 4.5],
  ['error #B3261E on white', '#B3261E', '#FFFFFF', 4.5], ['ink on tint (notices)', '#14313B', '#E6F0F1', 4.5],
  ['footer note #DCEBEC on ink #14313B', '#DCEBEC', '#14313B', 4.5], ['white on ink (ribbon/footer)', '#FFFFFF', '#14313B', 4.5],
  ['accent #0E5A6D focus outline on white (non-text 3:1)', '#0E5A6D', '#FFFFFF', 3.0]
];
PAIRS.forEach(p => { const r = cr(p[1], p[2]); ok(r >= p[3], 'contrast: ' + p[0] + ' = ' + r.toFixed(2) + ':1 (>= ' + p[3] + ')'); });

/* GA4 stub locality + no live endpoints anywhere */
const allSrc = ['index.html', 'services.html', 'doctors.html', 'booking.html', 'info.html', 'visit.html', 'js/analytics.js', 'js/logic.js', 'js/data.js', 'js/render.js', 'js/main.js', 'js/booking.js', 'js/forms.js', 'css/style.css'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
ok(!/google-analytics\.com|googletagmanager\.com|gtag\(/.test(allSrc), 'ga4: no live google-analytics endpoints in source');
ok(/G-DEMO-PLACEHOLDER/.test(allSrc) && /LOCAL STUB ONLY/.test(fs.readFileSync(path.join(ROOT, 'js/analytics.js'), 'utf8')), 'ga4: stub present with DEMO placeholder ID');

/* Link integrity + page artefacts */
const PAGES = ['index.html', 'services.html', 'doctors.html', 'booking.html', 'info.html', 'visit.html'];
let refsOk = true, titles = new Set();
PAGES.forEach(pg => {
  const html = fs.readFileSync(path.join(ROOT, pg), 'utf8');
  const t = (html.match(/<title>([^<]+)<\/title>/) || [])[1]; titles.add(t);
  if (!/<meta name="description"/.test(html)) refsOk = false;
  if (!/DEMO/.test(html)) refsOk = false;
  const refs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^https?:/.test(r) && !/^mailto:/.test(r));
  refs.forEach(r => { if (!fs.existsSync(path.join(ROOT, r.split('?')[0]))) { refsOk = false; console.log('  missing ref', pg, r); } });
});
ok(refsOk, 'links: every internal href/src resolves; every page has meta description + DEMO label');
ok(titles.size === 6, 'seo: 6 unique titles');
ok(/MedicalClinic/.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')), 'seo: MedicalClinic JSON-LD on index');
ok(fs.existsSync(path.join(ROOT, 'sitemap.xml')) && fs.existsSync(path.join(ROOT, 'robots.txt')), 'seo: sitemap.xml + robots.txt present');
ok(!/lorem ipsum/i.test(allSrc), 'copy: no lorem ipsum');
ok(!/cure|guarantees? (a|the|your) result|miracle/i.test(allSrc), 'copy: no promissory medical claims in site source');

/* Weights */
function dirBytes(dir, exts) { let n = 0; fs.readdirSync(dir, { withFileTypes: true }).forEach(e => { if (e.isDirectory()) n += dirBytes(path.join(dir, e.name), exts); else if (exts.some(x => e.name.endsWith(x))) n += fs.statSync(path.join(dir, e.name)).size; }); return n; }
ok(dirBytes(ROOT, ['.html', '.css', '.js']) < 400 * 1024, 'weights: code (incl tests/shoot) < 400 KB — actual ' + Math.round(dirBytes(ROOT, ['.html', '.css', '.js']) / 1024) + ' KB');
const media = dirBytes(path.join(ROOT, 'assets'), ['.jpg']);
ok(media <= 1.6 * 1024 * 1024, 'weights: media <= 1.6 MB — actual ' + Math.round(media / 1024) + ' KB');
ok(fs.readdirSync(path.join(ROOT, 'assets')).filter(f => f.endsWith('.jpg')).every(f => fs.statSync(path.join(ROOT, 'assets', f)).size <= 125 * 1024), 'weights: every photo <= ~120 KB');

console.log('\n' + pass + ' PASS / ' + fail + ' FAIL');
if (failures.length) console.log('Failures: ' + failures.join(' | '));
process.exit(fail ? 1 : 0);
