# Davis Pest Solutions — local redesign handoff

Date: 23 October 2026 (Asia/Taipei). Preview: `http://127.0.0.1:8771/`. This is a local PHP preview, not a production audit. Nothing was deployed or pushed.

## Implemented

- Reworked the homepage and shared interior pages around the approved Davis logo, authentic EJ/field photography, forest green, warm paper and Davis orange. Replaced the moving ticker and repetitive cards with a compact process strip, editorial service list and distinct photo-led sections. The homepage headline and interior page headings now fit tested widths without clipping.
- Kept the existing static HTML/PHP architecture, ServiceM8 quote iframe, contact paths, seven service pages and five mapped suburb pages. The first-visit 3–4 second logo reveal now lives on a separate white `/intro/` page. The homepage has no intro overlay. Skip, once-per-session and reduced-motion behavior remain.
- Kept the moderated reviews workflow and honest empty state. Added `scripts/start-local-preview.ps1` to initialize a disposable SQLite review database outside the web root so the local preview feed responds normally. Updated `DEPLOYMENT.md` with the preview command.
- Refined the 320–390px footer into a readable stacked layout with two-column navigation, shorter mobile phone display and clear space above the fixed contact bar. Changed the area directory links from boxed buttons into full-height text rows.
- Reworked “Areas we serve”: replaced the duplicate region cards with a larger, readable client-supplied map; used EJ's authentic service-vehicle photo in the hero; kept one numbered suburb directory and one address-confirmation path. The homepage area section now uses lighter text links and an uncropped map.
- Main design source: `assets/css/art-direction.css`; homepage content: `index.html`; dedicated intro: `intro/index.html`, `assets/css/intro.css`, `assets/js/intro.js`; generated page integration: `scripts/integrate-site.mjs`.

## Design review

The visual system uses restrained type, strong section rhythm and the client's own work imagery instead of decorative graphics or generic feature cards. Desktop hero copy and photography remain balanced at 1904/1440px. On mobile, the hero photo appears in the first viewport and the bottom contact actions remain reachable. The footer and area directory were inspected again at 320/390px after their refinement. Actual headless Edge screenshots were inspected; physical devices and other browser engines remain unverified.

## Audit matrix

| Category | Status | Evidence and limit |
|---|---|---|
| Functionality: local site | **PASS** | Browser QA covered five routes at 1440/768/390/320px, mobile menu keyboard/Escape behavior, separate first-visit `/intro/`, skip/automatic/session behavior, no-JS navigation and missing-GSAP fallback. The empty local review feed returned HTTP 200 after disposable DB setup. |
| Functionality: review lifecycle | **NOT TESTED** | Moderation lifecycle was tested in the earlier implementation, but was not rerun against this new disposable preview database. No review was submitted in this final pass. |
| Functionality: ServiceM8 submission | **NOT TESTED** | No external quote submission or confirmation was sent. |
| SEO: static pages | **PASS** | `npm.cmd run check` checked 20 pages for unique titles/descriptions/canonicals, H1s, parseable structured data, local link targets and sitemap entries. `/intro/` is marked noindex and excluded from the sitemap. |
| SEO: first-visit redirect and live indexing | **NOT TESTED** | The homepage's browser redirect to `/intro/` has not been validated with a search crawler. No production deployment, crawl or search-console review. Client must verify service and suburb claims. |
| Responsive/Visual | **PASS** | Headless Edge layout audit: 8 routes × 6 widths (1904, 1440, 1024, 768, 390, 320px), no horizontal overflow, heading clipping, JS page errors or failed route responses. First-visit intro, footer and area directory screenshots were visually inspected. |
| Accessibility: site-owned UI | **PASS** | Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA scan on 12 routes at 1440/390px returned no site-owned violations. Separate intro page passed an Axe scan at 390px; Skip and reduced-motion behavior passed. This is not WCAG certification. |
| Accessibility: ServiceM8 iframe | **FAIL** | Separate iframe scan found insufficient contrast in vendor controls and an unlabeled attachment input. Cross-origin iframe styling is outside this site's control. Direct phone/email alternatives remain visible on the contact page. |
| Accessibility: full manual review | **NOT TESTED** | Screen-reader, 200% zoom and physical-device checks were not completed. |
| Security/Privacy: local code | **PASS** | Earlier review workflow test covered CSRF rejection, pending isolation and protected admin views; source still uses server-side credentials, prepared SQL and output encoding. Local review DB is outside the web root. This does not certify production security. |
| Security/Privacy: production/legal | **NOT TESTED** | Hostinger database/private config, backups, retention decisions, privacy text and legal review require client/staging work. |
| Performance: current first-visit flow | **NOT TESTED** | The earlier homepage lab result (77 performance, 4.4 s LCP) predates the new separate intro route and must not be treated as a measurement of this flow. |
| Performance: field data | **NOT TESTED** | No deployed URL or real-user measurements. |
| Code/Regression | **PASS** | Build/check, JavaScript syntax, 8 PHP syntax checks, 5-route browser QA and 8-route layout audit passed after the redesign. |

## Tests run

- `npm.cmd run build` — 7 service and 5 location pages rebuilt; shared design integrated into 20 static pages.
- `npm.cmd run check` — 20-page metadata, heading, structured-data, link and sitemap checks passed.
- `node --check assets/js/motion.js` and `php -l` on 8 PHP files in `api`, `admin`, `reviews` and `scripts` — passed.
- `node tmp/layout-audit.cjs` — 8 routes × 6 widths passed.
- `node tmp/visual-qa.cjs` — 5 routes × 4 widths plus menu, intro and fallback checks passed. Headless Microsoft Edge with the existing Playwright installation.
- `node tmp/intro-qa.cjs` — separate white intro at 1440/390/320px; Skip, automatic handoff, session persistence, reduced-motion and 390px Axe checks passed.
- `node tmp/areas-redesign-qa.cjs` — map loaded, all five suburb links present, duplicate cards absent and no overflow at 1440/390/320px; section screenshots visually inspected.
- `node tmp/accessibility-qa.cjs` — 12 routes × 2 widths passed on site-owned content; vendor iframe excluded after its separate failed scan.
- The prior Lighthouse result in `tmp/qa/lighthouse-home-final.json` is a baseline from before the separate intro route and is not a current-flow result.
- `curl.exe http://127.0.0.1:8771/api/public-reviews.php` — HTTP 200, empty JSON array on the disposable local DB.

## Outstanding items and launch readiness

**BLOCKED for launch.** The ServiceM8 iframe's accessibility defects need vendor remediation or a client-approved alternative. The new first-visit redirect needs crawler and performance validation before launch. Confirm five suburb pages, service/credential claims, moderation/privacy/retention text and final design with the client. Before launch, configure private Hostinger MariaDB credentials, test quote delivery end to end, conduct staging/cross-browser/manual accessibility QA, and validate live SEO. The preview database and random credentials are local-only and must not be uploaded.

**Next action:** review `/intro/` and the homepage, then validate the first-visit redirect with a search crawler and mobile performance tooling before staging.
