import fs from 'node:fs';
import path from 'node:path';
import renderShell from '../assets/js/shell.js';
import {openingPreloads, renderHome, renderReviews} from './property-story.mjs';
import {renderAreaExplorer} from './area-explorer.mjs';
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
const featuredReviews = JSON.parse(fs.readFileSync(path.join(root,'content/featured-google-reviews.json'),'utf8'));
if (featuredReviews.reviews.length !== 6 || featuredReviews.reviews.some(item => !Number.isInteger(item.rating) || item.rating < 1 || item.rating > 5 || !item.author?.trim() || !Array.isArray(item.paragraphs) || !item.paragraphs.length || item.paragraphs.some(paragraph => !paragraph.trim()))) throw Error('Featured Google reviews need six attributed full comments');
const original = ['index.html','about/index.html','residential-pest-control/index.html','commercial-pest-control/index.html','services/index.html','service-areas/index.html','faqs/index.html','contact/index.html'];
const generated = [...services.map(item=>`services/${item.slug}/index.html`),...locations.map(item=>`pest-control/${item.slug}/index.html`)];
for (const name of [...original,...generated]) {
  const file = path.join(root,name);
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s*\/>/g,'').replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin\s*\/>/g,'').replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]+\/>/g,'');
  const page = html.match(/<body data-page="([^"]+)"/)?.[1] || 'home';
  const {header,footer} = renderShell(page,'/'+name.replace(/index\.html$/,''));
  html = html.replace(/<header data-header>[\s\S]*?<\/header>/,()=>`<header data-header>${header}</header>`);
  const footerPattern = html.includes('<!--footer-end-->') ? /<div data-footer>[\s\S]*?<!--footer-end-->/ : /<div data-footer>\s*(?:<footer class="fallback-footer">[\s\S]*?<\/footer>)?\s*<\/div>/;
  html = html.replace(footerPattern,()=>`<div data-footer>${footer}</div><!--footer-end-->`);
  html = html.replace(/<script src="\/assets\/js\/shell\.js[^"]*"[^>]*>\s*<\/script>/g,'');
  if (name !== 'index.html' && !html.includes('/assets/css/premium.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/premium.css"></head>');
  if (!['index.html', 'services/index.html'].includes(name) && !html.includes('/assets/css/art-direction.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/art-direction.css"></head>');
  html = html.replace(/<script src="\/assets\/vendor\/(?:gsap|ScrollTrigger)\.min\.js" defer><\/script>/g,'');
  if (name !== 'index.html') html = html.replace(/<script src="\/assets\/js\/motion\.js[^"]*" defer><\/script>/g,'');
  else if (!html.includes('/assets/js/motion.js')) html = html.replace('</body>','<script src="/assets/js/motion.js" defer></script></body>');
  html = html.replace(/\/assets\/js\/shell\.js(?:\?v=[^"']+)?/g, `/assets/js/shell.js?v=${versions.shell}`)
    .replace(/\/assets\/js\/site\.js(?:\?v=[^"']+)?/g, `/assets/js/site.js?v=${versions.site}`)
    .replace(/\/assets\/js\/motion\.js(?:\?v=[^"']+)?/g, `/assets/js/motion.js?v=${versions.motion}`)
    .replace(/\/assets\/css\/art-direction\.css(?:\?v=[^"']+)?/g, `/assets/css/art-direction.css?v=${versions.art}`);
  if (page === 'home') html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/property\.css[^"]*">/,'');
  else if (!html.includes('/assets/css/property.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/property.css"></head>');
  if (!html.includes('/assets/js/property.js')) html = html.replace('</body>','<script src="/assets/js/property.js" defer></script></body>');
  if (!html.includes('/assets/css/davis-cinema.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/davis-cinema.css"></head>');
  if (!html.includes('/assets/css/closing.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/closing.css"></head>');
  if (name !== 'index.html' && !html.includes('/assets/css/interior.css')) html = html.replace('</head>','<link rel="stylesheet" href="/assets/css/interior.css"></head>');
  if (['services/index.html', 'service-areas/index.html', 'about/index.html'].includes(name) && !html.includes('/assets/js/interior.js')) html = html.replace('</body>','<script src="/assets/js/interior.js" defer></script></body>');
  html = html.replace('<main id="main">','<main id="main" tabindex="-1">');
  if (generated.includes(name)) html = html.replace('<section class="section"><div class="container cta">','<section class="footer-invitation"><div class="container cta">');
  fs.writeFileSync(file,html);
}
const homePath = path.join(root,'index.html');
const home = fs.readFileSync(homePath,'utf8')
  .replace(/\r?\n\s*<link rel="preload" as="image"[^>]*>/g,'')
  .replace(/<meta name="viewport"[^>]*>/,tag=>tag+openingPreloads)
  .replace(/<main\b[\s\S]*?<\/main>/, () => renderHome(featuredReviews));
fs.writeFileSync(homePath,home);
const aboutPath = path.join(root,'about/index.html');
const about = fs.readFileSync(aboutPath,'utf8')
  .replace(/\s*<section\b[^>]+id="customer-reviews"[\s\S]*?<\/section>/g,'')
  .replace('</main>', () => `\n${renderReviews(featuredReviews)}\n</main>`);
fs.writeFileSync(aboutPath,about);
const areasPath = path.join(root, 'service-areas/index.html');
const areas = fs.readFileSync(areasPath,'utf8')
  .replace(/<section class="section area-coverage"[\s\S]*?<\/section>\s*/, '')
  .replace(/<section[^>]+id="suburb-directory"[\s\S]*?<\/section>/, () => renderAreaExplorer(locations));
fs.writeFileSync(areasPath, areas);
const notFound = path.join(root, '404.html');
const fallback = fs.readFileSync(notFound, 'utf8');
if (!fallback.includes('/assets/css/closing.css')) fs.writeFileSync(notFound, fallback.replace('</head>', '<link rel="stylesheet" href="/assets/css/closing.css"></head>'));
// Each deployed page must request the CSS/JS built with it. Hostinger and browsers
// can otherwise keep older files for a month while the HTML has already changed.
const typography = '<link rel="stylesheet" href="/assets/css/typography.css">';
const headline = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/CormorantGaramond-Regular-latin.woff2" crossorigin>';
const homeItalic = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/CormorantGaramond-Italic-latin.woff2" crossorigin>';
const bodyFont = '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/Manrope-variable-latin.woff2" crossorigin>';
for (const name of [...original, ...generated, 'intro/index.html', 'pest-control/papatoetoe/index.html', '404.html']) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<link rel="preload" as="font"[^>]*>/g, '')
    .replace(/<link rel="stylesheet" href="\/assets\/css\/typography\.css[^"]*">/g, '')
    .replace('</head>', () => `${headline}${name === 'index.html' ? homeItalic + bodyFont : ''}${typography}</head>`)
    .replace(
    /(?<=["'\s])\/assets\/(?:css|js|images(?:\/[a-zA-Z0-9_.-]+)*)\/[a-zA-Z0-9_.-]+\.(?:css|mjs|js|png|jpe?g|webp|svg|avif|gif)(?:\?v=[a-f0-9]+)?/g,
    asset => {
      const relative = asset.split('?')[0].slice(1);
      return `${asset.split('?')[0]}?v=${assetVersion(relative)}`;
    }
  );
  fs.writeFileSync(file, html);
}
console.log(`Integrated design and navigation into ${original.length+generated.length} pages.`);
