# Disposable review storage lives outside the public project directory.
$previewDirectory = Join-Path $env:TEMP 'davis-preview-data'
New-Item -ItemType Directory -Path $previewDirectory -Force | Out-Null
$env:REVIEWS_DB_PATH = Join-Path $previewDirectory 'reviews.sqlite'
$env:REVIEWS_RATE_KEY = php -r 'echo bin2hex(random_bytes(32));'
$env:REVIEWS_ADMIN_HASH = php -r 'echo password_hash(bin2hex(random_bytes(24)), PASSWORD_DEFAULT);'
php scripts/migrate-reviews.php
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
php -S 127.0.0.1:8771 -t . preview-router.php
