# Davis redesign source inventory

## Public site and wording

On 20 November 2026, the production XML sitemap listed the following 20 canonical URLs. All returned HTTP 200. A read-only crawl parsed each HTML response and followed public same-origin page links. The pre-redesign checkout and production matched for canonical URLs and meta descriptions on every route. After whitespace normalization and excluding scripts and styles, text matched on 19 routes. On Contact, Cloudflare obscured the email address in the raw production HTML. The checkout contains the business address in clear text.

| Page group | Paths on davispestsol.co.nz |
| --- | --- |
| Business and conversion | `/`, `/about/`, `/faqs/`, `/contact/` |
| Property services | `/residential-pest-control/`, `/commercial-pest-control/` |
| Service directory | `/services/` |
| Pest services under `/services/` | `cockroach-control/`, `rodent-control/`, `ant-control/`, `fly-control/`, `wasp-control/`, `flea-treatment/`, `spider-control/` |
| Coverage directory | `/service-areas/` |
| Local pages under `/pest-control/` | `mount-eden/`, `glenfield/`, `henderson/`, `howick/`, `manukau/` |

The live `/reviews/` returned HTTP 301 to `/#customer-voices`. The former `/pest-control/papatoetoe/` returned a noindex HTML redirect with a Manukau canonical, a refresh and a visible link. The local Apache configuration already defines its permanent redirect. Papatoetoe, Manurewa and Papakura are included in the Manukau page. The direct `/intro/` route is marked noindex. [Production sitemap](https://davispestsol.co.nz/sitemap.xml)

The service JSON records the original signs, assessment, preparation advice, FAQ and related routes for each of the seven pests. The homepage also offers General Pest Control for homes, rentals and commercial properties, with a direct enquiry. `content/locations.json` records the approved coverage entries. [Service directory](https://davispestsol.co.nz/services/) · [Service areas](https://davispestsol.co.nz/service-areas/)

The home page covers its tagline, pest help, EJ, reasons to choose Davis, the five-step process, coverage, six Google reviews and quote contact. The About page attributes EJ’s practical background to both supplier-side experience and field work. It includes his Filipino background, the Tuatara meaning, accredited training, PMANZ industry membership and community involvement with Autism Dads Support Group New Zealand. Preserve the distinctions between these credentials and connections. [Home](https://davispestsol.co.nz/) · [About Davis](https://davispestsol.co.nz/about/)

## Reviews and contact

- `content/featured-google-reviews.json` is the source for the six published comments by arlene claudio, Ashnita Rai, Maria, Yoga dude, jhuanne marrie and Dawn Tan. It records the client screenshot source, verification date, full paragraphs, individual star ratings and original Google Maps destination. Each comment appeared on the live home page. This check did not independently establish a current Google aggregate or total.
- The quote anchors target `/contact/#request-service`. The embedded form and full-page fallback use the same ServiceM8 booking UUID. A direct public GET returned HTTP 200 and the title “Request a booking or quote”. No booking or enquiry was submitted. [Request a quote](https://davispestsol.co.nz/contact/#request-service) · [ServiceM8 form](https://book.servicem8.com/request_booking?uuid=401e1e64-ea0e-4858-8261-2403bd7af3bb)
- Published contact details include `tel:0204732847`, `ej@davispestsol.co.nz` and Mon–Sat, 9am–3pm. Preserve the existing WhatsApp message link ending in `UWW3VICS2VATD1` and Facebook profile `DavisPestSolutionsNZ`.

## Visual assets available before redesign

| Material | Repository source | Appropriate use |
| --- | --- | --- |
| Davis lockup and Tuatara | `assets/images/davis-logo.jpg`, `tuatara-client-symbol.png` | Keep the supplied lockup and proportions. Base brand colours in the site CSS are green #006b3c, dark green #063f2b and orange #f26300. |
| Real EJ photography | `assets/images/client/ej-portrait-*`, `contact-ej-clean-*`, `ej-vehicle-portrait-*`, `your-filo-pestie-*` | Biography, personal service and contact. Desktop and mobile sizes are available. |
| Work and vehicle photography | `ej-preparing-equipment-*`, `ej-service-vehicle-*`, `davis-vehicle-clean-*`, `davis-vehicle-detail-*`, `davis-brand-detail-*` in the client image directory | Professional context, equipment and details. Use descriptions that reflect the actual photograph. |
| Treatment and stations | `residential-treatment-*`, `commercial-treatment-*`, `rodent-control-stations-*` in the client image directory | Preserve authentic treatment and equipment views. |
| Credentials and community | `urban-pest-management-qualification.webp`, `protrain-logo.webp`, `pmanz-logo.webp`, `autism-dads-nz.webp` | Keep the privacy-safe qualification artwork and accompanying approved copy. |
| Coverage | `auckland-service-area-map-client-2026-08.jpg` | The client map indicates coverage. Local pages provide accessible text and address confirmation. |
| Pest imagery and property scenes | Existing service icon sheet in `assets/images/service-icons.svg` | No photographic pest macros, photographic interior set or navigable property model were found in the public assets. Supplementary environments can illustrate where activity occurs. Attribute actual people and jobs only to client photographs. |
| Fonts and motion | Local Manrope, Inter, GSAP and ScrollTrigger under `assets/` | Available without new remote runtime services. |

## Motion reference

The Lusion homepage was rendered in Edge at 1200 × 800. Its opening includes a large animated 3D composition, small persistent navigation, a direct contact action and an explicit scroll cue. Scrolling carries the visual field toward the next section. The transferable idea for Davis is to keep one property in view long enough for people to understand the setting, then direct attention to a particular point as the narrative advances. Davis’s real photography, orange and green identity, accessible service links and direct booking path provide the project’s own visual and interaction vocabulary. [Lusion](https://lusion.co/)
