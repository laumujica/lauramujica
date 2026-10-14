(() => {
  const toggle = document.querySelector('.project-menu-toggle');
  const menu = document.getElementById('projectMobileMenu');
  if (!toggle || !menu) return;

  const mobile = window.matchMedia('(max-width: 1024px)');
  const links = [...menu.querySelectorAll('a[href]')];

  const closeMenu = (restoreFocus = false) => {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('project-menu-open');
    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    if (!mobile.matches) return;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('project-menu-open');
    links[0]?.focus();
  };

  toggle.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu(true);
  });

  menu.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu(true);
  });

  links.forEach(link => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const last = links[links.length - 1];
    if (event.shiftKey && (document.activeElement === links[0] || document.activeElement === toggle)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (!mobile.matches) closeMenu();
  });

  // Keep the original link navigation usable when scripts are disabled.
  document.body.classList.add('project-menu-ready');
})();
