# Davis Pest Solutions website

The full website is a static frontend with a PHP review and moderation application. See [DEPLOYMENT.md](DEPLOYMENT.md) for the PHP hosting prerequisites and production deployment process.

## Local checks

```powershell
npm.cmd run build
npm.cmd run check
```

For the PHP local preview, run `scripts/start-local-preview.ps1` as described in `DEPLOYMENT.md`.

## GitHub Pages preview

Pushes to `main` build a static, `noindex` preview at `https://jay-rtl.github.io/davispest_control/`. The workflow runs the site build and checks before publishing `.pages/`. The Pages version uses a repository path prefix and replaces the PHP review route with a clear availability notice. It does not publish the admin, API, database, backups, or private configuration. GitHub Pages cannot execute the PHP review application.

The preview is for visual review. Production requires PHP hosting, a separately configured database, and the verification steps in `DEPLOYMENT.md`.
