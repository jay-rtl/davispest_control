(() => {
  const {gsap, ScrollTrigger} = window;
  if (!gsap || !ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion-active');

  const main = document.querySelector('main');
  if (!main) return;
  const mobile = matchMedia('(max-width: 700px)').matches;
  const animations = [];
  const seen = new WeakSet();
  const add = animation => animations.push(animation);
  const select = selector => [...main.querySelectorAll(selector)];
  const unique = elements => elements.filter(element => {
    if (seen.has(element)) return false;
    seen.add(element);
    return true;
  });
  const trigger = (element, start = 'top 90%', end = 'top 42%') => ({
    trigger: element, start, end, scrub: mobile ? 1 : 1.5,
    invalidateOnRefresh: true
  });

  // The intro is a separate route. Let the homepage arrive in layers when it
  // loads, then hand over to scroll-linked movement without hiding HTML in CSS.
  if (document.body.dataset.page === 'home') {
    const hero = document.querySelector('.hero');
    const heroCopy = [...hero.querySelectorAll('.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .lead, .hero-actions, .trust-row')];
    const entrance = gsap.timeline({defaults: {ease: 'power3.out'}, onComplete: () => ScrollTrigger.refresh()});
    entrance.fromTo(hero.querySelector('.client-photo'),
      {clipPath: 'inset(0 0 0 22%)'},
      {clipPath: 'inset(0 0 0 0%)', duration: 1.25, ease: 'power3.inOut'}, 0
    ).fromTo(heroCopy,
      {y: mobile ? 19 : 31, clipPath: 'inset(0 0 16% 0)', opacity: .55},
      {y: 0, clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .85, stagger: .11}, .12
    ).fromTo(hero.querySelector('.brand-note'),
      {y: 18, opacity: .45},
      {y: 0, opacity: 1, duration: .7}, .65
    );
    add(entrance);

    const strip = document.querySelector('.brand-strip-inner');
    if (strip) {
      const stripTimeline = gsap.timeline({scrollTrigger: trigger(strip, 'top 96%', 'bottom 70%')});
      [...strip.children].forEach((item, index) => stripTimeline.fromTo(item,
        {y: mobile ? 12 : 22, clipPath: 'inset(0 0 24% 0)', opacity: .65},
        {y: 0, clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1, ease: 'none'},
        index * .36
      ));
      add(stripTimeline);
    }
  }

  // Keep the first screen readable. A reversible image movement connects it
  // to the next section without moving the page layout.
  select('.hero .client-photo img, .page-hero figure img, .premium-page-hero figure img')
    .forEach(image => add(gsap.fromTo(image,
      {yPercent: 0, scale: 1},
      {yPercent: mobile ? 2 : 5, scale: mobile ? 1.025 : 1.045,
        ease: 'none', scrollTrigger: trigger(image.closest('.hero,.page-hero,.premium-page-hero') || image, 'top top', 'bottom top')}
    )));

  // Editorial headings unfold across their own scroll distance.
  unique(select('.section h2, .contact-section h2'))
    .forEach(heading => add(gsap.fromTo(heading,
      {y: mobile ? 24 : 44, clipPath: 'inset(0 0 24% 0)', opacity: .78},
      {y: 0, clipPath: 'inset(0 0 0% 0)', opacity: 1, ease: 'none',
        scrollTrigger: trigger(heading, 'top 92%', 'top 48%')}
    )));

  unique(select('.section-head .section-intro, .section-head > p, .editorial-index > p, .area-coverage-copy > p, .directory-heading > p, .editorial-body > p'))
    .forEach(copy => add(gsap.fromTo(copy,
      {y: mobile ? 15 : 28, opacity: .7},
      {y: 0, opacity: 1, ease: 'none', scrollTrigger: trigger(copy, 'top 94%', 'top 55%')}
    )));

  // One timeline per group creates an ordered, scroll-linked sequence.
  select('.grid-4, .why-choose-grid, .timeline, .service-list, .reviews-grid, .credentials-grid')
    .forEach(group => {
      const items = [...group.children].filter(element => element.matches('article, .card, .step, .review-card, .review-invite, .content-block, aside, section'));
      if (items.length < 2) return;
      const timeline = gsap.timeline({scrollTrigger: trigger(group, 'top 88%', 'bottom 58%')});
      items.forEach((item, index) => timeline.fromTo(item,
        {y: mobile ? 20 : 36, opacity: .68, scale: .985},
        {y: 0, opacity: 1, scale: 1, ease: 'none', duration: 1},
        index * .42
      ));
      add(timeline);
      items.forEach(item => seen.add(item));
    });

  unique(select('.location-card, .faq, .premium-columns > *, .editorial-grid > *, .cta > *, .area-coverage-copy, .contact-info, .servicem8-intro'))
    .forEach((item, index) => add(gsap.fromTo(item,
      {y: mobile ? 17 : 30, opacity: .74, scale: .99},
      {y: 0, opacity: 1, scale: 1, ease: 'none',
        scrollTrigger: trigger(item, index % 2 ? 'top 88%' : 'top 92%', 'top 47%')}
    )));

  // Review cards were outside the generic grids, so they previously had no
  // ScrollTrigger at all. Keep each reveal tied to its own scroll distance.
  select('.google-review').forEach((card, index) => add(gsap.fromTo(card,
    {y: mobile ? 23 : 42, scale: .985, clipPath: 'inset(0 0 12% 0)', opacity: .78},
    {y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)', opacity: 1, ease: 'none',
      scrollTrigger: trigger(card, index % 2 ? 'top 89%' : 'top 94%', 'top 48%')}
  )));

  // Maps and authentic work photos open from a restrained crop.
  unique(select('.services-feature img, .client-meet-photo img, .why-photo img, .home-map img, .service-map-image img, .premium-photo img, .area-coverage figure img')
    .filter(image => !image.closest('.hero,.page-hero,.premium-page-hero')))
    .forEach(image => add(gsap.fromTo(image,
      {clipPath: 'inset(0 0 15% 0)', scale: 1.045, y: mobile ? 12 : 22},
      {clipPath: 'inset(0 0 0% 0)', scale: 1, y: 0, ease: 'none',
        scrollTrigger: trigger(image, 'top 92%', 'top 38%')}
    )));

  const refresh = () => ScrollTrigger.refresh();
  select('.google-review__toggle').forEach(button => button.addEventListener('click', () => requestAnimationFrame(refresh)));
  addEventListener('load', refresh, {once: true});
  addEventListener('pagehide', () => {
    removeEventListener('load', refresh);
    animations.forEach(animation => animation.kill());
  }, {once: true});
})();
