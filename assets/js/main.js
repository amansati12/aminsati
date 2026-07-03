document.addEventListener('DOMContentLoaded', function () {

  // Sticky navbar shrink on scroll
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Close mobile menu on link click
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Counter animation for package totals
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const step = Math.max(1, target / 40);
        const update = () => {
          count += step;
          if (count < target) {
            el.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        };
        update();
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  // ---------------------------------------------------------------
  // Contact form — sends every submission to satiamin786@gmail.com
  // via the Formspree endpoint configured in _data/site_info.yml.
  // Uses fetch() so the page never reloads/redirects.
  // ---------------------------------------------------------------
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successBox.classList.add('d-none');
      errorBox.classList.add('d-none');

      const endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
        errorBox.querySelector('span') || (errorBox.innerHTML =
          '<i class="fa-solid fa-circle-exclamation me-2"></i>Form endpoint not configured yet — set it in _data/site_info.yml (see README).');
        errorBox.classList.remove('d-none');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            successBox.classList.remove('d-none');
            form.reset();
          } else {
            errorBox.classList.remove('d-none');
          }
        })
        .catch(() => {
          errorBox.classList.remove('d-none');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Enquiry';
          setTimeout(() => {
            successBox.classList.add('d-none');
            errorBox.classList.add('d-none');
          }, 6000);
        });
    });
  }
});
