# Davis Pest Solutions redesign audit

21 November 2026 · Local Windows build · **READY FOR REVIEW**

## Implemented

The redesign covers all 20 canonical routes from the production sitemap. The eight-chapter homepage, service directory, seven illustrated pest services, residential and commercial services, About, areas directory, five local pages, FAQs and quote flow are in the existing static site. The individual service pages retain the source assessment, preparation and aftercare text. The suburb finder recognises nearby places, including Papatoetoe under Manukau.

The build renders the header, footer, business copy, reviews and booking links into HTML. The homepage loads its optional camera effects on interaction. The rodent page renders its three-dimensional architectural section at build time and adds two sliders in the browser. The legacy review URL opens the homepage reviews. The standalone intro has a visible skip link. The homepage opens directly on the property.

The source areas are `scripts/property-story.mjs`, `scripts/build-pages.mjs`, `scripts/integrate-site.mjs`, the original public HTML pages and `assets/`. Production hosting, deployment workflows, credentials, review records and the ServiceM8 account were outside this local delivery.

## Design review

The dusk exterior, kitchen and pest specimens are original illustrative assets. EJ, vehicles, treatment work, credentials, Tuatara artwork and customer comments use the client's original material. The desktop opening pairs the lit kitchen window with a property-inspection link. The mobile opening uses a separate portrait crop and keeps the quote button above the chapter navigation. Visual review covered hero readability, logo proportions, real photo crops, type wrapping, menu size, specimen markers, review spacing and the cutaway controls. [Desktop capture](redesign-desktop.jpg) · [Mobile capture](redesign-mobile.jpg) · [Art direction and asset manifest](redesign-direction.md) · [Live source inventory](redesign-inventory.md)

## Audit matrix

| Area and scope | Status | Evidence |
| --- | --- | --- |
| Functionality, public routes and interactions | PASS | 20 canonical routes. Internal links and fragments resolved. Keyboard and touch-emulated tests exercised the menu, chapter navigation, seven pest choices, all six reviews, ant trail, both roof controls, suburb search, gallery, certificate and FAQs. Checked the review redirect, Papatoetoe fallback, intro skip and 404 home link. |
| Functionality, ServiceM8 handoff | PASS | Both quote links opened the original UUID. The actual vendor frame loaded with the title “Request a booking or quote” and seven non-hidden input, select or textarea elements. |
| Functionality, completed request and delivery to EJ | NOT TESTED | A production submission would create a live customer enquiry. No booking, email, phone call or WhatsApp message was sent. |
| SEO, pre-launch | PASS | All 20 canonical URLs, titles, descriptions, sitemap entries, primary headings, local content, structured-data JSON and social image metadata passed the project checks. The prefixed preview emitted 24 noindex pages including auxiliary routes. |
| Responsive and visual | PASS | 160 route and viewport combinations across Edge, Firefox and WebKit. All page images decoded. Horizontal overflow checks passed. Screen captures were inspected at 390, 768 and 1440 CSS pixels. Narrowest layout test was 320 pixels. |
| Accessibility, site-owned UI | PASS | 40 axe scans of the 20 routes at 390 and 1440 pixels returned zero violations for the selected A/AA rules. Keyboard focus, Escape, disclosure controls, reduced motion and no-JavaScript journeys passed. An enlarged-text check used a 640-pixel viewport at 200% root font size. |
| Accessibility, physical devices, screen readers and vendor form conformance | NOT TESTED | Browser emulation and axe covered the site-owned interface. The vendor iframe was excluded from axe. |
| Security and privacy, frontend scope | PASS | Browser QA applied the repository CSP on local HTTPS. The homepage and optional depth code requested only same-origin resources and left local and session storage empty in the preview test. The Pages output check found zero PHP, database, key, ZIP or private directory entries. Vendored GSAP and ScrollTrigger hashes matched the local package at version 3.15.0. The npm advisory endpoint returned no advisories for that version. |
| Security and privacy, ServiceM8 operations | NOT TESTED | The embed contacts ServiceM8 and its anti-abuse provider. Customer data enters the existing third-party form. Account access, retention, legal wording and vendor security were outside this frontend audit. Firefox logged a cancelled reCAPTCHA worker request when leaving the form during one run. |
| Performance, desktop homepage lab | PASS | Lighthouse 13.6.0 scored 99/100. LCP was 0.9 s, TBT 0 ms and CLS 0.002. |
| Performance, simulated mobile homepage LCP | FAIL | Three cold runs scored 92, 92 and 93. LCP was 2.9 s in each, above the 2.5 s reference. TBT was 180–190 ms and CLS was 0.001. The PHP preview served uncompressed local resources. |
| Performance, field Core Web Vitals | NOT TESTED | No production release or real-user measurement. Lighthouse TBT cannot establish field INP. |
| Code and regression | PASS | Build, 20-route project checks, preview generation and whitespace checks passed. Consecutive builds produced byte-identical HTML on all 20 routes. The prefixed preview loaded its animation modules, linked to the rodent page and operated the cutaway. |
| Rendering fallbacks | PASS | All three browser engines exercised homepage camera movement and reversal. A fine-pointer context activated the depth canvas and reduced motion removed it. With WebGL disabled, the exterior remained visible, the chapter jump worked and the wasp guide opened. The model and its explanatory text also worked without JavaScript. |

## Tests run

The production comparison used read-only requests to the Davis sitemap and public routes on 20 November. The final local checks used PHP 8.3.30, Edge 157, Playwright Firefox 159, Playwright WebKit 27.2 and headless Chrome 157 on Windows. Edge rendered 320, 390, 768 and 1440 CSS pixels. Firefox and WebKit rendered 390 and 1440. The interactive runs used both 390 and 1440. Browser input was automated. The screenshots were visually reviewed.

The build and preview commands ran from the repository root.

```powershell
npm.cmd run build
npm.cmd run check
node scripts/build-pages-preview.mjs
git -c core.safecrlf=false diff --check
php -S 127.0.0.1:8796 -t . preview-router.php
```

The local QA harness and raw reports are in the ignored directory `tmp/redesign-tools/`. Its TLS proxy applied the repository policy to the PHP preview. Test tools were installed there independently of the website.

```powershell
node tmp/redesign-tools/tls.cjs
# Run the following in a separate terminal while the two local servers are listening.
foreach ($engine in 'edge','firefox','webkit') {
  node tmp/redesign-tools/qa.cjs pages $engine
  node tmp/redesign-tools/qa.cjs flows $engine
}
node tmp/redesign-tools/qa.cjs axe edge
node tmp/redesign-tools/extras.cjs
node tmp/redesign-tools/preview-check.cjs
node tmp/redesign-tools/screens.cjs
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
foreach ($sample in 1..3) {
  tmp/redesign-tools/node_modules/.bin/lighthouse.cmd http://127.0.0.1:8796/ --only-categories=performance --chrome-flags="--headless --disable-extensions" --output=json "--output-path=tmp/redesign-tools/mobile-report-$sample.json" --quiet
}
tmp/redesign-tools/node_modules/.bin/lighthouse.cmd http://127.0.0.1:8796/ --preset=desktop --only-categories=performance --chrome-flags="--headless --disable-extensions" --output=json --output-path=tmp/redesign-tools/desktop-report.json --quiet
```

## Outstanding items, launch readiness and next action

**READY FOR REVIEW.** Review the opening and quote journey on a physical phone. Mobile LCP remains the measured performance gap. A staging measurement with the intended host's compression and caching would establish how that environment affects loading. Production booking receipt, screen-reader use and field Core Web Vitals remain unverified. The redesign is local and has not been deployed.
