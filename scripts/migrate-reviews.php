<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__) . '/reviews/lib.php';
$db = review_db();
$driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
if ($driver === 'mysql') {
    $db->exec("CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        display_name VARCHAR(80) NOT NULL,
        rating TINYINT UNSIGNED NOT NULL,
        service VARCHAR(100) NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        source VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME NULL,
        moderated_at DATETIME NULL,
        INDEX idx_reviews_status_date (status, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $db->exec("CREATE TABLE IF NOT EXISTS review_attempts (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        scope VARCHAR(30) NOT NULL,
        fingerprint CHAR(64) NOT NULL,
        created_at BIGINT NOT NULL,
        INDEX idx_review_attempts (scope, fingerprint, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} else {
$db->exec("CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    service TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','rejected','hidden')),
    source TEXT NOT NULL DEFAULT 'customer' CHECK(source IN ('customer','manual')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    published_at TEXT,
    moderated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reviews_status_date ON reviews(status, created_at DESC);
CREATE TABLE IF NOT EXISTS review_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scope TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_review_attempts ON review_attempts(scope, fingerprint, created_at);");
}
echo "Review database ready using " . $driver . PHP_EOL;
