(() => {
  const dialog = document.querySelector('#photo-lightbox');
  if (!dialog) return;
  const links = [...document.querySelectorAll('[data-gallery-image]')];
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('[data-gallery-caption]');
  const close = dialog.querySelector('[data-gallery-close]');
  let trigger;
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = image.alt;
    dialog.showModal();
    document.body.classList.add('gallery-open');
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    // The close button is the viewer's only interactive control.
    if (event.key === 'Tab') {
      event.preventDefault();
      close.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-open');
    trigger?.focus({preventScroll: true});
    image.removeAttribute('src');
  });
})();
