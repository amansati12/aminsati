/* Visitor counter: today / this month / this year / all-time.
   Counts each browser once per day, month, year and ever (unique visitors).
   Primary service: CounterAPI v1. Fallback: countapi.mileshilliard.com.
   Both are free and need no signup. Change NAMESPACE to something unique. */
(function () {
  'use strict';
  var NAMESPACE = 'aminsati-in-site';

  // India time, so every visitor shares the same "today"
  var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date()).split('-');
  var Y = p[0], M = p[0] + '-' + p[1], D = M + '-' + p[2];

  var counters = [
    { id: 'vToday', name: 'd-' + D, stamp: 'vs_day',   value: D },
    { id: 'vMonth', name: 'm-' + M, stamp: 'vs_month', value: M },
    { id: 'vYear',  name: 'y-' + Y, stamp: 'vs_year',  value: Y },
    { id: 'vTotal', name: 'total',  stamp: 'vs_total', value: 'yes' }
  ];

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function fmt(n) { return Number(n).toLocaleString('en-IN'); }
  function num(d) {
    var v = d && (d.count != null ? d.count : d.value != null ? d.value : d.up_count);
    if (v == null || isNaN(v)) throw new Error('Unexpected response: ' + JSON.stringify(d));
    return Number(v);
  }
  function getJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
      return r.json();
    });
  }

  var providers = [
    { // CounterAPI v1: /up creates the counter if needed
      hit: function (n) { return getJSON('https://api.counterapi.dev/v1/' + NAMESPACE + '/' + n + '/up'); },
      get: function (n) { return getJSON('https://api.counterapi.dev/v1/' + NAMESPACE + '/' + n + '/'); }
    },
    { // Fallback
      hit: function (n) { return getJSON('https://countapi.mileshilliard.com/api/v1/hit/' + NAMESPACE.replace(/-/g, '_') + '_' + n.replace(/-/g, '_')); },
      get: function (n) { return getJSON('https://countapi.mileshilliard.com/api/v1/get/' + NAMESPACE.replace(/-/g, '_') + '_' + n.replace(/-/g, '_')); }
    }
  ];

  function run(c, isNew) {
    var i = 0;
    function next(err) {
      if (err) console.warn('[visitors] ' + c.name + ':', err.message || err);
      if (i >= providers.length) return Promise.reject(err);
      var pr = providers[i++];
      // reading a counter that does not exist yet fails, so fall back to a hit
      var first = isNew ? pr.hit(c.name) : pr.get(c.name).catch(function () { return pr.hit(c.name); });
      return first.then(num).catch(next);
    }
    return next();
  }

  counters.forEach(function (c) {
    var el = document.getElementById(c.id);
    var isNew = store(c.stamp) !== c.value;
    run(c, isNew).then(function (n) {
      if (isNew) store(c.stamp, c.value);
      if (el) { el.textContent = fmt(n); el.classList.remove('loading'); }
    }).catch(function () {
      if (el) { el.textContent = '--'; el.classList.remove('loading'); }
    });
  });
})();
