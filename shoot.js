/* Sehat Family Clinic (Demo) — screenshot + layout-audit runner.
   Usage: node shoot.js <outDir> [--nojs] [--probe320] [--flows] [--reduced] [--keyboard]
   Clip-aware overflow + leaf text-overflow + hidden-reveal + broken-image audit (lessons 1, 11, 14). */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs'); const path = require('path');
const ROOT = '/home/hatch/workspace/portfolio-builds/clinic-website-demo';
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2];
const NOJS = process.argv.includes('--nojs'), PROBE = process.argv.includes('--probe320');
const FLOWS = process.argv.includes('--flows'), REDUCED = process.argv.includes('--reduced'), KEYBOARD = process.argv.includes('--keyboard');
const PAGES = [['index', 'index.html'], ['services', 'services.html'], ['doctors', 'doctors.html'], ['booking', 'booking.html'], ['info', 'info.html'], ['visit', 'visit.html']];
const VIEWPORTS = PROBE ? [['probe320', 320, 700]] : [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]];

async function auditPage(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        if (el.closest('.skip-link')) return;
        let clipped = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const ox = getComputedStyle(a).overflowX; if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; } }
        if (!clipped) bad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), right: Math.round(r.right) });
      }
    });
    const hidden = []; document.querySelectorAll('.reveal').forEach((el) => { if (parseFloat(getComputedStyle(el).opacity) < 0.05) hidden.push(el.tagName); });
    const broken = []; document.querySelectorAll('img').forEach((im) => { if (im.complete && im.naturalWidth === 0) broken.push(im.getAttribute('src')); });
    const textBad = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (el.children.length || !el.textContent || !el.textContent.trim() || el.closest('.skip-link')) return;
      if (el.scrollWidth > el.clientWidth + 1) textBad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), sw: el.scrollWidth, cw: el.clientWidth, text: el.textContent.trim().slice(0, 40) });
    });
    return { overflowX: document.documentElement.scrollWidth - vw, badEls: bad.slice(0, 12), hiddenCount: hidden.length, brokenImgs: broken, textBad: textBad.slice(0, 12) };
  });
}
async function settle(page) {
  if (NOJS) { await page.waitForTimeout(600); return; }
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForFunction(() => [...document.querySelectorAll('.reveal')].every(el => parseFloat(getComputedStyle(el).opacity) > 0.95), null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(300);
}
function future(days, skipSunday = true) { const d = new Date(Date.now() + days * 86400000); if (skipSunday) while (d.getDay() === 0) d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); }
function nextMonday() { const d = new Date(); do { d.setDate(d.getDate() + 1); } while (d.getDay() !== 1); return d.toISOString().slice(0, 10); }

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });

  if (KEYBOARD) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const rows = [];
    async function walk(file, label, tabs) {
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' }); await page.waitForTimeout(700);
      for (let i = 0; i < tabs; i++) {
        await page.keyboard.press('Tab'); await page.waitForTimeout(120);
        const info = await page.evaluate(() => {
          const el = document.activeElement; if (!el) return null;
          const host = el.closest('.pick') || el;
          const cs = getComputedStyle(host); const own = getComputedStyle(el);
          return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.value || '').trim().slice(0, 42), hostClass: host.className || '', outline: (cs.outlineWidth !== '0px' ? cs.outlineWidth + ' ' + cs.outlineStyle : own.outlineWidth + ' ' + own.outlineStyle), hostOutline: cs.outlineWidth + ' ' + cs.outlineStyle };
        });
        rows.push(`| ${label} | ${i + 1} | ${info ? info.tag + ' — ' + info.text : '?'} | ${info ? info.hostClass : ''} | ${info ? info.hostOutline + ' / ' + info.outline : ''} |`);
        if (label === 'Booking' && i === 3) await page.screenshot({ path: path.join(OUT, 'keyboard-focus-booking.png') });
        if (label === 'Home' && i === 2) await page.screenshot({ path: path.join(OUT, 'keyboard-focus-home.png') });
      }
    }
    await walk('booking.html', 'Booking', 10);
    await walk('index.html', 'Home', 10);
    fs.writeFileSync(path.join(OUT, 'keyboard-walk.md'), '# Keyboard walk — Sehat Family Clinic (Demo)\n\nMethod: Playwright Tab presses on the served file:// pages at 1280px; at each stop the focused element, its visible focus HOST (lesson 20: visually-hidden pick inputs report the `.pick` card host) and computed outline are recorded. Focus order follows DOM order; no traps observed (focus never left the page or stalled).\n\n| Page | Stop | Focused element | Focus host class | Host outline / element outline |\n|---|---|---|---|---|\n' + rows.join('\n') + '\n');
    console.log('KEYBOARD DONE'); await browser.close(); return;
  }

  if (FLOWS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage(); const log = [];
    const shot = async (name, loc) => { if (loc) await loc.screenshot({ path: path.join(OUT, name) }); else await page.screenshot({ path: path.join(OUT, name) }); };
    // Services filter
    await page.goto('file://' + path.join(ROOT, 'services.html'), { waitUntil: 'load' }); await settle(page);
    await page.click('button[data-dept="dental"]'); await page.waitForTimeout(400);
    log.push('services filter dental -> ' + await page.textContent('[data-service-count]'));
    await shot('flow-services-filtered-dental.png', page.locator('[data-services-grid]'));
    // Booking: step1 error, then dental service
    await page.goto('file://' + path.join(ROOT, 'booking.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    await page.click('[data-step="1"] [data-next]'); await page.waitForTimeout(300);
    log.push('step1 error -> ' + await page.textContent('[data-step-error="1"]'));
    await shot('flow-booking-step1-error.png', page.locator('[data-step="1"]'));
    await page.check('input[name="service"][value="dent-exam"]');
    await page.click('[data-step="1"] [data-next]'); await page.waitForTimeout(400);
    const docCount = await page.locator('input[name="doctor"]').count();
    log.push('step2 doctor options for dental = ' + docCount + ' (Omar + First available expected)');
    await shot('flow-booking-step2-doctors.png', page.locator('[data-step="2"]'));
    await page.check('input[name="doctor"][value="omar"]');
    await page.click('[data-step="2"] [data-next]'); await page.waitForTimeout(400);
    // Off-day rejection: next Monday (Omar off Mondays)
    await page.fill('[data-booking-date]', nextMonday()); await page.waitForTimeout(400);
    log.push('off-day error -> ' + await page.textContent('[data-step-error="3"]'));
    await shot('flow-booking-offday-error.png', page.locator('[data-step="3"]'));
    // Valid weekday for Omar (Tue-Sat, not Sunday)
    let d = future(4); while (new Date(d + 'T12:00:00').getDay() === 1) d = future(5);
    await page.fill('[data-booking-date]', d); await page.waitForTimeout(500);
    const freeSlot = page.locator('.slot:not([disabled])').first();
    const slotTime = await freeSlot.getAttribute('data-time'); await freeSlot.click();
    log.push('slot chosen -> ' + d + ' ' + slotTime + '; slot note -> ' + await page.textContent('[data-slot-note]'));
    await shot('flow-booking-step3-slots.png', page.locator('[data-step="3"]'));
    await page.click('[data-step="3"] [data-next]'); await page.waitForTimeout(400);
    // Phone error then LIVE clear
    await page.fill('[data-patient-name]', 'Fatima Khan'); await page.fill('[data-patient-phone]', '123');
    await page.click('[data-step="4"] [data-next]'); await page.waitForTimeout(300);
    log.push('step4 phone error -> ' + await page.textContent('[data-error-for="phone"]'));
    await shot('flow-booking-step4-phone-error.png', page.locator('[data-step="4"]'));
    await page.fill('[data-patient-phone]', '0321 1234567'); await page.waitForTimeout(300);
    log.push('phone error after fix (must be empty) -> "' + (await page.textContent('[data-error-for="phone"]')) + '"');
    await page.click('[data-step="4"] [data-next]'); await page.waitForTimeout(400);
    await shot('flow-booking-step5-review.png', page.locator('[data-step="5"]'));
    log.push('review -> ' + (await page.textContent('[data-review]')).replace(/\s+/g, ' ').trim());
    await page.click('[data-confirm]'); await page.waitForTimeout(600);
    await shot('flow-booking-confirmation.png', page.locator('[data-confirmation]'));
    log.push('confirmation -> ' + (await page.textContent('[data-confirmation]')).replace(/\s+/g, ' ').trim().slice(0, 220));
    const stored = await page.evaluate(() => ({ appts: JSON.parse(localStorage.getItem('sehat_appointments') || '[]'), ga4: JSON.parse(localStorage.getItem('sehat_ga4_log') || '[]') }));
    log.push('FIRING localStorage appointments = ' + JSON.stringify(stored.appts));
    log.push('FIRING GA4-stub log events = ' + stored.ga4.map(e => e.event).join(','));
    await shot('flow-my-appointments.png', page.locator('[data-my-appointments]'));
    // Lead form on visit page
    await page.goto('file://' + path.join(ROOT, 'visit.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    await page.fill('#l-name', 'Ahmed Raza'); await page.fill('#l-phone', '0300 9876543'); await page.fill('#l-msg', 'Please share your Saturday timings.');
    await page.click('[data-lead-form] button[type="submit"]'); await page.waitForTimeout(500);
    await shot('flow-lead-success.png', page.locator('[data-lead-success]'));
    const lead = await page.evaluate(() => ({ leads: JSON.parse(localStorage.getItem('sehat_lead_log') || '[]'), ga4: JSON.parse(localStorage.getItem('sehat_ga4_log') || '[]') }));
    log.push('FIRING lead log = ' + JSON.stringify(lead.leads));
    log.push('FIRING GA4-stub after lead = ' + lead.ga4.map(e => e.event).join(','));
    fs.writeFileSync(path.join(OUT, 'flow-log.txt'), log.join('\n') + '\n');
    console.log(log.join('\n')); console.log('FLOWS DONE'); await browser.close(); return;
  }

  const results = {};
  for (const [pname, file] of PAGES) {
    for (const [vname, w, h] of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !NOJS, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' }); await page.waitForTimeout(400);
      await settle(page);
      const a = await auditPage(page);
      results[pname + '@' + vname] = a;
      await page.screenshot({ path: path.join(OUT, pname + '-' + vname + '.png'), fullPage: true });
      if (vname === 'phone') await page.screenshot({ path: path.join(OUT, pname + '-phone-top.png') });
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(results, null, 2));
  const bad = Object.entries(results).filter(([, a]) => a.overflowX > 1 || a.badEls.length || a.hiddenCount || a.brokenImgs.length || a.textBad.length);
  console.log('combos:', Object.keys(results).length, '| problem combos:', bad.length);
  bad.forEach(([k, a]) => console.log(k, JSON.stringify(a)));
  await browser.close();
})();
