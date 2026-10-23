import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const services = JSON.parse(fs.readFileSync(path.join(root,'content/services.json'),'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status==='published');
const pages = ['/', '/about/', '/residential-pest-control/', '/commercial-pest-control/', '/services/', '/service-areas/', '/faqs/', '/contact/', ...services.map(item=>`/services/${item.slug}/`), ...locations.map(item=>`/pest-control/${item.slug}/`)];
const errors=[]; const titles=new Map();
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
for (const route of [...pages,'/reviews/']) if (!sitemap.includes(`https://davispestsol.co.nz${route}</loc>`)) errors.push(`Missing sitemap URL: ${route}`);
for (const location of JSON.parse(fs.readFileSync(path.join(root,'content/locations.json'),'utf8')).filter(item=>item.status!=='published')) {
  if (sitemap.includes(`/pest-control/${location.slug}/`)) errors.push(`Unpublished location in sitemap: ${location.slug}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${pages.length} static pages: unique titles, descriptions, canonicals, H1s, structured-data JSON, local URL targets and sitemap entries.`);
