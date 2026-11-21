function renderShell(page, route) {
  const whatsappUrl = 'https://wa.me/message/UWW3VICS2VATD1';
  const items = [
    ['home', '/', 'Home'],
    ['services', '/services/', 'Services'], ['areas', '/service-areas/', 'Areas we serve'],
    ['about', '/about/', 'About'], ['faqs', '/faqs/', 'FAQs'], ['contact', '/contact/', 'Contact']
  ];
  const links = items.map(([id, url, label]) => `<a href="${url}"${page === id ? (route && route !== url ? ' aria-current="location"' : ' aria-current="page"') : ''}>${label}</a>`).join('');
  const quote = '<a class="site-quote" href="/contact/#request-service">Request a Quote <span aria-hidden="true">↗</span></a>';
  const header = `<a class="site-skip" href="#main">Skip to content</a>
    <div class="site-header-inner">
      <details class="site-menu">
        <summary><span class="menu-open-label">Menu</span><span class="menu-close-label">Close</span><span class="site-menu-icon" aria-hidden="true"></span></summary>
        <nav aria-label="Main navigation">${links}${quote}</nav>
      </details>
    </div>`;
  const existingQuote = page === 'home' || page === 'contact' || route?.startsWith('/pest-control/') || route?.startsWith('/services/') && route !== '/services/';
  const closing = existingQuote ? '' : `<section class="footer-invitation" aria-labelledby="footer-invitation-title">
    <div class="site-footer-inner">
      <h2 id="footer-invitation-title">Let's talk about <em>your space.</em></h2>
      ${quote}
    </div>
  </section>`;
  const footer = `${closing}<footer class="site-footer"><div class="site-footer-inner">
    <div class="footer-masthead">
      <a class="footer-wordmark" href="/" aria-label="Davis Pest Solutions home">Davis <em>Pest Solutions.</em></a>
      <p>Residential and commercial pest control across Auckland.</p>
    </div>
    <div class="footer-directory">
      <a class="footer-brandmark" href="/" aria-label="Davis Pest Solutions home"><img src="/assets/images/davis-logo-256.webp" width="256" height="188" loading="lazy" decoding="async" alt=""></a>
      <nav aria-label="Footer navigation" class="footer-navigation">
        <h2>Explore</h2>
        <div>${links}</div>
      </nav>
      <div class="footer-contact">
        <h2>Talk to Davis</h2>
        <address><a class="footer-phone" href="tel:0204732847">02047-DAVIS</a><a href="mailto:ej@davispestsol.co.nz">ej@davispestsol.co.nz</a></address>
      </div>
      <div class="footer-social"><h2>Find us</h2><a href="${whatsappUrl}">WhatsApp EJ <span aria-hidden="true">↗</span></a><a href="https://www.facebook.com/DavisPestSolutionsNZ">Facebook <span aria-hidden="true">↗</span></a></div>
    </div>
    <p class="site-copyright">&copy; <span data-year>${new Date().getFullYear()}</span> Davis Pest Solutions</p>
  </div></footer>`;
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
