function initialisePropertyMotion() {
  const {gsap, ScrollTrigger} = window;
  const arrival = document.querySelector('.arrival');
  if (!gsap || !ScrollTrigger || !arrival) return;
  gsap.registerPlugin(ScrollTrigger);
  const home = arrival.querySelector('.film-home');
  const view = home.querySelector('.film-view');
  const inspection = arrival.querySelector('.film-inspection');
  let media;

  function start() {
    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      arrival.classList.add('camera-linked');
      const mobile = matchMedia('(max-width:760px)').matches;
      const backdrop = inspection.querySelector('.inspection-media');
      const frameHeight = () => document.documentElement.clientHeight;
      const cameraRange = {trigger:inspection,start:'top bottom',end:'top top',invalidateOnRefresh:true};
      // Offset the incoming image against its own scroll until its section
      // reaches the top. Both photographs fill the frame during the dissolve.
      gsap.from(backdrop,{y:()=>-frameHeight(),ease:'none',
        scrollTrigger:{...cameraRange,scrub:true}});
      const approach = gsap.timeline({
        defaults:{ease:'none'},
        scrollTrigger:{...cameraRange,scrub:.55}
      });
      approach.to(view,{scale:mobile?1.13:1.32},0)
        .to(home.querySelectorAll('.film-home-copy,.film-down'),{opacity:0,duration:.28},0)
        .from(backdrop,{opacity:0,duration:.78},.22);

      let move, leave;
      if (!mobile && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        const x = gsap.quickTo(view,'x',{duration:.65,ease:'power2.out'});
        const y = gsap.quickTo(view,'y',{duration:.65,ease:'power2.out'});
        gsap.set(view,{scale:1.018});
        move = event => {
          const rect=home.getBoundingClientRect();
          x((event.clientX/rect.width-.5)*12);
          y(((event.clientY-rect.top)/rect.height-.5)*9);
        };
        leave = () => {x(0);y(0);};
        home.addEventListener('pointermove',move);
        home.addEventListener('pointerleave',leave);
      }
      return () => {
        arrival.classList.remove('camera-linked');
        if (move) home.removeEventListener('pointermove',move);
        if (leave) home.removeEventListener('pointerleave',leave);
      };
    });
  }

  start();
  addEventListener('pagehide',()=>media.revert());
  addEventListener('pageshow',event=>{if(event.persisted)start();});
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
