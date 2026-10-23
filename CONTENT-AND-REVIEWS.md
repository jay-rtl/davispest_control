# Content and review operations

## Add or change a service page

Edit `content/services.json` using only a service Davis actually offers. Give it a unique lowercase hyphenated slug, useful signs, an accurate assessment description, treatment/preparation guidance, a real FAQ answer and an approved image filename. Run `npm.cmd run build` and `npm.cmd run check`, then review the generated `/services/{slug}/` page in the PHP preview. The build adds service pages to the sitemap; also link any new service from `/services/` and relevant existing pages. Do not imply a product, chemical, guarantee or treatment method that Davis has not confirmed.

## Add a town page

Edit `content/locations.json`. Start with `status: "draft"`. Include the slug, town, region, evidence of actual coverage, unique local introduction, useful pest information, FAQ, related published suburbs and contact context. The generator outputs and lists only `status: "published"` entries. Publish after coverage and copy are confirmed by Davis; run the build and check script and review the sitemap and internal links. The current five published local pages are supported by the client-supplied coverage map: Mount Eden, Glenfield, Henderson, Howick and Papatoetoe. The map verifies coverage, not local pest rates, pricing, guarantees or physical offices.

## Review moderation

Customers submit reviews at `/reviews/`. Required fields are a display name, 1–5 stars and a message; service information is optional. The application collects no email address. Submissions are server-validated, rate-limited, stored as **pending** and never automatically published. The public page and homepage feed query only `published` records.

The owner signs in at `/admin/reviews/` with the separately configured password. The dashboard can filter, search and sort submissions; approve, reject, hide, permanently delete with an explicit confirmation checkbox, or add a genuine, permissioned review as pending. When approving, confirm the wording is a real customer account, does not expose private details and is suitable to publish. Hidden or rejected reviews disappear from public display. Do not present these website reviews as Google Reviews.

The review database contains names, ratings, optional service names, messages and moderation timestamps. The application uses an HMAC of the requester IP only for short-lived rate limiting; raw IP addresses are not stored in its review tables. Admin access uses a password hash in server-only configuration and a 30-minute idle session timeout. Back up the database and restrict who can access it. The client must approve the retention/deletion schedule and privacy wording before deployment; this document is operational guidance, not legal advice.

## Design and motion system

`assets/css/premium.css` layers the Davis editorial design over the existing styles. It keeps the approved logo and client imagery, uses the existing green and orange palette with accessible UI contrast, wider editorial layouts and service rows, and switches to single-column compositions on phones. `assets/js/motion.js` uses the local GSAP 3.15.0 and ScrollTrigger files in `assets/vendor/` for section/image reveals and a first-visit, skippable logo introduction. Content remains visible when GSAP is missing, JavaScript is disabled or reduced motion is requested. No scroll hijacking or page-transition interception is used on the multi-page static site.
