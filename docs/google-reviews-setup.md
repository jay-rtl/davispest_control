# Google reviews on the homepage

The homepage requests `/api/google-reviews.php`. The server reads the verified Davis Pest Solutions Google Business Profile review feed, orders written reviews by creation date, and returns the newest five. A successful response is cached for one hour in `davis-private/google-reviews-cache.json` outside the public web root. If Google fails later, the last successful cache remains visible. Without a configured connection or cache, the homepage shows its direct Google profile link.

## Google access needed

1. The owner or manager of the verified Davis Pest Solutions Business Profile must authorize a Google Cloud project with approved Business Profile API access and the `https://www.googleapis.com/auth/business.manage` scope.
2. Create an OAuth client and obtain an offline refresh token through the owner's consent. Keep the client secret and refresh token out of this repository, messages, and browser code.
3. Find the Google Business Profile `accounts/{accountId}/locations/{locationId}` resource name for this exact location. The public Google Maps URL is not the API location ID.
4. Set these server environment variables, or put the same keys in `<parent of document root>/davis-private/google-reviews-config.php` as a PHP array: `DAVIS_GOOGLE_CLIENT_ID`, `DAVIS_GOOGLE_CLIENT_SECRET`, `DAVIS_GOOGLE_REFRESH_TOKEN`, `DAVIS_GOOGLE_LOCATION`.
5. Ensure PHP cURL is enabled and that the private directory exists and is writable by PHP. Restrict that directory to the application account. It must remain outside `public_html`.
6. Test `/api/google-reviews.php` on the PHP host. It should return up to five real reviews. Then test the homepage and compare their order to the Google profile. Keep Google API access and token rotation under the client's control.

Google Business Profile access can require approval. GitHub Pages is a static preview and cannot run the PHP sync. Production deployment of the endpoint and its credentials is a separate step.
