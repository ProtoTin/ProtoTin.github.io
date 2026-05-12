(function () {
  'use strict';

  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  var navbar    = document.getElementById('navbar');
  var links     = document.querySelectorAll('.nav-links a');
  var sections  = document.querySelectorAll('section[id]');

  // ── Mobile nav toggle ──────────────────────────────────────
  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) closeNav();
    });
  }

  // ── Active nav highlight on scroll ─────────────────────────
  function updateActive() {
    var scrollY = window.pageYOffset;
    var current = '';

    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop - 80) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
