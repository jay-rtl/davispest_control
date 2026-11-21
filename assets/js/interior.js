(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const vendor = new URL('../vendor/', document.currentScript.src);

  function enter(element, distance = 8) {
    if (!motion.matches) return;
    element.getAnimations().forEach(animation => animation.cancel());
    element.animate(
      [{ opacity: .62, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 265, easing: 'cubic-bezier(.22,.65,.36,1)' }
    );
  }

  const gallery = document.querySelector('[data-field-gallery]');
  if (gallery) {
    const options = gallery.querySelector('.field-options');
    const buttons = [...options.querySelectorAll('[data-pest-select]')];
    const panels = [...gallery.querySelectorAll('[data-pest-panel]')];
    let current;
    function select(key, animate) {
      const next = panels.find(panel => panel.id === key) || panels[0];
      if (current === next) return;
      const image = next.querySelector('img');
      image.loading = 'eager';
      panels.forEach(panel => { panel.hidden = panel !== next; });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pestSelect === next.id)));
      current = next;
      if (animate) enter(next);
    }
    select(location.hash.slice(1), false);
    options.addEventListener('click', event => {
      const button = event.target.closest('[data-pest-select]');
      if (button) select(button.dataset.pestSelect, true);
    });
    window.addEventListener('hashchange', () => {
      const key = location.hash.slice(1);
      if (panels.some(panel => panel.id === key)) {
        select(key, false);
        current.scrollIntoView({ block: 'start' });
      }
    });
    options.hidden = false;
  }

  const explorer = document.querySelector('[data-area-explorer]');
  if (explorer) {
    const places = [...explorer.querySelectorAll('[data-area-place]')];
    const buttons = [...explorer.querySelectorAll('[data-area-select]')];
    const input = explorer.querySelector('#area-search');
    const status = explorer.querySelector('[data-area-status]');
    const preview = explorer.querySelector('[data-map-preview]');
    const normalize = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const terms = new Map(places.map(place => [place.dataset.areaPlace, normalize(place.textContent)]));
    let current;

    function select(key, animate = true) {
      const next = places.find(place => place.dataset.areaPlace === key);
      places.forEach(place => { place.hidden = place !== next; });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.areaSelect === key)));
      preview.hidden = !next;
      if (next) {
        preview.href = next.querySelector('a').href;
        preview.textContent = next.querySelector('h3').textContent;
      }
      if (next && next !== current && animate) enter(next, 5);
      current = next;
    }

    function filter(key) {
      const needle = normalize(input.value);
      const matches = places.map(place => place.dataset.areaPlace).filter(slug => terms.get(slug).includes(needle));
      const active = key || current?.dataset.areaPlace;
      buttons.forEach(button => { button.hidden = !matches.includes(button.dataset.areaSelect); });
      status.textContent = needle ? (matches.length ? `${matches.length} matching local ${matches.length === 1 ? 'page' : 'pages'}` : 'No linked suburb matches this search.') : '';
      select(matches.includes(active) ? active : matches[0], Boolean(current));
    }

    explorer.addEventListener('click', event => {
      const button = event.target.closest('[data-area-select]');
      if (button) select(button.dataset.areaSelect);
    });
    input.addEventListener('input', () => filter());
    filter();
    explorer.querySelectorAll('[data-area-controls]').forEach(group => { group.hidden = false; });
  }

  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const portrait = document.querySelector('[data-parallax]');
  if (!reveals.length || !('IntersectionObserver' in window)) return;

  function load(name) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL(name, vendor);
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  let context, started = false;
  function setupMotion() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    context = gsap.matchMedia();
    context.add('(prefers-reduced-motion: no-preference)', () => {
      for (const element of reveals) {
        if (element.getBoundingClientRect().top < window.innerHeight) continue;
        gsap.fromTo(element, { y: 15, opacity: .8 }, {
          y: 0, opacity: 1, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 67%', scrub: .72 }
        });
      }
    });
    if (portrait) {
      context.add('(prefers-reduced-motion: no-preference) and (min-width: 850px)', () => {
        gsap.fromTo(portrait.querySelector('img'), { yPercent: -2.5, scale: 1.07 }, {
          yPercent: 2.5, scale: 1.07, ease: 'none',
          scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: .9 }
        });
      });
    }
  }
  const nearby = new Set();
  async function startMotion() {
    if (started || !motion.matches || !nearby.size || window.scrollY === 0) return;
    started = true;
    observer.disconnect();
    window.removeEventListener('scroll', startMotion);
    try {
      await load('gsap.min.js');
      await load('ScrollTrigger.min.js');
      setupMotion();
    } catch {
      // All sections stay visible when optional scroll motion is unavailable.
    }
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) nearby.add(entry.target);
      else nearby.delete(entry.target);
    }
    startMotion();
  }, { rootMargin: '300px 0px' });
  for (const element of reveals) observer.observe(element);
  if (portrait) observer.observe(portrait);
  window.addEventListener('scroll', startMotion, { passive:true });
  addEventListener('pagehide', () => { context?.revert(); });
  addEventListener('pageshow', event => { if (event.persisted && started) setupMotion(); });
})();
