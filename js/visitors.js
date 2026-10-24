/* Visitor counter: today / this month / this year / all-time
   Uses the free CounterAPI v1 service (no signup). Each browser is counted
   once per day, once per month, once per year and once ever (unique visitors).
   Change NAMESPACE to something unique to your site. */
(function () {
  'use strict';
  var NAMESPACE = 'aminsati-in-site';
  var BASE = 'https://api.counterapi.dev/v1/' + NAMESPACE + '/';

  // Dates are based on India time so every visitor shares the same "today"
  var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date()).split('-');
  var Y = parts[0], M = parts[0] + '-' + parts[1], D = M + '-' + parts[2];

  var counters = [
    { id: 'vToday', name: 'd-' + D, stamp: 'vs_day',   value: D },
    { id: 'vMonth', name: 'm-' + M, stamp: 'vs_month', value: M },
    { id: 'vYear',  name: 'y-' + Y, stamp: 'vs_year',  value: Y },
    { id: 'vTotal', name: 'total',  stamp: 'vs_total', value: 'yes' }
  ];

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function fmt(n) { return Number(n).toLocaleString('en-IN'); }

  function call(path) {
    return fetch(BASE + path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }
  function read(d) { return d.count != null ? d.count : (d.up_count != null ? d.up_count : 0); }

  function show(id, n) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = fmt(n);
    el.classList.remove('loading');
  }
  function fail(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = '--'; el.classList.remove('loading'); }
  }

  counters.forEach(function (c) {
    var isNew = store(c.stamp) !== c.value;      // first visit in this period?
    call(c.name + (isNew ? '/up' : '/'))
      .then(function (d) { if (isNew) store(c.stamp, c.value); show(c.id, read(d)); })
      .catch(function () {
        // A brand-new period's counter doesn't exist yet when only reading
        if (!isNew) call(c.name + '/up').then(function (d) { show(c.id, read(d)); }).catch(function () { fail(c.id); });
        else fail(c.id);
      });
  });
})();
