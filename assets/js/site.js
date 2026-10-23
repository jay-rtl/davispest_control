(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const backdrop = document.querySelector('.nav-backdrop');
  const focusable = () => [...nav.querySelectorAll('a,button')].filter(element => element.offsetParent !== null);
  const setMenu = (open, restoreFocus = false) => {
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    const label = toggle?.querySelector('.menu-toggle-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (open) nav?.querySelector('.nav-links a')?.focus();
    else if (restoreFocus) toggle?.focus();
  };
  toggle?.addEventListener('click', () => setMenu(!nav?.classList.contains('open')));
  backdrop?.addEventListener('click', () => setMenu(false, true));
  nav?.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (nav?.classList.contains('open') && !nav.contains(event.target) && event.target !== backdrop) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (!nav?.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); return; }
    if (event.key !== 'Tab') return;
    const controls = focusable();
    if (!controls.length) return;
    const first = controls[0], last = controls[controls.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  addEventListener('resize', () => { if (innerWidth > 1080 && nav?.classList.contains('open')) setMenu(false); }, {passive:true});
  addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 30), {passive:true});

  document.querySelectorAll('.faq button').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq');
    button.setAttribute('aria-expanded', String(item.classList.toggle('open')));
  }));
  // Scroll animation is optional; content remains visible without it.
  document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right,.fade-in,[data-animate]')
    .forEach(element => element.classList.add('visible'));
  document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.card,.content-block').forEach(card => card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX-rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY-rect.top}px`);
    }));
  }
  const dialog = document.querySelector('#certificate-lightbox');
  const open = document.querySelector('[data-certificate-open]');
  const close = document.querySelector('[data-certificate-close]');
  let trigger = null;
  const closeDialog = () => { if (dialog?.open) dialog.close(); };
  open?.addEventListener('click', () => { trigger = document.activeElement; dialog?.showModal(); document.body.classList.add('lightbox-open'); close?.focus(); });
  close?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  dialog?.addEventListener('close', () => { document.body.classList.remove('lightbox-open'); trigger?.focus(); });
})();
