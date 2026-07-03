// ========================================================================== 
// index.html
// ========================================================================== 
(function () {
  if (!document.body || document.body.getAttribute('data-page') !== 'index') return;
/* ==========================================================================
   LUMOSTAT — Homepage Script
   Vanilla JS: mobile navigation, FAQ accordion, scroll reveal, sticky header
   ========================================================================== */
(function () {
  'use strict';

  /* ── MOBILE NAVIGATION ────────────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileMenu.querySelectorAll('[data-close-menu]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close menu automatically if viewport grows back to desktop size
    window.addEventListener('resize', function () {
      if (window.innerWidth > 767 && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ── FAQ ACCORDION ────────────────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');

  function setFaqHeight(item, open) {
    var answer = item.querySelector('.faq-a');
    var button = item.querySelector('.faq-q');
    if (open) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    } else {
      answer.style.maxHeight = '0px';
      item.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  }

  faqItems.forEach(function (item) {
    var button = item.querySelector('.faq-q');
    button.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      // Close all, then open the clicked one (single-open accordion)
      faqItems.forEach(function (other) { setFaqHeight(other, false); });
      if (willOpen) { setFaqHeight(item, true); }
    });
  });

  // Initialize first FAQ item as open once layout is ready
  window.addEventListener('load', function () {
    var openItem = document.querySelector('.faq-item.is-open');
    if (openItem) { setFaqHeight(openItem, true); }
  });

  /* ── SCROLL REVEAL ─────────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── HEADER SHADOW ON SCROLL ──────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  var lastScroll = 0;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.style.boxShadow = y > 8 ? '0 1px 0 rgba(0,0,0,.04)' : 'none';
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── PROCESS STEP HOVER-LOCK (keeps one step visually active) ────── */
  var processItems = document.querySelectorAll('.process-item');
  processItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      processItems.forEach(function (p) { p.classList.remove('is-active'); });
      item.classList.add('is-active');
    });
  });

})();
})();

// ========================================================================== 
// work.html
// ========================================================================== 
(function () {
  if (!document.body || document.body.getAttribute('data-page') !== 'work') return;
/* ============================================================
   LUMOSTAT — WORK.HTML BEHAVIOR
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(magnet => {
      const strength = 18;
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-72px 0px -50% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

});
})();

// ========================================================================== 
// services.html
// ========================================================================== 
(function () {
  if (!document.body || document.body.getAttribute('data-page') !== 'services') return;
// ── Mobile nav toggle ──────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  // ── Scroll reveal ──────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  // ── FAQ accordion ──────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => {
        if (open !== item) {
          open.classList.remove('open');
          open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          open.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });
})();

// ========================================================================== 
// about.html
// ========================================================================== 
(function () {
  if (!document.body || document.body.getAttribute('data-page') !== 'about') return;
/* ============================================================
     SCROLL REVEAL
     Fades and lifts sections into view as the user scrolls.
     Respects prefers-reduced-motion by short-circuiting the observer.
     ============================================================ */
  (function () {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
     FAQ ACCORDION
     Single-panel expand/collapse with animated max-height.
     ============================================================ */
  (function () {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');

      question.addEventListener('click', function () {
        var isOpen = item.getAttribute('data-open') === 'true';

        // Close all other panels for a clean single-open accordion.
        items.forEach(function (other) {
          if (other !== item) {
            other.setAttribute('data-open', 'false');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.setAttribute('data-open', 'false');
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.setAttribute('data-open', 'true');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  })();

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  (function () {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.style.display === 'flex';
      if (isOpen) {
        links.style.display = 'none';
      } else {
        links.style.cssText = 'display:flex;position:absolute;top:64px;left:0;right:0;background:#fff;flex-direction:column;padding:24px 20px;gap:20px;border-bottom:1px solid #ECECEC;box-shadow:0 8px 32px rgba(0,0,0,.08);';
      }
    });
  })();
})();

// ========================================================================== 
// contact.html
// ========================================================================== 
(function () {
  if (!document.body || document.body.getAttribute('data-page') !== 'contact') return;
(function () {
  'use strict';

  /* Mobile nav toggle */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* FAQ accordion */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Form validation + fake submit */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  var validators = {
    fullName: function (v) { return v.trim().length > 1; },
    businessName: function (v) { return v.trim().length > 1; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    phone: function (v) { return v.trim().replace(/[^0-9]/g, '').length >= 7; },
    country: function (v) { return v.trim().length > 0; },
    service: function (v) { return v.trim().length > 0; },
    budget: function (v) { return v.trim().length > 0; },
    timeline: function (v) { return v.trim().length > 0; },
    message: function (v) { return v.trim().length > 9; }
  };

  function validateField(field) {
    var name = field.name;
    if (!validators[name]) return true;
    var valid = validators[name](field.value);
    var errorEl = document.getElementById(name + 'Error');
    field.classList.toggle('error', !valid);
    if (errorEl) errorEl.classList.toggle('show', !valid);
    return valid;
  }

  if (form) {
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    var privacyBox = document.getElementById('privacy');
    var privacyError = document.getElementById('privacyError');
    privacyBox.addEventListener('change', function () {
      privacyError.classList.toggle('show', !privacyBox.checked);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;

      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field)) allValid = false;
      });

      if (!privacyBox.checked) {
        privacyError.classList.add('show');
        allValid = false;
      } else {
        privacyError.classList.remove('show');
      }

      if (!allValid) {
        status.className = 'form-status show error';
        status.textContent = 'Please fix the highlighted fields and try again.';
        var firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        status.className = 'form-status show success';
        status.textContent = 'Thanks! Your inquiry has been received — we\u2019ll be in touch within 24 hours.';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      }, 900);
    });
  }
})();
})();

// ==========================================================================
// Global site shell: theme, navigation, cursor
// ==========================================================================
(function () {
  'use strict';

  var root = document.documentElement;
  var storageKey = 'lumostat-theme';
  var header = document.querySelector('[data-global-header]');
  var toggle = document.querySelector('[data-theme-toggle]');
  var menuToggle = document.querySelector('[data-global-menu-toggle]');
  var mobileMenu = document.querySelector('[data-global-mobile-menu]');
  var closeTriggers = document.querySelectorAll('[data-global-menu-close]');

  function getPreferredTheme() {
    try {
      var saved = window.localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (error) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      var isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    window.dispatchEvent(new CustomEvent('lumostat:themechange', { detail: { theme: theme } }));
  }

  setTheme(getPreferredTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch (error) {}
    });
  }

  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    closeTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function syncHeaderShadow() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  syncHeaderShadow();
  window.addEventListener('scroll', syncHeaderShadow, { passive: true });

  function setupCursor() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var dot = document.getElementById('cursor-dot');
    var canvas = document.getElementById('cursor-trail');

    if (reduceMotion || coarsePointer || touchDevice || !dot || !canvas) return;

    root.classList.add('has-custom-cursor');

    var ctx = canvas.getContext('2d');
    var pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var eased = { x: pointer.x, y: pointer.y };
    var trail = [];
    var maxTrail = 18;
    var isVisible = false;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function themeColor(alpha) {
      var dark = root.getAttribute('data-theme') === 'dark';
      return dark ? 'rgba(245,245,245,' + alpha + ')' : 'rgba(26,26,26,' + alpha + ')';
    }

    function setCursorState(target) {
      dot.classList.remove('state-link', 'state-button', 'state-image');
      if (!target) return;
      if (target.closest('button, .btn, [role="button"], input[type="submit"]')) {
        dot.classList.add('state-button');
      } else if (target.closest('a')) {
        dot.classList.add('state-link');
      } else if (target.closest('img, picture, video, [data-cursor="image"]')) {
        dot.classList.add('state-image');
      }
    }

    function drawTrail() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (trail.length < 2) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (var i = 1; i < trail.length; i++) {
        var prev = trail[i - 1];
        var point = trail[i];
        var opacity = (i / trail.length) * 0.34;
        ctx.strokeStyle = themeColor(opacity);
        ctx.lineWidth = 1.4 + (i / trail.length) * 1.4;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }

    function render() {
      eased.x += (pointer.x - eased.x) * 0.22;
      eased.y += (pointer.y - eased.y) * 0.22;

      if (isVisible) {
        dot.style.transform = 'translate3d(' + eased.x + 'px,' + eased.y + 'px,0) translate(-50%,-50%)';
        trail.push({ x: eased.x, y: eased.y });
        if (trail.length > maxTrail) trail.shift();
        drawTrail();
      }

      window.requestAnimationFrame(render);
    }

    resizeCanvas();
    render();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function (event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      isVisible = true;
      dot.style.opacity = '1';
      setCursorState(event.target);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isVisible = false;
      dot.style.opacity = '0';
      trail = [];
      drawTrail();
    });

    document.addEventListener('mousedown', function () {
      dot.classList.add('is-clicking');
    });

    document.addEventListener('mouseup', function () {
      dot.classList.remove('is-clicking');
    });

    window.addEventListener('lumostat:themechange', drawTrail);
  }

  setupCursor();
})();
