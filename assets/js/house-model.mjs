// Orthographic projection of a small open-front house. The build also renders
// the initial view into HTML, so the architectural section works without JS.
export function houseSection(angle = 29, lift = 1) {
  const a = angle * Math.PI / 180;
  const project = ([x,y,z]) => [
    302 + (x*Math.cos(a) - z*Math.sin(a))*32,
    254 + (x*Math.sin(a) + z*Math.cos(a))*14 - y*32
  ].map(value=>Number(value.toFixed(1)));
  const faces = [];
  function face(points, fill, stroke = '#24483f') {
    const depth = points.reduce((sum,[x,y,z])=>sum + x*Math.sin(a) + z*Math.cos(a) + y*.68,0)/points.length;
    faces.push({depth, markup:`<polygon points="${points.map(p=>project(p).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>`});
  }
  function box(x,y,z,w,h,d,colors) {
    face([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],colors[0]);
    face([[x+w,y,z],[x+w,y+h,z],[x+w,y+h,z+d],[x+w,y,z+d]],colors[1]);
    face([[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]],colors[2]);
  }
  const timber = ['#f0d5aa','#ba9874','#caa780'];
  const pale = ['#f6f0da','#a1b5a3','#d6dfca'];
  box(-5,-.24,-2.8,10,.24,5.6,['#d8d8c3','#869a89','#aab9a6']);
  box(-4.65,0,-2.45,9.3,3.2,.18,pale);
  box(-4.65,0,-2.45,.18,3.2,4.9,pale);
  for (const x of [-4.48,-2.65,-.8,1.05,2.9,4.48]) box(x,0,-2.25,.07,3.1,.07,timber);
  box(-1.05,0,-2.1,.12,3.1,3.25,pale);
  box(-4.5,.03,-1.85,2.3,.73,1.15,timber);
  box(1.1,.06,-2.04,3.28,1.02,.83,timber);
  box(1.02,1.08,-2.12,3.44,.10,1.05,['#f8f3df','#c8c3ab','#d4d2bd']);
  box(-4.65,3.14,-2.46,9.3,.18,4.92,timber);
  for (const x of [-4.55,-2.32,0,2.32,4.55]) {
    face([[x,3.33,-2.4],[x,4.76,0],[x,4.63,0],[x,3.33,-2.2]],'#b48a5f');
    face([[x,4.76,0],[x,3.33,2.4],[x,3.33,2.2],[x,4.63,0]],'#d59e62');
    box(x-.045,0,2.25,.09,3.12,.09,timber);
  }
  const roof = 3.38 + lift * 1.55;
  face([[-4.95,roof,-2.75],[4.95,roof,-2.75],[4.95,roof+1.55,0],[-4.95,roof+1.55,0]],'#466758');
  face([[-4.95,roof+1.55,0],[4.95,roof+1.55,0],[4.95,roof,2.75],[-4.95,roof,2.75]],'#739080');
  const seams = [];
  for (let x=-4.8;x<4.9;x+=.52) seams.push(`<path d="M${project([x,roof+1.55,0])} L${project([x,roof,2.75])}" fill="none" stroke="#496b5b" stroke-width=".7"/>`);
  const eave = project([3.3,3.36,2.32]);
  return `<svg viewBox="0 0 600 365" role="img" aria-label="Illustrative three-dimensional house section showing the roof space above the ceiling"><ellipse cx="283" cy="277" rx="195" ry="49" fill="#c4cdbd" opacity=".55"/>${faces.sort((l,r)=>l.depth-r.depth).map(f=>f.markup).join('')}${seams.join('')}<path d="M${eave} l35,-23 h44" fill="none" stroke="#a64013" stroke-width="1.6"/><circle cx="${eave[0]}" cy="${eave[1]}" r="4.5" fill="#cb531a"/><text x="${eave[0]+80}" y="${eave[1]-19}" font-size="12" fill="#35473b">Eave</text></svg>`;
}
const figure = typeof document !== 'undefined' && document.querySelector('[data-house-model]');
if (figure) {
  const controls = figure.querySelector('fieldset');
  controls.hidden = false;
  controls.addEventListener('input', () => {
    const [angle, separation] = controls.querySelectorAll('input');
    figure.querySelector('.model-drawing').innerHTML = houseSection(Number(angle.value),Number(separation.value)/100);
  });
}
