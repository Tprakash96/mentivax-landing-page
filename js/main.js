/* ============================================
   Mentivax Landing Page — JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Q&A Data for command bar typewriter ---
  var qaData = [
    {
      q: 'How much fee is pending for Class 8?',
      a: '\u20B91,42,000 pending across 23 students. 5 are overdue by 30+ days. Want me to send WhatsApp reminders to their parents?'
    },
    {
      q: 'Which students are weak in Maths?',
      a: '7 students in Class 6 scored below 40%. Common gaps: fractions and word problems. I can group them for extra practice sessions.'
    },
    {
      q: 'Send fee reminder to all pending parents',
      a: 'WhatsApp reminders sent to 41 parents with pending fees. 12 have already read the message. I\u2019ll notify you when payments come in.'
    },
    {
      q: 'Show today\u2019s fee collection',
      a: '\u20B958,200 collected today from 22 payments (18 UPI, 4 cash). That\u2019s 1.4\u00D7 more than yesterday. Total this month: \u20B96.2L.'
    },
    {
      q: 'Generate fee report for June',
      a: 'June report ready: \u20B96,24,500 collected, \u20B92,40,500 pending, 91% collection rate. Download as PDF or share on WhatsApp?'
    }
  ];

  var qaIndex = 0;
  var charIndex = 0;
  var typingTimeout = null;
  var questionEl = document.getElementById('commandQuestion');
  var answerEl = document.getElementById('commandAnswer');

  function typeQuestion() {
    var current = qaData[qaIndex];
    if (charIndex <= current.q.length) {
      questionEl.textContent = current.q.slice(0, charIndex);
      charIndex++;
      typingTimeout = setTimeout(typeQuestion, 35);
    } else {
      answerEl.textContent = current.a;
      typingTimeout = setTimeout(nextQA, 3500);
    }
  }

  function nextQA() {
    qaIndex = (qaIndex + 1) % qaData.length;
    charIndex = 0;
    questionEl.textContent = '';
    answerEl.textContent = '';
    typingTimeout = setTimeout(typeQuestion, 400);
  }

  // Start typewriter
  if (questionEl && answerEl) {
    answerEl.textContent = qaData[0].a;
    questionEl.textContent = qaData[0].q;
    typingTimeout = setTimeout(nextQA, 3500);
  }

  // --- Mobile Menu ---
  var menuBtn = document.getElementById('menuBtn');
  var mainNav = document.getElementById('mainNav');
  var overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMenu);
  }

  function openMenu() {
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    mainNav.classList.add('open');
    if (!overlay) createOverlay();
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    mainNav.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      mainNav.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  // Close menu on nav link click
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 72;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  // --- Intersection Observer for reveal animations ---
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Header scroll effect ---
  var header = document.getElementById('header');

  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.pageYOffset > 100) {
          header.style.background = 'rgba(20, 18, 14, 0.97)';
        } else {
          header.style.background = 'rgba(20, 18, 14, 0.92)';
        }
      },
      { passive: true }
    );
  }

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        // SW registration failed silently
      });
    });
  }
})();
