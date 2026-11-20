import fs from 'node:fs';
import path from 'node:path';
import renderShell from '../assets/js/shell.js';
import {renderHome} from './property-story.mjs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetVersion = file => createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 12);
const versions = {
  shell: assetVersion('assets/js/shell.js'),
  site: assetVersion('assets/js/site.js'),
  motion: assetVersion('assets/js/motion.js'),
  art: assetVersion('assets/css/art-direction.css')
};
const services = JSON.parse(fs.readFileSync(path.join(root,'content/services.json'),'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status==='published');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const featuredReviews = JSON.parse(fs.readFileSync(path.join(root,'content/featured-google-reviews.json'),'utf8'));
if (featuredReviews.reviews.length !== 6 || featuredReviews.reviews.some(item => !Number.isInteger(item.rating) || item.rating < 1 || item.rating > 5 || !item.author?.trim() || !Array.isArray(item.paragraphs) || !item.paragraphs.length || item.paragraphs.some(paragraph => !paragraph.trim()))) throw Error('Featured Google reviews need six attributed full comments');
const original = ['index.html','about/index.html','residential-pest-control/index.html','commercial-pest-control/index.html','services/index.html','service-areas/index.html','faqs/index.html','contact/index.html'];
const generated = [...services.map(item=>`services/${item.slug}/index.html`),...locations.map(item=>`pest-control/${item.slug}/index.html`)];
const fallbackNav = `<nav class="noscript-nav" aria-label="Main navigation"><a href="/">Davis Pest Solutions</a><a href="/services/">Services</a><a href="/service-areas/">Areas we serve</a><a href="/about/">About</a><a href="/faqs/">FAQs</a><a href="/contact/#request-service">Request a quote</a></nav>`;
for (const name of [...original,...generated]) {
  const file = path.join(root,name);
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s*\/>/g,'').replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin\s*\/>/g,'').replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]+\/>/g,'');
  const page = html.match(/<body data-page="([^"]+)"/)?.[1] || 'home';
  const {header,footer} = renderShell(page,'/'+name.replace(/index\.html$/,''));
  html = html.replace(/<header data-header>[\s\S]*?<\/header>/,()=>`<header data-header>${header}<noscript>${fallbackNav}</noscript></header>`);
  const footerPattern = html.includes('<!--footer-end-->') ? /<div data-footer>[\s\S]*?<!--footer-end-->/ : /<div data-footer>\s*(?:<footer class="fallback-footer">[\s\S]*?<\/footer>)?\s*<\/div>/;
  html = html.replace(footerPattern,()=>`<div data-footer>${footer}</div><!--footer-end-->`);
  html = html.replace(/<script src="\/assets\/js\/shell\.js[^"]*"[^>]*>\s*<\/script>/g,'');
  if (name !== 'index.html' && !html.includes('/assets/css/premium.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/premium.css"></head>');
  if (name !== 'index.html' && !html.includes('/assets/css/art-direction.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/art-direction.css"></head>');
  if (!html.includes('rel="preload" as="font"')) html = html.replace('</head>','<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Manrope-latin.woff2" crossorigin><link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Inter-latin.woff2" crossorigin></head>');
  html = html.replace(/<script src="\/assets\/vendor\/(?:gsap|ScrollTrigger)\.min\.js" defer><\/script>/g,'');
  if (name !== 'index.html') html = html.replace(/<script src="\/assets\/js\/motion\.js[^"]*" defer><\/script>/g,'');
  else if (!html.includes('/assets/js/motion.js')) html = html.replace('</body>','<script src="/assets/js/motion.js" defer></script></body>');
  html = html.replace(/\/assets\/js\/shell\.js(?:\?v=[^"']+)?/g, `/assets/js/shell.js?v=${versions.shell}`)
    .replace(/\/assets\/js\/site\.js(?:\?v=[^"']+)?/g, `/assets/js/site.js?v=${versions.site}`)
    .replace(/\/assets\/js\/motion\.js(?:\?v=[^"']+)?/g, `/assets/js/motion.js?v=${versions.motion}`)
    .replace(/\/assets\/css\/art-direction\.css(?:\?v=[^"']+)?/g, `/assets/css/art-direction.css?v=${versions.art}`);
  if (!html.includes('/assets/css/property.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/property.css"></head>');
  if (!html.includes('/assets/js/property.js')) html = html.replace('</body>','<script src="/assets/js/property.js" defer></script></body>');
  fs.writeFileSync(file,html);
}
const homePath = path.join(root,'index.html');
const home = fs.readFileSync(homePath,'utf8').replace(/<main\b[\s\S]*?<\/main>/, () => renderHome(services, locations, featuredReviews));
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
const finder = `<div class="area-finder" hidden><label for="area-search">Find your suburb or region</label><input type="search" id="area-search" placeholder="e.g. Papatoetoe" autocomplete="off"><output aria-live="polite"></output></div>`;
const revisedDirectory = directory.replace('<div class="location-cards">',finder+'<div class="location-cards">').replace('Find a starting point.', 'Pest Control Across Auckland.').replace('Beyond these suburbs?', "Don't see your suburb?");
if (areas.includes('id="suburb-directory"')) areas = areas.replace(/<section class="section location-directory" id="suburb-directory">[\s\S]*?<\/section>/,revisedDirectory);
else areas = areas.replace('</main>',revisedDirectory+'\n    </main>');
for (const item of locations) {
  const heading = '<span class="location-card-region">'+escapeHtml(item.region)+'</span>';
  areas = areas.replace(heading, '<span class="location-card-region" data-nearby="'+escapeHtml(item.nearby.join(', '))+'">'+escapeHtml(item.region)+'</span>');
}
fs.writeFileSync(areasPath,areas);
// Each deployed page must request the CSS/JS built with it. Hostinger and browsers
// can otherwise keep older files for a month while the HTML has already changed.
for (const name of [...original, ...generated, 'intro/index.html', '404.html']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8').replace(
    /(?<=["'\s])\/assets\/(?:css|js|images(?:\/[a-zA-Z0-9_.-]+)*)\/[a-zA-Z0-9_.-]+\.(?:css|mjs|js|png|jpe?g|webp|svg|avif|gif)(?:\?v=[a-f0-9]+)?/g,
    asset => {
      const relative = asset.split('?')[0].slice(1);
      return `${asset.split('?')[0]}?v=${assetVersion(relative)}`;
    }
  );
  fs.writeFileSync(file, html);
}
console.log(`Integrated design and navigation into ${original.length+generated.length} pages.`);
