import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const services = JSON.parse(fs.readFileSync(path.join(root,'content/services.json'),'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status==='published');
const pages = ['/', '/about/', '/residential-pest-control/', '/commercial-pest-control/', '/services/', '/service-areas/', '/faqs/', '/contact/', ...services.map(item=>`/services/${item.slug}/`), ...locations.map(item=>`/pest-control/${item.slug}/`)];
const errors=[]; const titles=new Map();
const socialImage='https://davispestsol.co.nz/assets/images/client/davis2.png';
const socialAsset=fs.readFileSync(path.join(root,'assets/images/client/davis2.png'));
if (socialAsset.toString('hex',0,8)!=='89504e470d0a1a0a' || socialAsset.readUInt32BE(16)!==1704 || socialAsset.readUInt32BE(20)!==923) errors.push('Social preview PNG dimensions do not match metadata');
for (const route of pages) {
  const file=path.join(root,route,'index.html');
  if (!fs.existsSync(file)) { errors.push(`Missing ${route}`); continue; }
  const html=fs.readFileSync(file,'utf8');
  const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description=html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
  const canonical=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const h1=(html.match(/<h1(?:\s[^>]*)?>/gi)||[]).length;
  if (!title || !description) errors.push(`Missing metadata: ${route}`);
  if (titles.has(title)) errors.push(`Duplicate title: ${route} and ${titles.get(title)}`);
  titles.set(title,route);
  if (canonical !== `https://davispestsol.co.nz${route}`) errors.push(`Canonical mismatch: ${route}`);
  if (h1 !== 1) errors.push(`Expected one H1 on ${route}; got ${h1}`);
  const metas=[...html.matchAll(/<meta\s+[^>]*>/gi)].map(match=>match[0]);
  const meta=(key,attribute='property')=>metas.filter(tag=>tag.includes(`${attribute}="${key}"`));
  if (meta('og:image').length!==1 || !meta('og:image')[0].includes(`content="${socialImage}"`)) errors.push(`Social image missing or duplicated: ${route}`);
  for (const [key,value] of [['og:image:type','image/png'],['og:image:width','1704'],['og:image:height','923']]) {
    if (meta(key).length!==1 || !meta(key)[0].includes(`content="${value}"`)) errors.push(`Incorrect ${key}: ${route}`);
  }
  if (meta('twitter:image','name').length!==1 || !meta('twitter:image','name')[0].includes(`content="${socialImage}"`)) errors.push(`Twitter image missing or duplicated: ${route}`);
  if (meta('og:url').length!==1 || !meta('og:url')[0].includes(`content="https://davispestsol.co.nz${route}"`)) errors.push(`Open Graph URL mismatch: ${route}`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch { errors.push(`Invalid structured data JSON: ${route}`); }
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    const href=match[1].split(/[?#]/)[0];
    if (!href || href === '/') continue;
    const target=path.join(root,href);
    if (!fs.existsSync(target)) errors.push(`Broken local URL ${href} in ${route}`);
  }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for (const route of pages) if (!sitemap.includes(`https://davispestsol.co.nz${route}</loc>`)) errors.push(`Missing sitemap URL: ${route}`);
for (const location of JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status!=='published')) {
  if (sitemap.includes(`/pest-control/${location.slug}/`)) errors.push(`Unpublished location in sitemap: ${location.slug}`);
}
const areasHtml=fs.readFileSync(path.join(root,'service-areas/index.html'),'utf8');
for (const location of locations) {
  const card=areasHtml.match(new RegExp(`<a class="location-card" href="/pest-control/${location.slug}/">([\\s\\S]*?)<\\/a>`))?.[1];
  if (!card || !location.directoryContext || !card.includes(location.directoryContext)) errors.push(`Missing linked suburb context: ${location.slug}`);
  const html=fs.readFileSync(path.join(root,'pest-control',location.slug,'index.html'),'utf8');
  for (const field of ['subheading','intro','local','services','cta']) {
    const encoded=String(location[field]).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    if (!html.includes(encoded)) errors.push(`Missing ${field} copy: ${location.slug}`);
  }
  for (const suburb of location.nearby) if (!html.includes(`<li>${suburb}</li>`)) errors.push(`Missing nearby suburb ${suburb}: ${location.slug}`);
  if (!html.includes(`Pest Control in ${location.name} and Surrounding Suburbs`)) errors.push(`Incorrect H1: ${location.slug}`);
  if (!html.includes('View All Auckland Service Areas')) errors.push(`Missing area return link: ${location.slug}`);
  const nearbyBlock=html.match(/<ul class="nearby-suburbs">([\s\S]*?)<\/ul>/)?.[1];
  if (!nearbyBlock || nearbyBlock.includes('<a ')) errors.push(`Nearby suburbs must be plain text: ${location.slug}`);
}
if (!areasHtml.includes('Pest Control Across Auckland.') || !areasHtml.includes("Don't see your suburb?")) errors.push('Missing revised area directory headings');
const oldPage=fs.readFileSync(path.join(root,'pest-control/papatoetoe/index.html'),'utf8');
if (!oldPage.includes('noindex') || !oldPage.includes('/pest-control/manukau/')) errors.push('Papatoetoe legacy route does not point to Manukau');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${pages.length} static pages: metadata, headings, structured data, local links, sitemap entries and linked suburb context.`);
