/* Sehat Family Clinic (Demo) — DOM rendering from data. */
(function () {
  'use strict';
  var D = window.CLINIC_DATA, L = window.CLINIC_LOGIC;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function deptName(id) { for (var i = 0; i < D.DEPARTMENTS.length; i++) if (D.DEPARTMENTS[i].id === id) return D.DEPARTMENTS[i].name; return id; }
  function dayList(days) { return days.map(function (d) { return L.DAY_NAMES[d].slice(0, 3); }).join(', '); }

  window.SehatRender = {
    serviceCard: function (s) {
      return '<article class="card reveal"><div class="card-body">' +
        '<span class="badge">' + esc(deptName(s.dept)) + '</span>' +
        '<h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) + '</p>' +
        '<p class="meta">' + s.duration + ' minutes</p>' +
        '<p class="price">' + L.formatPKR(s.fee) + '</p>' +
        '<a class="btn small secondary" href="booking.html?service=' + s.id + '">Book this service</a>' +
        '</div></article>';
    },
    doctorCard: function (d, tall) {
      return '<article class="card reveal"><div class="card-img' + (tall ? ' tall' : '') + '"><img src="' + d.img + '" alt="' + esc(d.alt) + '" loading="lazy"></div>' +
        '<div class="card-body"><h3>' + esc(d.name) + '</h3>' +
        '<p class="meta">' + esc(d.speciality) + '<br>' + esc(d.quals) + '</p>' +
        '<p>' + esc(d.note) + '</p>' +
        '<p class="meta">Available: ' + dayList(d.days) + '</p>' +
        '<a class="btn small secondary" href="booking.html?doctor=' + d.id + '">Book with ' + esc(d.name.split(' ')[1] || d.name) + '</a>' +
        '</div></article>';
    },
    faqItem: function (f) { return '<div class="faq-item reveal"><h3>' + esc(f.q) + '</h3><p>' + esc(f.a) + '</p></div>'; },
    deptName: deptName, dayList: dayList, esc: esc
  };

  document.querySelectorAll('[data-services]').forEach(function (host) {
    var limit = +(host.getAttribute('data-services') || 0);
    var list = limit ? D.SERVICES.slice(0, limit) : D.SERVICES;
    host.innerHTML = list.map(window.SehatRender.serviceCard).join('');
  });
  document.querySelectorAll('[data-doctors]').forEach(function (host) {
    host.innerHTML = D.DOCTORS.map(function (d) { return window.SehatRender.doctorCard(d, host.hasAttribute('data-tall')); }).join('');
  });
  document.querySelectorAll('[data-faqs]').forEach(function (host) {
    host.innerHTML = D.FAQS.map(window.SehatRender.faqItem).join('');
  });
  var filterHost = document.querySelector('[data-service-filter]');
  if (filterHost) {
    var grid = document.querySelector('[data-services-grid]');
    var count = document.querySelector('[data-service-count]');
    function renderFilter(dept) {
      var list = L.filterServices(D.SERVICES, dept);
      grid.innerHTML = list.map(window.SehatRender.serviceCard).join('');
      if (count) count.textContent = list.length + (list.length === 1 ? ' service' : ' services');
      if (window.SehatReveal) window.SehatReveal.observe(grid);
    }
    filterHost.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-dept]'); if (!btn) return;
      filterHost.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      renderFilter(btn.getAttribute('data-dept'));
    });
    renderFilter('all');
  }
})();
