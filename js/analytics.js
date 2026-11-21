/* GA4 — LOCAL STUB ONLY. DEMO placeholder ID; nothing is ever sent to Google.
   track() records events to a local log (localStorage + console) so the demo can prove firing. */
(function (global) {
  'use strict';
  var GA4_MEASUREMENT_ID = 'G-DEMO-PLACEHOLDER'; /* DEMO ONLY — not a real GA4 property */
  var KEY = 'sehat_ga4_log';
  function track(event, params) {
    var entry = { event: event, params: params || {}, at: new Date().toISOString(), id: GA4_MEASUREMENT_ID };
    try {
      var log = JSON.parse(localStorage.getItem(KEY) || '[]'); log.push(entry);
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (e) { /* storage unavailable — console record still stands */ }
    if (global.console) console.info('[GA4-stub:local-only]', event, entry.params);
    return entry;
  }
  global.SehatAnalytics = { id: GA4_MEASUREMENT_ID, track: track };
})(window);
