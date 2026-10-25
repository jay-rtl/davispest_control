import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages');
const base = `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'davispest_control'}`;
const previewOrigin = `https://${process.env.GITHUB_REPOSITORY?.split('/')[0] || 'jay-rtl'}.github.io${base}`;
const staticDirectories = [
  'about', 'commercial-pest-control', 'contact', 'faqs', 'intro',
  'pest-control', 'residential-pest-control', 'service-areas', 'services'
];
const rewrite = source => source
  .replace(/content="0;url=\//g, `content="0;url=${base}/`)
  .replace(/((?:href|src|action|poster)=["'])\/(?!\/)/g, `$1${base}/`)
  .replace(/(["'])\/(?!\/)(?=(?:assets|about|commercial-pest-control|contact|faqs|intro|pest-control|residential-pest-control|reviews|service-areas|services|api)\/|["'])/g, `$1${base}/`)
  .replace(/(,\s*)\/(assets\/)/g, `$1${base}/$2`)
  .replace(/(url\(\s*)\/(assets\/)/g, `$1${base}/$2`);

fs.rmSync(output, {recursive: true, force: true});
fs.mkdirSync(output, {recursive: true});
const copy = (relative, destination = relative) => {
  const sourcePath = path.join(root, relative);
  const destinationPath = path.join(output, destination);
  fs.mkdirSync(path.dirname(destinationPath), {recursive: true});
  if (fs.statSync(sourcePath).isDirectory()) {
    for (const entry of fs.readdirSync(sourcePath)) copy(path.join(relative, entry), path.join(destination, entry));
    return;
  }
  if (/\.(?:html|css|js)$/.test(sourcePath) && !relative.startsWith(`assets${path.sep}vendor${path.sep}`)) {
    let content = rewrite(fs.readFileSync(sourcePath, 'utf8'));
    if (destination.endsWith('.html')) {
      content = content.replace(/(<meta\s+(?:property="og:(?:url|image)"|name="twitter:image")\s+content=")https:\/\/davispestsol\.co\.nz(\/[^\"]*)(")/gi, `$1${previewOrigin}$2$3`);
    }
    if (destination.endsWith('.html')) {
      content = content.replace(/<meta name="robots"[^>]*>/i, '')
        .replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
    }
    fs.writeFileSync(destinationPath, content);
  } else fs.copyFileSync(sourcePath, destinationPath);
};

copy('index.html');
copy('404.html');
copy('assets');
for (const directory of staticDirectories) copy(directory);
const reviews = `<!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0;url=${base}/#customer-voices"><title>Customer Reviews | Davis Pest Solutions</title><link rel="canonical" href="${previewOrigin}/#customer-voices"></head><body><p>Reviews are now on the <a href="${base}/#customer-voices">homepage</a>.</p></body></html>`;
fs.mkdirSync(path.join(output, 'reviews'), {recursive: true});
fs.writeFileSync(path.join(output, 'reviews', 'index.html'), reviews);
// Crawlers need to fetch the page to read noindex and its social preview tags.
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n');
fs.writeFileSync(path.join(output, '.nojekyll'), '');

const htmlFiles = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
};
walk(output);
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('noindex, nofollow')) throw Error(`Preview indexing not disabled: ${file}`);
  if (/(?:href|src)="\/(?!davispest_control\/)/.test(content)) throw Error(`Root path remains: ${file}`);
  if (content.includes('content="https://davispestsol.co.nz/assets/images/client/davis2.png"')) throw Error(`Production social image URL remains in preview: ${file}`);
}
console.log(`Built ${htmlFiles.length} noindex static preview pages at ${base}/. PHP routes excluded.`);
