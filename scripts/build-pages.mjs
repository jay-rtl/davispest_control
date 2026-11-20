import fs from 'node:fs';
import path from 'node:path';
import {sightings, number, sceneImage} from './property-story.mjs';
import {houseSection} from '../assets/js/house-model.mjs';

const root = path.resolve(import.meta.dirname, '..');
const site = 'https://davispestsol.co.nz';
const services = JSON.parse(fs.readFileSync(path.join(root, 'content/services.json'), 'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root, 'content/locations.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const assertSlug = slug => { if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error(`Invalid slug: ${slug}`); };
const publicLocations = locations.filter(location => location.status === 'published');
for (const item of [...services, ...locations]) assertSlug(item.slug);
for (const location of publicLocations) {
  if (!location.evidence || !location.subheading || !location.intro || !location.local || !location.services || !location.nearby?.length || !location.cta) throw Error(`Incomplete published location: ${location.slug}`);
}
const jsonLd = data => JSON.stringify(data).replace(/</g, '\\u003c');
const shell = (title, description, canonical, page, body, schema) => `<!doctype html>
<html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${site}${canonical}">
<meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${site}${canonical}"><meta property="og:image" content="${site}/assets/images/client/davis2.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1704"><meta property="og:image:height" content="923"><meta property="og:image:alt" content="EJ of Davis Pest Solutions preparing pest control equipment beside his service vehicle">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${site}/assets/images/client/davis2.png"><link rel="icon" href="/assets/images/davis-logo.jpg">
<link rel="stylesheet" href="/assets/css/site.css"><link rel="stylesheet" href="/assets/css/refined.css"><link rel="stylesheet" href="/assets/css/premium.css"><link rel="stylesheet" href="/assets/css/art-direction.css">
<script type="application/ld+json">${jsonLd(schema)}</script></head><body data-page="${page}"><header data-header></header><main id="main">${body}</main><div data-footer></div>
<script src="/assets/js/shell.js" defer></script><script src="/assets/js/site.js" defer></script><script src="/assets/vendor/gsap.min.js" defer></script><script src="/assets/vendor/ScrollTrigger.min.js" defer></script><script src="/assets/js/motion.js" defer></script></body></html>`;
const breadcrumb = (name, parentName, parentRoute, route) => ({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Home',item:`${site}/`},
  {'@type':'ListItem',position:2,name:parentName,item:`${site}${parentRoute}`},
  {'@type':'ListItem',position:3,name,item:`${site}${route}`}
]});
const serviceHref = slug => services.some(service => service.slug === slug) ? `/services/${slug}/` : `/${slug}/`;
const imageAlt = {
  'rodent-control-stations-960.webp':'Davis Pest Solutions branded rodent monitoring stations',
  'ej-preparing-equipment-960.webp':'EJ preparing pest control equipment',
  'ej-service-vehicle-960.webp':'Davis Pest Solutions service vehicle'
};
for (const service of services) {
  const route = `/services/${service.slug}/`;
  const title = `${service.name.replace(/^./, c => c.toUpperCase())} Auckland | Davis Pest Solutions`;
  const description = `${service.intro.slice(0, 148).replace(/\s+\S*$/, '')}…`;
  const related = service.related.map(slug => {
    const linked = services.find(item => item.slug === slug);
    return `<a href="${serviceHref(slug)}">${escape(linked?.name || slug.replaceAll('-', ' '))}<span aria-hidden="true"> ↗</span></a>`;
  }).join('');
  const entry = sightings.find(s => service.slug === s.slug);
  const entryNumber = number(sightings.indexOf(entry)+1);
  const workImage = `<img class="work-detail" src="/assets/images/client/${escape(service.image)}" alt="${escape(imageAlt[service.image] || 'Davis Pest Solutions service photograph')}" width="960" height="640" loading="lazy">`;
  const specimen = !entry ? workImage : `<figure class="specimen-plate"><div class="plate-rule mono"><span>Pest field guide</span><span>${entryNumber} / 07</span></div><img src="/assets/images/field/${entry.key}.webp" alt="Illustration of a ${entry.key}" width="440" height="440" fetchpriority="high"><figcaption><span>${entry.name}</span><span>Illustrated specimen</span></figcaption></figure>`;
  const habitat = !entry ? workImage : entry.key === 'rodent'
    ? `<figure class="model-plate" data-house-model><div class="model-drawing">${houseSection()}</div><figcaption>Roof space and eaves · Illustrative section</figcaption><fieldset hidden><legend>Explore the house section</legend><label>Viewing angle <input type="range" min="8" max="52" value="29" aria-label="Viewing angle in degrees"></label><label>Lift the roof <input type="range" min="0" max="100" value="100" aria-label="Roof separation"></label></fieldset></figure><script type="module" src="/assets/js/house-model.mjs"></script>`
    : `<figure class="habitat-view habitat-${entry.key}"><div class="habitat-frame"><div class="habitat-camera pin-${entry.key}">${sceneImage(entry.scene,{sizes:'(max-width: 760px) 100vw, 50vw'})}<span class="habitat-mark pin-${entry.key}" aria-hidden="true"></span>${entry.key==='ant'?'<svg class="ant-trail" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true"><path d="M21,45 C30,42 34,36 39,33 S49,27 53,27 S61,29 67,24"/></svg>':''}</div></div><figcaption>${entry.spot} · Illustrated habitat</figcaption>${entry.key==='ant'?'<button class="trail-control ink-link" type="button" aria-pressed="false" hidden>Trace the ant trail</button>':''}</figure>`;
  const body = `<section class="species-hero species-${entry?.key || service.slug}"><div class="story-width species-layout"><div><nav class="book-crumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services/">Services</a> / ${escape(service.name)}</nav><span class="chapter-label"><span>${entry ? 'Field guide '+entryNumber : 'Pest services'}</span> Auckland</span><h1>${escape(service.name)} <em>in Auckland.</em></h1><p>${escape(service.intro)}</p><div class="book-actions"><a class="story-button" href="/contact/#request-service">Request a Quote <span aria-hidden="true">↗</span></a><a class="ink-link" href="tel:0204732847">Call 02047-DAVIS</a></div></div>${specimen}</div></section>
  <section class="habitat-section"><div class="story-width habitat-grid">${habitat}<div><span class="chapter-label"><span>Property inspection</span></span><h2>${escape(entry?.spot || service.name)}<em>.</em></h2><p>${escape(service.assessment)}</p></div></div></section>
  <section class="section section--white"><div class="container editorial-grid"><div class="editorial-index"><span class="eyebrow">Understand the signs</span><h2>What to look for</h2></div><div class="editorial-body"><p>${escape(service.signs)}</p><p>If you are unsure what you are seeing, describe the signs in your request. Avoid handling a pest or suspected nest to identify it.</p></div></div></section>
  <section class="section premium-band"><div class="container editorial-grid"><div class="editorial-index"><span class="eyebrow">The Davis approach</span><h2>Assess first. Then plan.</h2>${workImage}</div><div class="editorial-body"><h3>Treatment and aftercare</h3><p>After discussing the findings, Davis recommends an approach suited to the pest, property and occupants. Treatment and follow-up needs are explained for the work agreed.</p><h3>Safety and preparation</h3><p>${escape(service.preparation)}</p></div></div></section>
  <section class="section section--white"><div class="container premium-columns"><div><span class="eyebrow">A useful answer</span><h2>${escape(service.faq)}</h2><p>${escape(service.answer)}</p></div><div><span class="eyebrow">Explore further</span><h2>Related pest services</h2><div class="link-stack">${related}</div><a class="text-link" href="/service-areas/">See Auckland service areas ↗</a></div></div></section>
  <section class="section"><div class="container cta"><div><span class="eyebrow">Tell us what you have noticed</span><h2>Get a practical next step.</h2><p>Share your suburb, property type and the signs you have seen. Davis can discuss availability and the right assessment.</p></div><a class="btn btn--orange" href="/contact/#request-service">Request a quote</a></div></section>`;
  const schema = [breadcrumb(service.name, 'Services', '/services/', route), {'@context':'https://schema.org','@type':'Service',name:service.name,serviceType:service.name,provider:{'@id':`${site}/#business`},areaServed:{'@type':'City',name:'Auckland'},url:`${site}${route}`}];
  const output = path.join(root, 'services', service.slug, 'index.html');
  fs.mkdirSync(path.dirname(output), {recursive:true}); fs.writeFileSync(output, shell(title, description, route, 'services', body, schema));
}
for (const location of publicLocations) {
  const route = `/pest-control/${location.slug}/`;
  const title = `Pest Control ${location.name} | Davis Pest Solutions`;
  const description = `${location.subheading}. ${location.intro}`.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  const nearby = location.nearby.map(suburb => `<li>${escape(suburb)}</li>`).join('');
  const body = `<section class="book-opening book-local"><div class="story-width book-grid"><div class="book-copy"><nav class="book-crumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/service-areas/">Areas we serve</a> / ${escape(location.name)}</nav><span class="chapter-label"><span>${escape(location.region)}</span> Auckland</span><h1>Pest Control in ${escape(location.name)} and Surrounding Suburbs</h1><p><strong>${escape(location.subheading)}</strong></p><p>${escape(location.intro)}</p><div class="book-actions"><a class="story-button" href="/contact/#request-service">Request a Quote <span aria-hidden="true">↗</span></a><a class="ink-link" href="tel:0204732847">Call Davis</a></div></div><figure class="book-photo"><img src="/assets/images/client/davis-vehicle-clean-960.webp" srcset="/assets/images/client/davis-vehicle-clean-640.webp 640w, /assets/images/client/davis-vehicle-clean-960.webp 960w, /assets/images/client/davis-vehicle-clean-1536.webp 1536w" sizes="(max-width:760px) 100vw, 45vw" alt="The Davis Pest Solutions service vehicle" width="960" height="640" fetchpriority="high"><figcaption><span>Pest control across Auckland</span><a href="/service-areas/#coverage-map">View coverage map ↗</a></figcaption></figure></div></section>
  <section class="section section--white"><div class="container editorial-grid"><div class="editorial-index"><span class="eyebrow">Local service</span><h2>Care for your property.</h2></div><div class="editorial-body"><p>${escape(location.local)}</p></div></div></section>
  <section class="section premium-band"><div class="container editorial-grid"><div class="editorial-index"><span class="eyebrow">What we treat</span><h2>Pest Control Services in ${escape(location.name)}</h2></div><div class="editorial-body"><p>${escape(location.services)}</p><a class="text-link" href="/services/">Explore pest control services <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section section--white location-nearby"><div class="container premium-columns"><div><span class="eyebrow">${escape(location.region)}</span><h2>Nearby Suburbs We Also Service</h2><p>Contact Davis to confirm availability at your address.</p></div><div><ul class="nearby-suburbs">${nearby}</ul><a class="text-link" href="/service-areas/">View All Auckland Service Areas <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="section"><div class="container cta"><div><span class="eyebrow">${escape(location.name)} enquiries</span><h2>Need Pest Control in ${escape(location.name)}?</h2><p>${escape(location.cta)}</p></div><a class="btn btn--orange" href="/contact/#request-service">Request a Quote</a></div></section>`;
  const output = path.join(root, 'pest-control', location.slug, 'index.html');
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output, shell(title, description, route, 'areas', body, breadcrumb(location.name, 'Areas we serve', '/service-areas/', route)));
}
const sitemapPaths = ['/', '/about/', '/residential-pest-control/', '/commercial-pest-control/', '/services/', '/service-areas/', '/faqs/', '/contact/', ...services.map(item=>`/services/${item.slug}/`), ...publicLocations.map(item=>`/pest-control/${item.slug}/`)];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(route=>`  <url><loc>${site}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built ${services.length} service pages and ${publicLocations.length} verified location pages.`);
