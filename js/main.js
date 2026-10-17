(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Resume data (from CV) ---------- */
  var skills = [
    { name: 'IT Support & Server Management', icon: 'bi-hdd-network-fill', pct: 95 },
    { name: 'C#.NET & VB 6.0 Development', icon: 'bi-code-slash', pct: 90 },
    { name: 'Web Design & Jekyll', icon: 'bi-window-desktop', pct: 88 },
    { name: 'Digital & Social Media Marketing', icon: 'bi-megaphone-fill', pct: 90 },
    { name: 'Graphic Design', icon: 'bi-palette-fill', pct: 80 },
    { name: 'Technical Training & Coordination', icon: 'bi-people-fill', pct: 92 },
    { name: 'Tally & Software Testing', icon: 'bi-bug-fill', pct: 85 }
  ];
  var cloud = ['Information Technology & IT Support', 'Software Development', 'C#.NET', 'VB 6.0', 'Software Testing', 'Web Design', 'Jekyll', 'Graphic Design', 'Digital Marketing', 'Social Media Marketing', 'Server Management', 'Tally', 'Technical Training', 'Stakeholder Coordination'];

  var jobs = {
    irad: { title: 'District Rollout Manager - iRAD Government Project', date: 'Oct 2021 - Sep 2025 | Central Government of India (Contractual)', summary: 'Led the district-level rollout of the iRAD application, providing support and training while coordinating with multiple government departments to deliver IT solutions aligned with project objectives.', tags: ['iRAD', 'Training', 'Police', 'ARTO', 'Highways', 'Health', 'Insurance', 'MACT', 'Legal Service Authority', 'District Magistrate Office'] },
    fatah: { title: 'Freelance Web Designer & Developer - Fatah Digital', date: '2020 - 2021', summary: 'Built websites with Jekyll, redesigned existing client websites and handled client communication and project coordination.', tags: ['Jekyll', 'Web Design', 'Redesign', 'Client Communication'] },
    jetking: { title: 'Business Development Manager - Jetking Learning Center, Porbandar', date: '2019 - 2020', summary: 'Conducted IT sessions and technical training, delivered IT solutions to individuals and businesses, and led digital marketing initiatives and IT seminars.', tags: ['IT Training', 'Seminars', 'Digital Marketing', 'Business Development'] },
    freelancer: { title: 'Freelancer', date: '2018 - 2019', summary: 'Developed over 10 websites and over 100 small software solutions, ran digital marketing campaigns to improve clients\' online presence and provided IT support and troubleshooting.', tags: ['10+ Websites', '100+ Software Solutions', 'Digital Marketing', 'IT Support'] },
    memon: { title: 'IT Assistant - Memon Emirates General Trading LLC, Dubai', date: '2016 - 2018', summary: 'Provided IT support, managed servers, used Tally for local purchases and procurement, maintained the company website and managed company bank accounts and transactions.', tags: ['IT Support', 'Servers', 'Tally', 'Procurement', 'Website Maintenance'] },
    shiny: { title: 'Software Developer / Tester - Shiny Software IT Company, Porbandar', date: '2013 - 2015', summary: 'Developed applications using C#.NET and VB 6.0, performed software testing and analyzed client requirements.', tags: ['C#.NET', 'VB 6.0', 'Testing', 'Requirement Analysis'] }
  };

  /* ---------- Build skills ---------- */
  var bars = $('#skillBars');
  if (bars) {
    bars.innerHTML = '<h5 class="mb-4"><i class="bi bi-bar-chart-fill me-2 text-accent"></i>Proficiency</h5>' +
      skills.map(function (s) {
        return '<div class="skill"><div class="skill-top"><span><i class="bi ' + s.icon + '"></i>' + s.name + '</span><span>' + s.pct + '%</span></div><div class="bar"><span style="--w:' + s.pct + '%" data-w="' + s.pct + '"></span></div></div>';
      }).join('');
  }
  var cl = $('#skillCloud');
  if (cl) cl.innerHTML = cloud.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('');

  /* ---------- Loader ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () { $('#loader').classList.add('done'); }, 600);
  });

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement, tbtn = $('#themeToggle');
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  function syncIcon() { tbtn.innerHTML = root.getAttribute('data-theme') === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>'; }
  syncIcon();
  tbtn.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    syncIcon();
  });

  /* ---------- Typing effect ---------- */
  var roles = ['IT Professional', 'Web Developer', 'C#.NET Developer', 'Digital Marketer', 'District Rollout Manager'];
  var typed = $('#typed'), ri = 0, ci = 0, del = false;
  function type() {
    var word = roles[ri];
    typed.textContent = word.substring(0, ci);
    if (!del && ci < word.length) { ci++; setTimeout(type, 90); }
    else if (!del) { del = true; setTimeout(type, 1400); }
    else if (ci > 0) { ci--; setTimeout(type, 45); }
    else { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); }
  }
  if (reduceMotion) { typed.textContent = roles[0]; } else { type(); }

  /* ---------- Reveal on scroll + counters + skill bars ---------- */
  function animateCounter(el) {
    var target = +el.dataset.target, suffix = el.dataset.suffix || '', start = null, dur = 1800;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('visible');
      $$('.counter', el).forEach(animateCounter);
      if (el.matches('.counter')) animateCounter(el);
      $$('.bar span', el).forEach(function (b) { b.style.width = b.dataset.w + '%'; });
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Navbar, progress, back-to-top, active link ---------- */
  var nav = $('#mainNav'), prog = $('#scroll-progress'), top = $('#toTop');
  var links = $$('.nav-link'), secs = links.map(function (l) { return $(l.getAttribute('href')); });
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    nav.classList.toggle('scrolled', y > 40);
    top.classList.toggle('show', y > 500);
    var cur = 0;
    var navOffset = nav.getBoundingClientRect().height + 24;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= navOffset) cur = i; });
    if (h > 0 && y >= h - 2) cur = links.length - 1;
    links.forEach(function (l, i) {
      l.classList.toggle('active', i === cur);
      if (i === cur) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $$('.navbar-nav .nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      var c = $('#navMenu');
      if (c.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(c).hide();
    });
  });

  /* ---------- Experience pop-up ---------- */
  var expModal = $('#expModal');
  expModal.addEventListener('show.bs.modal', function (ev) {
    var j = jobs[ev.relatedTarget.dataset.key]; if (!j) return;
    $('#expTitle').textContent = j.title;
    $('#expDate').textContent = j.date;
    $('#expSummary').textContent = j.summary;
    $('#expTags').innerHTML = j.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
  });

  /* ---------- 3D tilt on photo ---------- */
  var tilt = $('.tilt');
  if (tilt && !reduceMotion && window.matchMedia('(hover:hover)').matches) {
    tilt.addEventListener('mousemove', function (e) {
      var r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = 'perspective(800px) rotateY(' + x * 18 + 'deg) rotateX(' + -y * 18 + 'deg) scale(1.04)';
    });
    tilt.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* ---------- Magnetic buttons + ripple ---------- */
  $$('.magnetic').forEach(function (b) {
    if (!reduceMotion) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .15 + 'px,' + (e.clientY - r.top - r.height / 2) * .25 + 'px) scale(1.05)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    }
    b.addEventListener('click', function (e) {
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span');
      s.className = 'ripple'; s.style.width = s.style.height = d + 'px';
      s.style.left = e.clientX - r.left - d / 2 + 'px'; s.style.top = e.clientY - r.top - d / 2 + 'px';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 600);
    });
  });

  /* ---------- Cursor glow ---------- */
  var glow = $('#cursorGlow');
  if (window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('mousemove', function (e) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
  } else { glow.style.display = 'none'; }

  /* ---------- Particle network background ---------- */
  var cv = $('#bg-canvas'), ctx = cv.getContext('2d'), pts = [], mouse = { x: -999, y: -999 };
  function size() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
  size(); window.addEventListener('resize', size);
  var count = Math.min(70, Math.floor(window.innerWidth / 18));
  for (var i = 0; i < count; i++) pts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6 });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    var dark = root.getAttribute('data-theme') === 'dark', rgb = dark ? '124,92,255' : '98,70,234';
    pts.forEach(function (p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > cv.width) p.vx *= -1;
      if (p.y < 0 || p.y > cv.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.283); ctx.fillStyle = 'rgba(' + rgb + ',.7)'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) { ctx.strokeStyle = 'rgba(' + rgb + ',' + (1 - d / 130) * .3 + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      var md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < 160) { ctx.strokeStyle = 'rgba(45,212,191,' + (1 - md / 160) * .6 + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    });
    requestAnimationFrame(draw);
  }
  if (!reduceMotion) draw();

  /* ---------- Contact form -> mailto ---------- */
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('#cName'), m = $('#cEmail'), msg = $('#cMsg'), ok = true;
    [n, m, msg].forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('is-invalid', bad); if (bad) ok = false;
    });
    if (!ok) return;
    var subj = $('#cSubject').value.trim() || 'Website enquiry from ' + n.value.trim();
    var body = msg.value.trim() + '\n\n- ' + n.value.trim() + ' (' + m.value.trim() + ')';
    window.location.href = 'mailto:satiamin68@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });
  $$('.fx-input').forEach(function (f) { f.addEventListener('input', function () { f.classList.remove('is-invalid'); }); });

  $('#year').textContent = new Date().getFullYear();
})();
