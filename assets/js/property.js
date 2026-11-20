(() => {
  const guide = document.querySelector('.guide-layout');
  if (guide) {
    const choices = [...guide.querySelectorAll('[data-pick]')];
    const panels = [...guide.querySelectorAll('.observation')];
    function select(key) {
      const pin = choices.find(link => link.classList.contains('guide-pin') && link.dataset.pick === key);
      if (!pin) return;
      const scene = pin.closest('[data-view]').dataset.view;
      choices.forEach(link => {
        if (link.dataset.pick === key) link.setAttribute('aria-current','true');
        else link.removeAttribute('aria-current');
      });
      panels.forEach(panel => { panel.hidden = panel.id !== 'observation-' + key; });
      guide.querySelectorAll('[data-view]').forEach(view => { view.hidden = view.dataset.view !== scene; });
      guide.querySelector('[data-view-name]').textContent = scene === 'exterior' ? 'House exterior' : 'Kitchen interior';
    }
    const fromHash = () => select(location.hash.startsWith('#observation-') ? location.hash.slice(13) : 'cockroach');
    fromHash();
    addEventListener('hashchange', fromHash);
    guide.addEventListener('click', event => {
      const link = event.target.closest('[data-pick]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(link.dataset.pick);
      const current = guide.querySelector('.observation:not([hidden])');
      guide.querySelector('[data-guide-status]').textContent = current.querySelector('h3').textContent + '. ' + current.querySelector('strong').textContent + '. ' + current.querySelector('p').textContent;
    });
  }
  const controls = document.querySelector('.review-controls');
  if (controls) {
    const sheets = [...document.querySelectorAll('.review-sheet')];
    let index = 0;
    const show = () => {
      sheets.forEach((sheet,i) => { sheet.hidden = i !== index; });
      controls.querySelector('output').textContent = `Review ${index+1} of ${sheets.length} · ${sheets[index].querySelector('strong').textContent}`;
    };
    controls.hidden = false;
    controls.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      index = (index + Number(button.dataset.reviewStep) + sheets.length) % sheets.length;
      show();
      if (!matchMedia('(prefers-reduced-motion:reduce)').matches) sheets[index].animate([{transform:'translateY(7px)'},{transform:'none'}],{duration:230,easing:'ease-out'});
    });
    show();
  }
  const finder = document.querySelector('.area-finder');
  if (finder) {
    const cards = [...document.querySelectorAll('a.location-card')];
    const query = finder.querySelector('input');
    const normalize = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const entries = cards.map(card => ({card, terms:normalize(card.textContent + ' ' + card.querySelector('[data-nearby]').dataset.nearby)}));
    function filter() {
      const needle = normalize(query.value);
      let count = 0;
      for (const entry of entries) {
        entry.card.hidden = !entry.terms.includes(needle);
        if (!entry.card.hidden) count++;
      }
      finder.querySelector('output').textContent = count ? `${count} local ${count===1?'page':'pages'}` : 'No matching page. Ask Davis about your address below.';
    }
    finder.hidden = false;
    query.addEventListener('input',filter);
    filter();
  }
  const trail = document.querySelector('.trail-control');
  if (trail) {
    trail.hidden = false;
    trail.addEventListener('click', () => {
      const visible = trail.closest('figure').classList.toggle('trail-visible');
      trail.setAttribute('aria-pressed',String(visible));
    });
  }
  const chapters = document.querySelector('.chapter-menu');
  if (chapters) {
    chapters.addEventListener('click',event => { if (event.target.closest('a')) chapters.open = false; });
    document.addEventListener('click',event => { if (!chapters.contains(event.target)) chapters.open = false; });
    chapters.addEventListener('keydown',event => {
      if (event.key === 'Escape') { chapters.open = false; chapters.querySelector('summary').focus(); }
    });
  }
})();
