# Davis cinematic homepage

## Audit and redesign plan

The deployed homepage rendered eight content sections and twelve links within the opening scene at 390, 768 and 1440 CSS pixels. The header repeated the hero quote action. The chapter menu, scroll cue and window hotspot competed for attention. On a phone, the pest photograph, numbered hotspots, selector and readout each asked for a separate decision. The reviews carousel interrupted the path from meeting EJ to requesting a quote. [Previous GitHub Pages preview](https://jay-rtl.github.io/davispest_control/)

The redesign plan grouped the homepage into five scenes with one purpose each. The drawing room lights in the opening photo guide the exterior-to-kitchen dissolve. Treatment and portrait photography then shift the story from the property to the people doing the work. Forest charcoal, warm cream and amber follow the existing Davis palette. Manrope, Instrument Serif and Inter continue the established typography. The creative references informed scale, pacing and discreet navigation. [Lusion](https://lusion.co/) · [Immersive Garden](https://immersive-g.com/) · [Active Theory](https://activetheory.net/)

- Replace the eight-section template and homepage-specific style rules in `scripts/property-story.mjs` and `assets/css/story-base.css`.
- Use the existing shell to render a native homepage menu and footer. Maintain services, locations, FAQs, About and Contact as distinct routes.
- Stage the exterior and interior transition in the existing GSAP and ScrollTrigger bundle. Connect one native pest selector to the kitchen and roof shots in `assets/js/property.js`.
- Keep a single client-supplied review excerpt with EJ. Render the six complete reviews as disclosure rows on About, and retain the legacy homepage review anchor.
- Regenerate the public HTML and GitHub Pages preview. Verify the same quote and metadata paths, all local image requests, responsive layouts, motion preferences and keyboard use.

## Implementation and design review

The five scenes show the home, pest activity, the treatment approach, EJ and the invitation to request a quote. The full-viewport opening gives the property the major share of the frame. The hero has one quote button and one downward navigation cue. The native pest selector changes a single environment and its service link. The treatment photo uses real Davis work, and EJ's portrait and testimonial share one quiet editorial spread. The closing scene returns to the opening property and shows the original phone and email.

The Auckland-style exterior, roof detail and three pest cutouts are original generated image assets. The kitchen, real treatment photograph and EJ portrait come from the existing project. The cutouts move across surfaces at approximate visual scale with contact shadows. Motion uses responsive WebP images, CSS transforms and a GSAP cross-dissolve. It uses no homepage WebGL or new runtime dependency. Reduced-motion visitors get the static exterior, kitchen and roof scenes and can still use the selector. The menu, quote buttons and service directory link work without JavaScript.

## Final audit

| Area | Status | Evidence |
| --- | --- | --- |
| Functionality | **PASS** | Five-scene contract, keyboard menu and Escape, three pest states and their service destinations, six full reviews on About, and quote navigation to the original ServiceM8 URL. |
| SEO | **PASS** | 20 canonical pages checked for titles, headings, metadata, structured data, sitemap entries and internal links. The deployable preview contains 24 noindex pages including auxiliary routes. |
| Responsive and visual | **PASS** | 160 route and viewport combinations in Edge 157, Firefox 159 and WebKit 27.2. Checked image loads, link fragments and horizontal overflow. Inspected the homepage at 390, 768 and 1440 pixels for photography crops, silhouette clarity, text, menu spacing, treatment layout and phone contact legibility. Also tested reflow at 320 pixels. |
| Accessibility | **PASS** | Forty site-owned axe scans at 390 and 1440 pixels reported zero violations for selected A and AA rules. Tested keyboard, menu dismissal, static fallback and reversing or disabling the camera transition. |
| Security and privacy | **PASS** | The prefixed homepage loaded same-origin assets, wrote no storage and contained no private files in the preview output. Route QA applied the repository CSP to local HTTPS. |
| Performance | **PASS** | Lighthouse 13.6 on Windows Chrome 157 measured mobile 98/100, 1.1 s LCP, 150 ms TBT and 0 CLS. Desktop measured 100/100, 0.3 s LCP, 0 ms TBT and 0 CLS. One local lab run per profile. |
| Code and regression | **PASS** | Built twice, compared generated HTML across 20 routes, ran project checks and verified the prefixed preview through to rodent control and Contact. |
| Release and independent checks | **NOT TESTED** | Production submission and delivery, physical devices, screen readers, vendor iframe conformance, and field Core Web Vitals. |

## Tests run

```powershell
npm.cmd run build
npm.cmd run check
node scripts/build-pages-preview.mjs
git -c core.safecrlf=false diff --check
php -S 127.0.0.1:8796 -t . preview-router.php
```

The Playwright and Lighthouse records are under `tmp/redesign-tools/`. The browser harnesses were `node tmp/redesign-tools/film-qa.cjs`, `node tmp/redesign-tools/film-preview-check.cjs`, `node tmp/redesign-tools/qa.cjs pages <engine>` for each browser engine, and `node tmp/redesign-tools/qa.cjs axe edge`. Lighthouse used its mobile default and `--preset=desktop` with `--only-categories=performance` on the local homepage.

## Readiness

**READY FOR REVIEW.** Review the local preview before publishing. ServiceM8 submissions and real-user performance remain unverified.

## Shared navigation and inner-page update

The official logo now sits directly on a white header across all 20 public routes. Desktop uses inline navigation. Mobile uses a labelled two-line menu with a close state. Three visible buttons replace the homepage pest dropdown, and the active pest is indicated visually and through its pressed state. The account of the first homepage implementation above records the original selector.

`assets/js/shell.js` and `assets/css/davis-cinema.css` share the revised header, footer, colour and typography across the public pages. About, coverage, residential and commercial pages use full-width photographic openings. The service directory uses a single editorial list. Pest pages use an illustrated field guide and provide in-page links for inspection, signs, and treatment. The suburb pages, About, and the property services also have links to their key sections. FAQ and Contact have shorter openings so readers can reach questions and booking sooner. The existing location, review and booking data supply the content.

The follow-up checks use `node tmp/redesign-tools/cinema-navigation-qa.cjs` on the local PHP preview and `node tmp/redesign-tools/cinema-prefix-qa.cjs` on the generated Pages output. The navigation journey covers 320, 390, 768 and 1440 CSS pixels. It tests keyboard menu opening and closing, each pest link and its active state, in-page navigation, the original ServiceM8 destination and no-JavaScript navigation. The desktop motion check verifies that the incoming image stays aligned under the new header and responds to reduced-motion settings.

| Follow-up audit | Status | Evidence |
| --- | --- | --- |
| Functionality and regression | **PASS** | Both preview builds passed the navigation journey. The site build and 20-route check passed. |
| SEO | **PASS** | Existing metadata, headings, canonicals, internal links and sitemap passed the project check. All 24 preview HTML pages retain noindex. |
| Responsive and visual | **PASS** | Edge, Firefox and WebKit together passed 160 route and viewport checks. Reviewed mobile and desktop navigation, pest controls, image crops, and the inner-page layouts. |
| Accessibility | **PASS** | The atlas caption contrast was corrected. The final automated scan reported zero violations across 40 site-owned route and viewport checks. |
| Security and privacy | **PASS** | Local route testing applied the repository CSP. A public preview inventory found no private paths or server-side files. |
| Performance | **PASS** desktop / **FAIL** mobile target | Local desktop Lighthouse recorded 0.9 s LCP. The mobile AVIF reduced the 704 px portrait from 95 KB to 57 KB. The latest mobile result was 96/100, 2.6 s LCP, 110 ms TBT and 0 CLS. |
| Production verification | **NOT TESTED** | Physical devices, screen readers, live request receipt and field performance. |

**READY FOR REVIEW.** Open the revised local preview to check the shared header, pest controls and secondary pages.

## Full-bleed opening and simplified inner pages

The preferred full-viewport homepage is restored. A single rounded Menu control sits over the image on every public page. The official logo appears in the footer. The compact menu includes a Home link and direct access to the existing quote form. The animated opening and the three visible pest choices remain in the homepage story.

Inner pages keep their original copy, sections and photography. Their openings now have a discreet breadcrumb, one primary action and more room for the headline. The extra section-link bars and repeat opening controls were removed.

- **PASS** — Build, static Pages generation, 20-route metadata and structure checks, repeat-build comparison and whitespace checks.
- **PASS** — 160 route and viewport renders in Edge, Firefox and WebKit. Visually reviewed the homepage, menu, Services, rodent page, About and Contact at phone, tablet and desktop widths.
- **PASS** — 40 automated accessibility scans with zero violations. The local and prefixed preview tests verified keyboard menu operation, the no-JavaScript fallback, all three pest choices, reduced motion, camera alignment and the original ServiceM8 destination.
- **PASS** — The generated preview inventory excludes private paths and server-side files.
- **PASS** — One local Lighthouse 13.6 run per profile scored 100/100. Mobile LCP was 1.1 s, TBT 80 ms and CLS 0. Desktop LCP was 0.3 s, TBT 0 ms and CLS 0.
- **NOT TESTED** — Physical devices, screen readers, live request receipt and field performance.

**READY FOR REVIEW.** The local preview is available at `http://127.0.0.1:8796/`.

## Reviews and footer

The About page now showcases one customer quote at a time, in oversized serif type with the reviewer's name and star rating visible. The controls stay in place as readers change reviews. A native disclosure contains every full original comment, including in the no-JavaScript layout. The shared footer uses the site's dark green palette and groups the original Davis logo, page links and contact information.

| Audit | Status | Evidence |
| --- | --- | --- |
| Functionality | **PASS** | All six reviews, forward and backward wrap, full review expansion, control position and the existing ServiceM8 quote destination passed in Playwright. |
| SEO and regression | **PASS** | `npm.cmd run build`, `npm.cmd run check`, `node scripts/build-pages-preview.mjs` and `git -c core.safecrlf=false diff --check` passed. A request to each of the 20 public routes returned its updated footer. |
| Responsive and visual | **PASS** | Tested at 320, 390, 768 and 1440 CSS pixels. Reviewed desktop and mobile captures for quote legibility, button placement, logo proportions, link alignment and contact wrapping. |
| Accessibility | **PASS** | Keyboard and no-JavaScript review checks passed. Targeted axe scans found zero violations in the reviews and footer at 390 and 1440 pixels. |
| Security and privacy | **PASS** | The preview inventory excluded private paths and server-side files. The layout uses existing local assets and links. |
| Performance | **PASS** | One local desktop Lighthouse 13.6 run of About scored 98/100, with 1.1 s LCP, 0 ms TBT and 0.025 CLS. |
| External verification | **NOT TESTED** | Physical devices, field performance, screen readers and live booking receipt. |

**READY FOR REVIEW.** The updated reviews and footer can be reviewed together at `http://127.0.0.1:8796/about/#customer-reviews`.

## Interior redesign and homepage preservation

The approved homepage remains the visual reference. A source comparison found its main markup identical outside the customer-review component. The existing closing scene continues to serve as the homepage’s final quote invitation. Interior pages share its forest green, peach and editorial typography. Services uses a large-image field guide with seven selectable pests, Auckland’s approved coverage map links to the five published suburbs, and About pairs the existing photos of EJ with a subtle scroll-linked portrait. The FAQs retain all eight original answers. Contact uses a Davis-branded introduction and preserves the ServiceM8 iframe exactly.

| Audit | Status | Evidence |
| --- | --- | --- |
| Functionality | **PASS** | Playwright exercised all seven pest selections and destination routes, five map pins and region controls, suburb search, all eight FAQs, both review carousels and their wraparound, the photo and certificate dialogs, and menu focus. The original full review wording and attributions remain available on About. |
| Functionality and external delivery | **PASS** / **NOT TESTED** | ServiceM8 loaded in Edge and WebKit, and its direct form URL returned HTTP 200. An empty submission attempt in Edge showed four invalid fields with non-GET traffic guarded. Live request receipt and spam filtering were not tested. |
| SEO | **PASS** | The static check covered 20 public routes, including titles, descriptions, canonical URLs, schema syntax, internal links and the sitemap. The generated 24-page GitHub Pages artifact retains noindex and working prefixed routes. |
| Responsive and visual | **PASS** | Edge rendered 20 routes at 320, 390, 768 and 1440 CSS pixels with no horizontal overflow, broken local images, missing links, or first-party errors. Desktop, tablet and phone screenshots of the edited pages and shared components were compared with the homepage. The first homepage viewport was pixel-identical at 390 and 1440 pixels under reduced motion. Key interactions were also exercised in Firefox and WebKit at 390 and 1440 pixels. |
| Accessibility | **PASS** | Forty axe WCAG 2.0–2.2 A/AA scans on the Davis document found no violations. Keyboard interaction, focus return, reduced motion and JavaScript-disabled access were checked in Playwright. Vendor-frame internals and screen readers were outside the scans. |
| Security and privacy | **PASS** / **NOT TESTED** | Local HTTPS served the project CSP with ServiceM8 allowlisted for the iframe. The referrer policy and direct fallback are intact. The Pages artifact excludes project internals, PHP endpoints and configuration. Vendor processing and retention were not audited. |
| Performance | **PASS** desktop lab / **FAIL** mobile lab LCP target / **NOT TESTED** field | Lighthouse 13.6 measured desktop About at 98/100 with 1.16 s LCP, 0 ms TBT and 0.032 CLS. Simulated mobile Services scored 94/100 with 2.94 s LCP, 71 ms TBT and CLS below 0.001 over the PHP preview. A separate local gzip-proxy run scored 84/100 with 4.33 s LCP, 0 ms TBT and 0.069 CLS. Both mobile runs exceeded the 2.5 s LCP target. The 960-pixel opening image is 38,907 bytes in AVIF, unused legacy CSS was removed, and GSAP loads after scrolling. Field CWV remains unmeasured. |
| Code and regression | **PASS** | Two builds produced byte-identical output across the 23 tracked HTML files. Exact comparisons also confirmed the eight FAQs, original ServiceM8 iframe and homepage main outside the customer-review component. |

**Tests run.** Windows and PowerShell, PHP local preview, local TLS/CSP proxy, Playwright and axe. Commands ran through `npm.cmd run build`, `npm.cmd run check`, `node scripts/build-pages-preview.mjs`, `git -c core.safecrlf=false diff --check`, `node tmp/redesign-tools/qa.cjs pages edge`, `node tmp/redesign-tools/qa.cjs axe edge`, and the browser checks in `tmp/redesign-tools/interior-qa.cjs` for Edge, Firefox and WebKit. Additional checks used `interior-prefix.cjs`, `interior-servicem8.cjs`, `home-preservation-qa.cjs` and `interior-final-motion.cjs` from the same directory. Lighthouse used `--only-categories=performance` with its default mobile profile on Services and `--preset=desktop` on About.

**Illustrative assets.** The built-in image generator produced seven 1536×1024, 3:2 field-guide close-ups. Optimized files are in `assets/images/pests/`. Prompts varied the subject and surface: a mahogany cockroach on a walnut kitchen plinth, a house mouse by roof timber, a worker ant on weathered wood, a housefly on a stone windowsill, a yellow-and-black wasp on grey timber, a flea in side profile over carpet fibre, and a brown house spider on dark timber. Each prompt requested warm sidelighting, evergreen and charcoal shadows, photographic detail, restrained framing and no wording or branding.

**READY FOR REVIEW.** Review Services and the other pages at `http://127.0.0.1:8796/services/`. Live publishing, physical-device checks, field Core Web Vitals and an authorized end-to-end booking receipt remain outstanding.

## Global typography

Cormorant Garamond sets the cinematic headlines, featured reviews and footer masthead. Manrope sets body copy, navigation, buttons and supporting labels. Display sizes follow the existing page compositions, with selective italic emphasis and more room for the letterforms. Both families are self-hosted as variable WOFF2 with Latin and Latin Extended subsets and bundled SIL Open Font Licenses.

| Audit | Status | Evidence |
| --- | --- | --- |
| Functionality | **PASS** | Playwright exercised the menu, pest gallery, map, FAQ disclosures, review carousels, dialogs, ServiceM8 frame and reduced-motion behaviour. |
| SEO | **PASS** | The 20-route site check passed. The original titles, meta descriptions and canonical links match the typography baseline. |
| Responsive and visual | **PASS** | Edge, Firefox and WebKit completed 108 typography render checks from 320 to 1920 CSS pixels. Screenshots were inspected at 390, 768 and 1440 pixels. Edge confirmed 36 rendered-font assignments across the hero, reviews, buttons, navigation and footer. |
| Accessibility | **PASS** | Forty automated axe scans found no violations in the Davis pages. Keyboard interactions and reduced motion were exercised. |
| Security and privacy | **PASS** | First-party font requests used the new local WOFF2 assets. Pages preview checks confirmed working prefixed routes and the existing public-only artifact. |
| Performance | **PASS** | Local Lighthouse 13.6 homepage runs scored 100/100 for both profiles. Mobile LCP was 1.21 s, TBT 51 ms and CLS 0. Desktop LCP was 0.34 s, TBT 0 ms and CLS 0. |
| Code and regression | **PASS** | All 23 tracked page bodies and the original tracked imagery and scripts matched the typography baseline. Rebuilding produced identical HTML. |
| External verification | **NOT TESTED** | Production delivery, real-user performance, physical devices and screen readers. |

**Tests run.** Windows and PowerShell, PHP preview with a local TLS/CSP proxy, Playwright and axe. Ran `npm.cmd run build`, `npm.cmd run check`, `node scripts/build-pages-preview.mjs`, `git -c core.safecrlf=false diff --check`, `node tmp/redesign-tools/qa.cjs pages edge`, `node tmp/redesign-tools/qa.cjs axe edge`, `node tmp/redesign-tools/interior-qa.cjs edge`, `node tmp/redesign-tools/interior-prefix.cjs` and `node tmp/redesign-tools/typography-qa.cjs <edge|firefox|webkit>`. Lighthouse used `--only-categories=performance` with the default mobile profile and `--preset=desktop` against the local homepage.

**READY FOR REVIEW.** The new type system is available at `http://127.0.0.1:8796/`.
