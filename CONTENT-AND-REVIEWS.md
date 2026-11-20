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

The public site uses the original Davis lockup, client photographs and local fonts. The homepage and its eight chapters are generated from `scripts/property-story.mjs`. The build renders shared navigation, content and booking links into the HTML. The property illustrations, seven pest plates, accessible inspection controls and optional motion are documented in [the redesign direction](docs/redesign-direction.md). The homepage opens directly on the property. The standalone intro remains available at `/intro/`.

The six featured Google reviews come from `content/featured-google-reviews.json`. The production `/reviews/` URL redirects to `/#customer-voices`. Keep the Google comments separate from any historical website-review moderation records. See [the redesign audit](docs/redesign-audit.md) for the verified public flows.
