/* ============================================
   Mentivax Landing Page — JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Q&A Data for command bar typewriter ---
  const qaData = [
    {
      q: 'How much fee is pending this month?',
      a: '\u20B92,40,500 pending across 38 students. 3 are 30+ days overdue \u2014 want me to remind them?'
    },
    {
      q: 'Which students are weak in Math?',
      a: '7 students are below 40%. Common gaps: fractions and word problems. I can group them for extra practice.'
    },
    {
      q: 'Send fee reminder to Class 5 on WhatsApp',
      a: 'Reminder sent to 41 parents on WhatsApp. 12 have opened it already.'
    },
    {
      q: 'Show today\u2019s collection',
      a: '\u20B958,200 collected today across 22 payments. That\u2019s 1.4\u00D7 yesterday.'
    }
  ];

  let qaIndex = 0;
  let charIndex = 0;
  let typing = true;
  let typingTimeout = null;
  const questionEl = document.getElementById('commandQuestion');
  const answerEl = document.getElementById('commandAnswer');

  function typeQuestion() {
    const current = qaData[qaIndex];
    if (charIndex <= current.q.length) {
      questionEl.textContent = current.q.slice(0, charIndex);
      charIndex++;
      typingTimeout = setTimeout(typeQuestion, 35);
    } else {
      // Done typing question, show answer
      answerEl.textContent = current.a;
      typingTimeout = setTimeout(nextQA, 3000);
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
    typingTimeout = setTimeout(nextQA, 3000);
  }

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  let overlay = null;

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
      var isOpen = mainNav.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Close menu on nav link click
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close menu on Escape
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
        // Update URL without jump
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Header scroll behavior ---
  var header = document.getElementById('header');
  var lastScroll = 0;

  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
          header.style.background = 'rgba(20, 18, 14, 0.97)';
        } else {
          header.style.background = 'rgba(20, 18, 14, 0.92)';
        }
        lastScroll = currentScroll;
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
