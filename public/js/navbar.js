const normalizePath = (path) => {
  if (path.length > 1) {
    return path.replace(/\/$/, "");
  }

  return path;
};

const currentPath = normalizePath(window.location.pathname);

document.querySelectorAll(".nav-link").forEach((link) => {
  const linkPath = normalizePath(new URL(link.href).pathname);

  if (linkPath === currentPath) {
    link.classList.remove(
      "text-stone-700",
      "font-medium",
      "border-transparent"
    );

    link.classList.add(
      "text-stone-900",
      "font-semibold",
      "border-stone-800"
    );
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const isTransparent = header?.dataset.transparent === 'true';

  if (isTransparent) {
    function updateNavbarOnScroll() {
      const hero = document.querySelector('[data-reveal]'); // section hero
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      const triggerPoint = heroHeight - 80;

      if (window.scrollY > triggerPoint) {
        header.classList.remove('fixed', 'bg-transparent', 'border-transparent');
        header.classList.add('sticky', 'bg-stone-50', 'border-stone-200', 'shadow-sm');
      } else {
        header.classList.remove('sticky', 'bg-stone-50', 'border-stone-200', 'shadow-sm');
        header.classList.add('fixed', 'bg-transparent', 'border-transparent');
      }
    }

    window.addEventListener('scroll', updateNavbarOnScroll);
    updateNavbarOnScroll();
  }

  // --- kode hamburger menu existing kamu tetap di sini, tidak berubah ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconHamburger = document.getElementById('icon-hamburger');
  const iconClose = document.getElementById('icon-close');

  hamburgerBtn?.addEventListener('click', () => {
    const willOpen = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    hamburgerBtn.setAttribute('aria-expanded', String(willOpen));
    iconHamburger.classList.toggle('hidden', willOpen);
    iconClose.classList.toggle('hidden', !willOpen);
  });
});