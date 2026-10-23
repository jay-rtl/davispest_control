(() => {
  const skip = document.querySelector('.intro-skip');
  let leaving = false;
  const leave = () => {
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem('davis-intro-seen', '1'); } catch {}
    location.replace('/');
  };
  skip.addEventListener('click', event => { event.preventDefault(); leave(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); leave(); }
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) {
    setTimeout(leave, 100);
    return;
  }
  const timeline = gsap.timeline({onComplete: leave});
  timeline.fromTo('.intro-logo', {autoAlpha: 0, clipPath: 'inset(0 100% 0 0)'}, {autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut'}, .2)
    .fromTo('.intro-kicker,.intro-tagline', {autoAlpha: 0, y: 16}, {autoAlpha: 1, y: 0, duration: .6, stagger: .13, ease: 'power2.out'}, 1.25)
    .to('.intro-content', {autoAlpha: 0, duration: .55, ease: 'power2.inOut'}, 2.9);
})();
