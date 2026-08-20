/**
 * public/js/main.js — Usimodist Boutique client-side interactions
 * Vanilla JavaScript only, no external libraries.
 * Requirements: 15.1–15.6, 2.4–2.8, 10.5–10.10
 */

/* ── 1. Navbar hamburger toggle (Req 15.1, 2.4–2.8) ──────────── */
function initNavbar() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  const iconHamburger = document.getElementById('icon-hamburger');
  const iconClose = document.getElementById('icon-close');

  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    if (iconHamburger) iconHamburger.classList.add('hidden');
    if (iconClose) iconClose.classList.remove('hidden');
  }

  function closeMenu() {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    if (iconHamburger) iconHamburger.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }

  // Toggle on hamburger click
  btn.addEventListener('click', function () {
    const isOpen = menu.classList.contains('hidden') === false;
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when any mobile nav link is clicked
  const mobileLinks = menu.querySelectorAll('a');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      closeMenu();
      btn.focus();
    }
  });
}

/* ── 2. Product filter (Req 15.2, 10.5–10.10) ────────────────── */
function initProductFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  if (!buttons.length || !cards.length) return;

  const VALID_TECHNIQUES = ['mirror', 'blanket'];

  /**
   * Apply a filter: show/hide cards based on technique value.
   * "Semua" or unrecognised values → show all.
   * Case-insensitive exact match.
   * @param {string} filterValue
   */
  function applyFilter(filterValue) {
    const normalized = (filterValue || '').toLowerCase().trim();
    const isAll = normalized === 'semua' || !VALID_TECHNIQUES.includes(normalized);

    cards.forEach(function (card) {
      const cardTechnique = (card.dataset.technique || '').toLowerCase().trim();
      if (isAll || cardTechnique === normalized) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Update aria-pressed on buttons
    buttons.forEach(function (btn) {
      const btnTechnique = (btn.dataset.technique || '').toLowerCase().trim();
      const isActive =
        (isAll && btnTechnique === 'semua') ||
        (!isAll && btnTechnique === normalized);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.add('bg-stone-800', 'text-stone-50', 'border-stone-800');
        btn.classList.remove('bg-white', 'text-stone-700', 'border-stone-300');
      } else {
        btn.classList.remove('bg-stone-800', 'text-stone-50', 'border-stone-800');
        btn.classList.add('bg-white', 'text-stone-700', 'border-stone-300');
      }
    });
  }

  // Button click handler: filter + update URL (history.pushState)
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const technique = btn.dataset.technique || 'Semua';
      applyFilter(technique);

      // Sync URL without reload
      const url = new URL(window.location.href);
      if (technique && technique.toLowerCase() !== 'semua') {
        url.searchParams.set('technique', technique);
      } else {
        url.searchParams.delete('technique');
      }
      history.pushState({ technique: technique }, '', url.toString());
    });
  });

  // On page load: read URL param and pre-select filter
  // Server also passes window.__selectedTechnique for initial render
  const urlParams = new URLSearchParams(window.location.search);
  const urlTechnique = urlParams.get('technique') || '';
  const serverTechnique =
    typeof window.__selectedTechnique !== 'undefined'
      ? window.__selectedTechnique
      : '';
  const initialTechnique = urlTechnique || serverTechnique || 'Semua';

  // Validate: unknown value → default "Semua"
  const initialNorm = initialTechnique.toLowerCase().trim();
  const isValidInitial =
    initialNorm === 'semua' || VALID_TECHNIQUES.includes(initialNorm);

  applyFilter(isValidInitial ? initialTechnique : 'Semua');

  // Handle browser back/forward navigation
  window.addEventListener('popstate', function (e) {
    const technique = (e.state && e.state.technique) || 'Semua';
    applyFilter(technique);
  });
}

/* ── 3. Smooth scroll for anchor links (Req 15.3) ────────────── */
function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    // Update URL hash without jumping
    history.pushState(null, '', hash);
  });
}

/* ── 4. Reveal animation via IntersectionObserver (Req 15.4–15.5) */
function initRevealAnimation() {
  // Elements MUST be visible without JS (graceful degradation).
  // Only hide them when JS is available — done via class, not inline style.
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Add CSS class that sets initial hidden state (opacity/translateY)
  // CSS is defined in output.css via Tailwind or style block — we add
  // a class 'reveal-hidden' here and 'is-visible' when in viewport.
  elements.forEach(function (el) {
    el.classList.add('reveal-hidden');
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all if IntersectionObserver not available
    elements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ── Init all on DOMContentLoaded ────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initProductFilter();
  initSmoothScroll();
  initRevealAnimation();
});

/* Export functions for testing (Node.js / Jest + JSDOM) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initNavbar,
    initProductFilter,
    initSmoothScroll,
    initRevealAnimation,
  };
}

(function () {
  const wrapper = document.getElementById('mission-slideshow');
  if (!wrapper) return;

  const slides = Array.from(
    wrapper.querySelectorAll('[data-slide]')
  );

  const dots = Array.from(
    document.querySelectorAll('#mission-slide-dots [data-dot]')
  );

  const labels = [
    'Hutan Harapan',
    'Kekayaan Flora',
    'Sustainable Fashion',
    'Ecoprint'
  ];

  const indexEl = document.getElementById('mission-slide-index');
  const labelEl = document.getElementById('mission-slide-label');

  let current = 0;
  let timer = null;

  const prefersReducedMotion = window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  function showSlide(index) {
    // Pastikan index selalu valid
    if (index < 0 || index >= slides.length) {
      index = 0;
    }

    // UPDATE IMAGE
    slides.forEach((slide, i) => {
      slide.classList.toggle('opacity-100', i === index);
      slide.classList.toggle('opacity-0', i !== index);
    });

    // UPDATE DOT
    dots.forEach((dot, i) => {
      const isActive = i === index;

      dot.classList.toggle('bg-brown', isActive);
      dot.classList.toggle('bg-brown/30', !isActive);

      dot.setAttribute(
        'aria-selected',
        String(isActive)
      );
    });

    // UPDATE NOMOR
    if (indexEl) {
      indexEl.textContent = String(index + 1).padStart(2, '0');
    }

    // UPDATE LABEL
    if (labelEl) {
      labelEl.textContent = labels[index] || '';
    }

    current = index;
  }

  function next() {
    showSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;

    stopAutoplay();

    timer = setInterval(next, 2500);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // DOT CLICK
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.dot);

      showSlide(index);
      startAutoplay();
    });
  });

  // PAUSE WHEN HOVER
  wrapper.addEventListener('mouseenter', stopAutoplay);

  wrapper.addEventListener('mouseleave', startAutoplay);

  // INITIAL STATE
  showSlide(0);

  // START SLIDESHOW
  startAutoplay();
})();