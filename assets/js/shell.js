function renderShell(page, route) {
  const whatsappUrl = 'https://wa.me/message/UWW3VICS2VATD1';
  const items = [
    ['home', '/', 'Home'], ['about', '/about/', 'About'],
    ['services', '/services/', 'Services'], ['areas', '/service-areas/', 'Areas we serve'],
    ['faqs', '/faqs/', 'FAQs'], ['contact', '/contact/', 'Contact']
  ];
  const links = items.map(([id, url, label]) => `<a href="${url}"${page === id ? (route && route !== url ? ' aria-current="location"' : ' aria-current="page"') : ''}>${label}</a>`).join('');
  const header = `<a class="skip" href="#main" tabindex="0">Skip to content</a>
    <div class="nav-wrap"><nav class="nav" aria-label="Main navigation">
      <a class="brand" href="/" aria-label="Davis Pest Solutions home"><img width="256" height="188" src="/assets/images/davis-logo-256.webp" alt="Davis Pest Solutions — Done Right. Done Safely."><span class="brand-local" aria-hidden="true">Your Filo Pestie.</span></a>
      <div class="nav-links" id="primary-nav">${links}<div class="nav-menu-footer"><span>PEST CONTROL ACROSS AUCKLAND</span><a href="tel:0204732847">Call 02047-DAVIS ↗</a><a href="/contact/#request-service">Request a quote ↗</a></div></div>
      <div class="nav-actions"><a class="call-link" href="tel:0204732847"><strong>02047-DAVIS</strong></a>
        <a class="btn btn--orange" href="/contact/#request-service">Request a Quote <span aria-hidden="true">↗</span></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation"><span class="menu-toggle-label" aria-hidden="true">Menu</span><span class="menu-toggle-glyph" aria-hidden="true"><span></span><span></span></span></button>
      </div></nav></div><button class="nav-backdrop" type="button" aria-label="Close navigation" tabindex="-1"></button>`;
  const footer = `<footer class="footer"><div class="container"><div class="footer-grid">
    <div class="footer-brand"><img class="footer-logo" width="256" height="188" loading="lazy" src="/assets/images/davis-logo-256.webp" alt="Davis Pest Solutions"><div class="footer-brand-copy"><p><strong>Your Filo Pestie</strong><br>Done Right. Done Safely.</p><p>Residential • Commercial<br>Auckland-wide service</p></div></div>
    <div class="footer-links"><h3>Explore</h3>${links}<a href="/residential-pest-control/">Residential pest control</a><a href="/commercial-pest-control/">Commercial pest control</a></div>
    <div class="footer-secondary"><div class="footer-contact"><h3>Contact</h3><a href="tel:0204732847"><span class="footer-desktop-copy">02047-DAVIS | 02047-32847</span><span class="footer-mobile-copy">02047-DAVIS</span></a><a href="mailto:ej@davispestsol.co.nz">ej@davispestsol.co.nz</a><span class="footer-desktop-copy">Auckland, New Zealand</span><span class="footer-mobile-copy">Auckland, NZ</span><p class="footer-desktop-copy">Mon–Sat | 9am–3pm</p><p class="footer-mobile-copy">Mon–Sat · 9am–3pm</p></div><div class="footer-connect"><h3>Connect</h3><a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">WhatsApp EJ</a><a href="https://www.facebook.com/DavisPestSolutionsNZ" target="_blank" rel="noopener noreferrer">Facebook ↗</a><a class="btn btn--orange footer-cta" href="/contact/#request-service">Request a Quote</a></div></div>
    </div><div class="footer-bottom"><span>© <span data-year></span> Davis Pest Solutions. All rights reserved.</span><span>Professional pest control across Auckland.</span></div></div></footer>
    <div class="mobile-cta" aria-label="Quick contact"><a class="btn btn--green" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a><a class="btn btn--orange" href="/contact/#request-service">Request a Quote</a></div>`;
  return {header,footer,whatsappUrl};
}

if (typeof module !== 'undefined' && module.exports) module.exports = renderShell;
if (typeof document !== 'undefined') {
  const shell = renderShell(document.body.dataset.page || 'home');
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('[data-footer]');
  if (header) header.innerHTML = shell.header;
  if (footer) footer.innerHTML = shell.footer;
  for (const link of document.querySelectorAll('[data-whatsapp-link]')) {
    link.href=shell.whatsappUrl;
    link.target='_blank';
    link.rel='noopener noreferrer';
  }
}
