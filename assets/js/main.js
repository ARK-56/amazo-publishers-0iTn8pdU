/* Amazo Publishers — site behaviour
   Progressive enhancement only: every section is readable with JS disabled. */
(function () {
  'use strict';

  var onReady = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  onReady(function () {

    /* ---------- Header state, reading progress, back-to-top ----------
       All three key off the same scroll position, so they share one
       rAF-throttled listener rather than three competing ones. */
    var header   = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress');
    var toTop    = document.querySelector('.to-top');

    var onScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop;

      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (toTop)  toTop.classList.toggle('is-visible', y > 600);

      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progress.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
      }
    };

    var ticking = false;
    var queueScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', queueScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', function () {
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      });
    }

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
      });
    }

    var isMobile = function () {
      return window.matchMedia('(max-width: 1180px)').matches;
    };

    /* ---------- Dropdown ("Other Services") ---------- */
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.nav__item--has-panel'));

    var closeAll = function (except) {
      dropdowns.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        var t = item.querySelector('.nav__link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    };

    dropdowns.forEach(function (item) {
      var trigger = item.querySelector('.nav__link');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var open = item.classList.contains('is-open');
        closeAll(item);
        item.classList.toggle('is-open', !open);
        trigger.setAttribute('aria-expanded', String(!open));
      });

      // Hover only on pointer devices with room for it
      item.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        closeAll(item);
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', function () {
        if (isMobile()) return;
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__item--has-panel')) closeAll(null);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeAll(null);
      if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });

    /* ---------- FAQ accordion ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var open = item.classList.contains('is-open');
        // Close siblings for a single-open accordion
        Array.prototype.forEach.call(item.parentNode.children, function (sib) {
          sib.classList.remove('is-open');
          var b = sib.querySelector('.faq__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
    });

    /* ---------- Genre tabs ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    if (tabs.length) {
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-genre');
          tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
          });
          Array.prototype.forEach.call(document.querySelectorAll('.book'), function (book) {
            var genre = book.getAttribute('data-genre');
            book.style.display = (target === 'all' || genre === target) ? '' : 'none';
          });
        });
      });
    }

    /* ---------- Count-up stats ---------- */
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    /* ---------- Reveal on scroll + counters ---------- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || reduced) {
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
        el.classList.add('is-in');
      });
      counters.forEach(function (el) {
        var s = el.getAttribute('data-suffix') || '';
        el.textContent = parseFloat(el.getAttribute('data-count')).toLocaleString() + s;
      });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add('is-in');
          if (el.hasAttribute('data-count')) runCount(el);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      /* Stagger across each visual row. Grouping by offsetTop means a 4-up
         grid cascades 0/70/140/210 and then restarts on the next row, rather
         than running one delay counter down the whole document. */
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
        var siblings = Array.prototype.filter.call(
          el.parentNode ? el.parentNode.children : [],
          function (n) { return n.classList && n.classList.contains('reveal'); }
        );
        var row = siblings.filter(function (n) { return n.offsetTop === el.offsetTop; });
        var pos = row.indexOf(el);
        el.style.transitionDelay = Math.min(pos, 5) * 70 + 'ms';
        io.observe(el);
      });
      counters.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Entry popup ----------
       Opens once per browsing session, after the delay set on the element.
       Anything that dismisses it records the fact, so it does not reappear
       on every page the visitor clicks through to. */
    var modal = document.getElementById('entry-modal');
    if (modal && !sessionStorage.getItem('amazo-modal-seen')) {
      var panel = modal.querySelector('.modal__panel');
      var lastFocus = null;

      var openModal = function () {
        lastFocus = document.activeElement;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        /* Force a reflow, then flip the class synchronously. Deferring this to
           requestAnimationFrame would leave the panel at opacity 0 with the
           page scroll locked in any tab where rAF is throttled. */
        void modal.offsetHeight;
        modal.classList.add('is-open');
        var first = modal.querySelector('input, textarea, button');
        if (first) first.focus();
      };

      var closeModal = function () {
        sessionStorage.setItem('amazo-modal-seen', '1');
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        window.setTimeout(function () { modal.hidden = true; }, 320);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      };

      Array.prototype.forEach.call(modal.querySelectorAll('[data-modal-close]'), function (el) {
        el.addEventListener('click', closeModal);
      });

      document.addEventListener('keydown', function (e) {
        if (modal.hidden) return;
        if (e.key === 'Escape' || e.keyCode === 27) { closeModal(); return; }
        if (e.key !== 'Tab') return;

        /* Keep tabbing inside the dialog while it is open. */
        var items = panel.querySelectorAll('a[href], button, input, textarea, select');
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });

      /* Submitting counts as dismissing — the mail client takes over from here. */
      var modalForm = modal.querySelector('form');
      if (modalForm) {
        modalForm.addEventListener('submit', function () {
          sessionStorage.setItem('amazo-modal-seen', '1');
        });
      }

      window.setTimeout(openModal, parseInt(modal.getAttribute('data-delay'), 10) || 6000);
    }

    /* ---------- Pre-select the service from ?service= ----------
       Every service page CTA links to contact.html?service=<Title>, so the
       enquiry form should open with that option already chosen. */
    var serviceSelect = document.querySelector('#service');
    if (serviceSelect && window.location.search) {
      var wanted = decodeURIComponent(
        (window.location.search.match(/[?&]service=([^&]*)/) || [])[1] || ''
      ).replace(/\+/g, ' ');

      if (wanted) {
        Array.prototype.forEach.call(serviceSelect.options, function (opt) {
          if (opt.value === wanted) serviceSelect.value = opt.value;
        });
      }
    }

    /* ---------- Contact / lead forms ----------
       No backend is wired up yet. The form validates, then hands off to the
       mail client so nothing is silently dropped. Replace this handler with a
       POST to your form endpoint (Formspree, Netlify Forms, your own API). */
    Array.prototype.forEach.call(document.querySelectorAll('[data-mailto-form]'), function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;

        var data = new FormData(form);
        var get = function (k) { return (data.get(k) || '').toString().trim(); };

        /* The short lead band has no service or message field, so drop any
           row the form did not actually collect rather than mailing blanks. */
        var lines = [
          ['Name', get('name')],
          ['Email', get('email')],
          ['Phone', get('phone')],
          ['Service', get('service')]
        ].filter(function (row) { return row[1]; })
         .map(function (row) { return row[0] + ': ' + row[1]; });

        if (get('message')) lines.push('', get('message'));
        lines = lines.join('\n');

        var to = form.getAttribute('data-mailto-form');
        var subject = form.getAttribute('data-subject') || 'Website enquiry';

        var status = form.querySelector('.form-status');
        if (status) {
          status.textContent = 'Opening your email app to send this enquiry to ' + to + '…';
          status.classList.add('is-visible');
        }

        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines);
      });
    });

    /* ---------- Footer year ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
