# Davis Pest Solutions: deployment and review setup

This project is an existing static site with a small PHP review application. The approved ServiceM8 quote flow and existing clean URLs remain in place. No production deployment is performed by the build.

## Local build and preview

Requirements: Node 20+, PHP 8.2+ with PDO and `mbstring`. The local review test uses `pdo_sqlite`; production should use Hostinger MariaDB with `pdo_mysql`.

```powershell
npm.cmd run build
npm.cmd run check
```

For a working local site preview with an empty, disposable review database outside the web root, run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-local-preview.ps1` and open `http://127.0.0.1:8771/`. The script uses a random throwaway admin password; use the explicit configuration below when testing review administration.

For a full local PHP preview, set `REVIEWS_DB_PATH` to a writable path **outside this project**, `REVIEWS_RATE_KEY` to a random value of at least 32 characters, and `REVIEWS_ADMIN_HASH` to a password hash. Then run:

```powershell
php scripts\migrate-reviews.php
php -S 127.0.0.1:8771 -t . preview-router.php
```

The older `node preview.cjs` serves static pages only. It cannot execute the review application or `/api/contact.php`.

## Production prerequisites

1. Confirm the client has approved the new design, service copy, five mapped suburb pages, review privacy text, moderation policy and retention period. Existing insurance, licence, safety and opening-hours claims also need client confirmation before launch.
2. Back up the live `public_html`, database and any current submission data. Retain a rollback copy separate from the new files.
3. In Hostinger, confirm PHP 8.2+ and `pdo_mysql` are enabled, create a **new MariaDB database**, and give the application database user access only to that database. Test this on a staging copy first.
4. Import `database/reviews-mariadb.sql` with phpMyAdmin, or run `php scripts/migrate-reviews.php` from a private deployment directory where PHP CLI and the configuration are available. Do not run a migration against production without a backup.
5. Create a `davis-private/reviews-config.php` directory beside `public_html`, outside the web root. PHP must be able to read it. Example below; replace every placeholder with a real value. Do not upload this file into `public_html` or commit it.

```php
<?php
return [
    'REVIEWS_DSN' => 'mysql:host=localhost;dbname=YOUR_DB;charset=utf8mb4',
    'REVIEWS_DB_USER' => 'YOUR_DB_USER',
    'REVIEWS_DB_PASSWORD' => 'YOUR_DB_PASSWORD',
    'REVIEWS_ADMIN_HASH' => 'PASTE_PASSWORD_HASH',
    'REVIEWS_RATE_KEY' => 'PASTE_RANDOM_64_HEX_CHARACTER_KEY',
];
```

The code also accepts the same keys as server environment variables, which override the private file. On Windows, `scripts/create-admin-hash.ps1` prompts for a 16+ character password without showing it. On a Unix terminal, `php scripts/create-admin-hash.php` hides input where `stty` is available. Generate a rate key with `php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'`. Store the admin password in the owner's password manager; the site stores only its hash. Rotate either secret by changing the private configuration, not frontend code.

## Upload set

Build locally first. Upload the public HTML page directories, `assets`, `api`, `reviews`, `admin`, `.htaccess`, `404.html`, `robots.txt` and `sitemap.xml` to `public_html`. **Do not upload** `.build`, `backup`, `tmp`, `source-assets`, `content`, `scripts`, `database`, `preview-router.php`, package files, old ZIP archives, or any private review database. The `.htaccess` also denies common private paths if one is accidentally copied, but excluding them from the upload is required.

Preserve existing live files until the scoped replacement is ready. Do not overwrite unrelated production data. The review database must remain outside `public_html` or in MariaDB and must not be replaced on later site deployments.

## After deployment

- Confirm HTTPS and the existing ServiceM8 quote request, including a real test request and confirmation. The embedded form may not load in every browser; test its fallback link too.
- Check `/`, `/services/`, each new service page, `/service-areas/`, the five suburb pages, `/reviews/`, `/contact/`, `/sitemap.xml` and a 404. Check from mobile as well as desktop.
- Submit a **clearly identified test review**, verify it stays pending, sign in at `/admin/reviews/`, approve it, verify it appears on `/reviews/` and the homepage, then hide or delete the test entry. Never seed fake public testimonials.
- Verify anonymous visitors cannot see or use admin functions. Check that `/reviews/lib.php`, private paths and any ZIP/database files are inaccessible.
- Check browser console, responsive layout, keyboard focus, reduced motion, network requests and server logs. Confirm the sitemap is submitted only after the new pages are live and approved.
- Keep the MariaDB database in routine backups; test restore in a non-production environment. Review access and the retention schedule with the client or legal adviser.

## Rollback

Restore the previous `public_html` copy and leave the review database backed up separately. If review submissions have begun, do not roll back by deleting the database. A code rollback may leave the review database unused until the review feature is re-released.
