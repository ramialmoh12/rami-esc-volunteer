(() => {
  const root = document.documentElement;
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const themeToggle = document.querySelector('.theme-toggle');
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const revealItems = document.querySelectorAll('.reveal');
  const sections = [...document.querySelectorAll('main section[id]')];
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const closeMenu = () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
  };

  navToggle?.addEventListener('click', () => {
    const willOpen = !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', willOpen);
    navToggle.setAttribute('aria-expanded', String(willOpen));
    navToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('nav-open', willOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const storedTheme = localStorage.getItem('rami-resume-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    root.dataset.theme = 'dark';
  }

  const updateThemeLabel = () => {
    const isDark = root.dataset.theme === 'dark';
    themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle?.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeColorMeta?.setAttribute('content', isDark ? '#0d2033' : '#0b2848');
  };
  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('rami-resume-theme', nextTheme);
    updateThemeLabel();
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const yearTarget = document.getElementById('current-year');
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();
})();
