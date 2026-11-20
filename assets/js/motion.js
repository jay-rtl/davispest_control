function initialisePropertyMotion() {
  const {gsap, ScrollTrigger} = window;
  const main = document.querySelector('main');
  if (!gsap || !ScrollTrigger || !main) return;
  gsap.registerPlugin(ScrollTrigger);
  let media;
  function start() {
    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const mobile = matchMedia('(max-width:760px)').matches;
      const opening = main.querySelector('.property-opening');
      const plane = main.querySelector('.camera-plane');
      const sectionTrigger = section => ({trigger:section,start:'top 94%',end:'top 49%',scrub:.65,invalidateOnRefresh:true});
      const removeListeners = [];
      if (plane) {
        gsap.to(plane,{'--camera-scale':mobile?1.055:1.23,ease:'none',scrollTrigger:{trigger:opening,start:'top top',end:'bottom top',scrub:.8}});
        const inside = main.querySelector('[data-view="interior"] img');
        if (inside) {
          let dissolve;
          let entering;
          const approach = ScrollTrigger.create({trigger:opening,start:'top -8%',end:'bottom 6%',
            onUpdate:self=>{
              if (!entering && self.progress>0) {
                entering=inside.cloneNode();
                entering.alt='';entering.sizes='100vw';entering.loading='eager';entering.className='room-transition';
                opening.querySelector('.opening-view').append(entering);
                dissolve=gsap.quickSetter(entering,'opacity');
              }
              if (dissolve) dissolve(Math.min(.95,self.progress*self.progress));
            }
          });
          removeListeners.push(()=>{approach.kill();entering?.remove();});
        }
        if (!mobile && matchMedia('(hover:hover) and (pointer:fine)').matches) {
          let cancelled=false,releaseDepth;
          const enableDepth = async () => {
            if (navigator.connection?.saveData) return;
            try {
              const {mountDepthView}=await import('./property-depth.mjs');
              await plane.querySelector('img').decode();
              if (!cancelled) releaseDepth=mountDepthView(plane);
            } catch { /* The photograph stays visible on unsupported devices. */ }
          };
          opening.addEventListener('pointermove',enableDepth,{once:true});
          removeListeners.push(()=>{cancelled=true;opening.removeEventListener('pointermove',enableDepth);releaseDepth?.();});
          const x = gsap.quickTo(plane,'--camera-x',{duration:.65,ease:'power2.out'});
          const y = gsap.quickTo(plane,'--camera-y',{duration:.65,ease:'power2.out'});
          const move = event => {
            const rect = opening.getBoundingClientRect();
            x(((event.clientX-rect.left)/rect.width-.5)*14+'px');
            y(((event.clientY-rect.top)/rect.height-.5)*9+'px');
          };
          const leave = () => { x('0px');y('0px'); };
          opening.addEventListener('pointermove',move);
          opening.addEventListener('pointerleave',leave);
          removeListeners.push(() => { opening.removeEventListener('pointermove',move); opening.removeEventListener('pointerleave',leave); });
        }
      }
      for (const section of main.querySelectorAll('.story-section,.comfort-scene,.return-scene,.habitat-section')) {
        const title = section.querySelector('h2');
        if (title) gsap.from(title,{y:mobile?14:30,clipPath:'inset(0 0 9% 0)',ease:'none',scrollTrigger:sectionTrigger(title)});
        const shot = section.querySelector('.tall-shot img,.plan-grid figure img,.portrait-grid figure img,.comfort-image img,.return-image img');
        if (shot) gsap.fromTo(shot,{scale:1.065},{scale:1,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:.8}});
      }
      const steps = main.querySelector('.process-steps');
      if (steps) gsap.from(steps.children,{x:mobile?8:20,stagger:.2,ease:'none',scrollTrigger:sectionTrigger(steps)});
      const bar = document.querySelector('.nav-wrap');
      if (bar) gsap.to(bar,{'--page-read':1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
      let timer;
      const refresh = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(),120);
      });
      refresh.observe(main);
      return () => { refresh.disconnect();clearTimeout(timer);removeListeners.forEach(remove=>remove()); };
    });
  }
  start();
  addEventListener('pagehide',() => media?.revert());
  addEventListener('pageshow',event => { if (event.persisted) start(); });
}

(() => {
  const base = new URL('../vendor/',document.currentScript.src);
  const motionPreference = matchMedia('(prefers-reduced-motion:no-preference)');
  let started = false;
  const events = ['pointerover','wheel','touchstart','keydown'];
  function load(name) {
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=new URL(name,base).href;
      script.onload=resolve;script.onerror=reject;
      document.head.append(script);
    });
  }
  async function begin() {
    if (started || !motionPreference.matches) return;
    started=true;
    events.forEach(event=>window.removeEventListener(event,begin));
    try {
      if (!window.gsap) await load('gsap.min.js');
      if (!window.ScrollTrigger) await load('ScrollTrigger.min.js');
      initialisePropertyMotion();
    } catch { /* Native scrolling and every chapter remain available. */ }
  }
  events.forEach(event=>window.addEventListener(event,begin,{passive:true}));
  motionPreference.addEventListener('change',begin);
  if (location.hash) begin();
})();
