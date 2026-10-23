import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages');
const base = `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'davispest_control'}`;
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
    if (destination.replaceAll('\\', '/') === 'index.html') {
      content = content.replace(/<script src="[^\"]*\/assets\/js\/home-reviews\.js" defer><\/script>/, '');
      content = content.replaceAll('Read or leave a review', 'About customer reviews')
        .replaceAll('Share your experience', 'About customer reviews');
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
const reviews = `<!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Customer Reviews Preview | Davis Pest Solutions</title><link rel="stylesheet" href="${base}/assets/css/site.css"><link rel="stylesheet" href="${base}/assets/css/refined.css"><link rel="stylesheet" href="${base}/assets/css/premium.css"><link rel="stylesheet" href="${base}/assets/css/art-direction.css"></head><body data-page="reviews"><header data-header><nav class="noscript-nav" aria-label="Main navigation"><a href="${base}/">Home</a><a href="${base}/services/">Services</a><a href="${base}/contact/">Contact</a></nav></header><main id="main"><section class="page-hero"><div class="container"><span class="eyebrow">GitHub Pages preview</span><h1>Customer reviews</h1><p class="lead">Review submission and moderation are unavailable in this static preview. They require the site's PHP hosting and database.</p><a class="btn btn--orange" href="${base}/contact/#request-service">Contact Davis</a></div></section></main><div data-footer></div><script src="${base}/assets/js/shell.js" defer></script><script src="${base}/assets/js/site.js" defer></script></body></html>`;
fs.mkdirSync(path.join(output, 'reviews'), {recursive: true});
fs.writeFileSync(path.join(output, 'reviews', 'index.html'), reviews);
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
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
}
console.log(`Built ${htmlFiles.length} noindex static preview pages at ${base}/. PHP routes excluded.`);
