import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const services = JSON.parse(fs.readFileSync(path.join(root,'content/services.json'),'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status==='published');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const original = ['index.html','about/index.html','residential-pest-control/index.html','commercial-pest-control/index.html','services/index.html','service-areas/index.html','faqs/index.html','contact/index.html'];
const generated = [...services.map(item=>`services/${item.slug}/index.html`),...locations.map(item=>`pest-control/${item.slug}/index.html`)];
const fallbackNav = `<header data-header><nav class="noscript-nav" aria-label="Main navigation"><a href="/">Davis Pest Solutions</a><a href="/services/">Services</a><a href="/service-areas/">Areas we serve</a><a href="/about/">About</a><a href="/contact/#request-service">Request a quote</a></nav></header>`;
const fallbackFooter = `<div data-footer><footer class="fallback-footer"><a href="/contact/#request-service">Request a quote</a> · <a href="tel:0204732847">02047-DAVIS</a> · <a href="mailto:ej@davispestsol.co.nz">Email Davis</a></footer></div>`;
for (const name of [...original,...generated]) {
  const file = path.join(root,name);
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s*\/>/g,'').replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin\s*\/>/g,'').replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]+\/>/g,'');
  html = html.replace(/<header data-header>\s*(?:<nav class="noscript-nav"[\s\S]*?<\/nav>)?\s*<\/header>/,fallbackNav);
  html = html.replace(/<div data-footer>\s*(?:<footer class="fallback-footer"[\s\S]*?<\/footer>)?\s*<\/div>/,fallbackFooter);
  if (!html.includes('/assets/css/premium.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/premium.css"></head>');
  if (!html.includes('/assets/css/art-direction.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/art-direction.css"></head>');
  if (!html.includes('rel="preload" as="font"')) html = html.replace('</head>','<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Manrope-latin.woff2" crossorigin><link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Inter-latin.woff2" crossorigin></head>');
  if (!html.includes('/assets/js/motion.js')) html = html.replace('</body>','<script src="/assets/vendor/gsap.min.js" defer></script><script src="/assets/vendor/ScrollTrigger.min.js" defer></script><script src="/assets/js/motion.js" defer></script></body>');
  fs.writeFileSync(file,html);
}
const serviceLinks = {cockroaches:'cockroach-control',rodents:'rodent-control',ants:'ant-control',flies:'fly-control',wasps:'wasp-control',fleas:'flea-treatment',spiders:'spider-control'};
const homePath = path.join(root,'index.html');
let home = fs.readFileSync(homePath,'utf8');
home = home.replaceAll('/pest-control/papatoetoe/', '/pest-control/manukau/').replace('Papatoetoe ↗', 'Manukau ↗');
for (const [anchor,slug] of Object.entries(serviceLinks)) home = home.replaceAll(`/services/#${anchor}`,`/services/${slug}/`);
const homeFeature = `<section class="section" id="explore-auckland"><div class="container"><div class="editorial-index"><span class="eyebrow">Areas we serve</span><h2>Auckland, up close.</h2><p>Davis works across the Auckland coverage area shown on the client-supplied map. Send your address to confirm availability.</p><div class="location-links">${locations.map(item=>`<a href="/pest-control/${item.slug}/">${item.name} ↗</a>`).join('')}</div><p><a class="text-link" href="/service-areas/">Explore all service areas ↗</a></p></div><figure class="home-map"><img src="/assets/images/auckland-service-area-map-client-2026-08.jpg" width="3644" height="3453" alt="Davis Pest Solutions Auckland service area map" loading="lazy" decoding="async"><figcaption>Client-provided Auckland coverage map</figcaption></figure></div></section>
<section class="section premium-band" id="customer-voices"><div class="container"><div class="google-reviews-head"><div><span class="eyebrow">From our customers</span><h2>What Auckland customers are saying.</h2><p class="section-intro">Recent feedback from customers who shared their experience on Google.</p></div><span class="google-reviews-mark" aria-hidden="true">Google<br>Reviews</span></div><div class="google-reviews-grid" id="home-reviews"><div class="google-reviews-fallback"><span>Real experiences, in their own words.</span><p>See verified customer feedback on the Davis Pest Solutions Google profile.</p></div></div><a class="google-reviews-all" href="https://www.google.com/maps/place/Davis+Pest+Solutions/@-36.8328344,174.7265725,10z/data=!3m1!4b1!4m6!3m5!1s0x6ab4724ea672766d:0xea0b8b0f8519d558!8m2!3d-36.8328344!4d174.7265725!16s%2Fg%2F11zz7s0jdb" target="_blank" rel="noopener noreferrer">Read all reviews on Google <span aria-hidden="true">↗</span></a></div></section>`;
if (!home.includes('id="customer-voices"')) home = home.replace('      <section class="section">\n        <div class="container cta">',homeFeature+'\n      <section class="section">\n        <div class="container cta">');
if (!home.includes('/assets/js/home-reviews.js')) home = home.replace('</body>','<script src="/assets/js/home-reviews.js" defer></script></body>');
fs.writeFileSync(homePath,home);
const servicesPath = path.join(root,'services/index.html');
let servicesHtml = fs.readFileSync(servicesPath,'utf8');
for (const [heading,slug] of Object.entries({'Cockroach Control':'cockroach-control','Rat &amp; Mouse Control':'rodent-control','Ant Control':'ant-control','Fly Control':'fly-control','Wasp Control':'wasp-control','Flea Treatment':'flea-treatment','Spider Control':'spider-control'})) {
  servicesHtml = servicesHtml.replace(`<h2>${heading}</h2>`,`<h2><a class="service-heading-link" href="/services/${slug}/">${heading} <span aria-hidden="true">↗</span></a></h2>`);
}
fs.writeFileSync(servicesPath,servicesHtml);
const areasPath = path.join(root,'service-areas/index.html');
let areas = fs.readFileSync(areasPath,'utf8');
for (const item of locations) if (!item.directoryContext) throw Error(`Missing directory context for ${item.slug}`);
const directory = `<section class="section location-directory" id="suburb-directory"><div class="container"><div class="directory-heading"><div><span class="eyebrow">Local pages</span><h2>Find a starting point.</h2></div><p>Explore a published suburb page below, or tell Davis your address to confirm service availability.</p></div><div class="location-cards">${locations.map(item=>`<a class="location-card" href="/pest-control/${item.slug}/"><span class="location-card-region">${escapeHtml(item.region)}</span><h3 class="location-card-name">${escapeHtml(item.name)} <span aria-hidden="true">↗</span></h3><span class="location-card-context">${escapeHtml(item.directoryContext)}</span></a>`).join('')}<div class="location-card location-card--help"><span class="location-card-region">Address check</span><h3 class="location-card-name">Beyond these suburbs?</h3><p class="location-card-context">The map covers more of Auckland than the published page list. Send Davis your address to confirm availability.</p><a class="text-link" href="/contact/#request-service">Ask about your address ↗</a></div></div></div></section>`;
const revisedDirectory = directory.replace('Find a starting point.', 'Pest Control Across Auckland.').replace('Beyond these suburbs?', "Don't see your suburb?");
if (areas.includes('id="suburb-directory"')) areas = areas.replace(/<section class="section location-directory" id="suburb-directory">[\s\S]*?<\/section>/,revisedDirectory);
else areas = areas.replace('</main>',revisedDirectory+'\n    </main>');
fs.writeFileSync(areasPath,areas);
console.log(`Integrated design and navigation into ${original.length+generated.length} pages.`);
