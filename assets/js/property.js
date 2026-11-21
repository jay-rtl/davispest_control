(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const gallery = document.querySelector('[data-review-gallery]');
  if (gallery) {
    const panels = [...gallery.querySelectorAll('[data-review-panel]')];
    const controls = gallery.querySelector('[data-review-controls]');
    const position = gallery.querySelector('[data-review-position]');
    let active = 0;

    function showReview(index) {
      active = (index + panels.length) % panels.length;
      panels.forEach((panel, i) => {
        panel.hidden = i !== active;
        const transcript = panel.querySelector('details');
        if (panel.hidden && transcript) transcript.open = false;
      });
      position.textContent = `${active + 1} / ${panels.length}`;
      position.setAttribute('aria-label', `Review ${active + 1} of ${panels.length}`);
      if (index !== 0 || !controls.hidden) {
        const panel = panels[active];
        panel.getAnimations().forEach(animation => animation.cancel());
        if (!reduce.matches) panel.animate([{ opacity: .55, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
      }
    }

    if (panels.length > 1) {
      controls.addEventListener('click', event => {
        const button = event.target.closest('[data-review-step]');
        if (button) showReview(active + Number(button.dataset.reviewStep));
      });
      showReview(0);
      controls.hidden = false;
    }
  }

  const inspection = document.querySelector('.film-inspection');
  if (inspection) {
    const selector = inspection.querySelector('.pest-choices');
    const choices = [...selector.querySelectorAll('[data-pest-choice]')];
    const link = inspection.querySelector('[data-pest-link]');
    const readout = inspection.querySelector('[data-pest-location]');
    const roof = inspection.querySelector('.inspection-roof');
    const kitchen = inspection.querySelector('.inspection-kitchen');
    let change = 0;
    async function show(option) {
      const revision = ++change;
      const key = option.dataset.pestChoice;
      const next = key === 'rodent' ? roof : kitchen;
      const switched = next.hidden;
      if (switched) {
        const backdrop = next.querySelector('img');
        backdrop.loading = 'eager';
        await backdrop.decode().catch(()=>{});
        if (revision !== change) return;
      }
      roof.hidden = next !== roof;
      kitchen.hidden = next !== kitchen;
      link.href = option.dataset.href;
      link.firstChild.textContent = 'View pest service ';
      readout.textContent = option.dataset.location;
      inspection.dataset.pest = key;
      choices.forEach(button=>button.setAttribute('aria-pressed', String(button === option)));
      if (switched && !reduce.matches) next.animate([{opacity:.6},{opacity:1}],{duration:300,easing:'ease-out'});
    }
    readout.setAttribute('role','status');
    selector.hidden = false;
    for (const choice of choices) choice.addEventListener('click',()=>show(choice));
    show(choices[0]);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry])=>{
        inspection.classList.toggle('pest-in-view',entry.isIntersecting);
      },{threshold:.35}).observe(inspection);
    }
  }

  const trail = document.querySelector('.trail-control');
  if (trail) {
    trail.hidden = false;
    trail.addEventListener('click', () => {
      const visible = trail.closest('figure').classList.toggle('trail-visible');
      trail.setAttribute('aria-pressed',String(visible));
    });
  }
  const menu = document.querySelector('.site-menu');
  if (menu) {
    document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
    menu.addEventListener('keydown',event=>{
      if(event.key==='Escape' && menu.open){
        menu.open=false;
        menu.querySelector('summary').focus();
      }
    });
  }
})();
