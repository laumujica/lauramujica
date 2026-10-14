(() => {
  const toggle = document.querySelector('.project-menu-toggle');
  const menu = document.getElementById('projectMobileMenu');
  const closeButton = menu?.querySelector('.project-menu-close');
  if (!toggle || !menu || !closeButton) return;
  const mobile = window.matchMedia('(max-width: 1024px)');
  const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')];

  const closeMenu = (restoreFocus = false) => {
    if (menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('project-menu-open');
    if (restoreFocus) toggle.focus({preventScroll:true});
  };
  const openMenu = () => {
    if (!mobile.matches) return;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('project-menu-open');
    closeButton.focus({preventScroll:true});
  };

  toggle.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu(true);
  });
  closeButton.addEventListener('click', () => closeMenu(true));
  menu.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const first = focusable[0], last = focusable[focusable.length-1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (!mobile.matches) closeMenu();
  });
  document.body.classList.add('project-menu-ready');
})();
