<?php
declare(strict_types=1);

function review_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_name('davis_reviews');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Strict']);
    session_start();
}
function review_headers(bool $admin = false): void {
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: DENY');
    header('Cache-Control: no-store');
    if ($admin) {
        header('Content-Security-Policy: default-src \'self\'; img-src \'self\' data:; style-src \'self\'; form-action \'self\'; base-uri \'none\'; frame-ancestors \'none\'');
        header('X-Robots-Tag: noindex, nofollow, noarchive');
    }
}
function review_setting(string $name): string {
    $environment = getenv($name);
    if ($environment !== false && $environment !== '') return $environment;
    static $private = null;
    if ($private === null) {
        $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)) ?: dirname(__DIR__);
        $file = dirname($root) . '/davis-private/reviews-config.php';
        $private = is_file($file) ? require $file : [];
        if (!is_array($private)) $private = [];
    }
    return is_string($private[$name] ?? null) ? $private[$name] : '';
}
function review_db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = review_setting('REVIEWS_DSN');
    if ($dsn !== '') {
        if (!str_starts_with($dsn, 'mysql:')) throw new RuntimeException('Unsupported review database DSN.');
        $pdo = new PDO($dsn, review_setting('REVIEWS_DB_USER'), review_setting('REVIEWS_DB_PASSWORD'), [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES=>false]);
        return $pdo;
    }
    $file = review_setting('REVIEWS_DB_PATH');
    if (!$file || !is_dir(dirname($file)) || !is_writable(dirname($file))) throw new RuntimeException('Review storage is not configured.');
    $public = realpath($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__));
    $directory = realpath(dirname($file));
    if ($public && $directory && ($directory === $public || str_starts_with($directory, $public . DIRECTORY_SEPARATOR))) throw new RuntimeException('Review storage must be outside the web root.');
    $pdo = new PDO('sqlite:' . $file, null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $pdo->exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
    return $pdo;
}
function review_e(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function review_token(): string { review_session(); return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); }
function review_check_token(): void {
    review_session();
    $expected = (string)($_SESSION['csrf'] ?? '');
    $provided = $_POST['csrf'] ?? null;
    if ($expected === '' || !is_string($provided) || !hash_equals($expected, $provided)) { http_response_code(403); exit('Invalid request. Please reload the page.'); }
}
function review_same_origin(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;
    $parts = parse_url($origin);
    $host = strtolower((string)($parts['host'] ?? ''));
    $requestHost = strtolower(explode(':', (string)($_SERVER['HTTP_HOST'] ?? ''))[0]);
    if ($host === '' || !hash_equals($requestHost, $host)) { http_response_code(403); exit('Invalid request origin.'); }
}
function review_field(string $key, int $max): string {
    $raw = $_POST[$key] ?? '';
    if (!is_string($raw)) return '';
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $raw) ?? '');
    return mb_substr($value, 0, $max);
}
function review_fingerprint(): string {
    $key = review_setting('REVIEWS_RATE_KEY');
    if (!$key || strlen($key) < 32) throw new RuntimeException('Review rate limit key is not configured.');
    return hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $key);
}
function review_rate_limit(PDO $db, string $scope, int $limit, int $window): bool {
    $fingerprint = review_fingerprint();
    $cutoff = time() - $window;
    $db->prepare('DELETE FROM review_attempts WHERE created_at < ?')->execute([$cutoff]);
    $query = $db->prepare('SELECT COUNT(*) FROM review_attempts WHERE scope = ? AND fingerprint = ? AND created_at >= ?');
    $query->execute([$scope, $fingerprint, $cutoff]);
    if ((int)$query->fetchColumn() >= $limit) return false;
    $db->prepare('INSERT INTO review_attempts(scope, fingerprint, created_at) VALUES(?,?,?)')->execute([$scope, $fingerprint, time()]);
    return true;
}
function review_admin(): bool {
    review_session();
    $last = (int)($_SESSION['admin_seen'] ?? 0);
    if (empty($_SESSION['admin']) || time() - $last > 1800) { unset($_SESSION['admin'], $_SESSION['admin_seen']); return false; }
    $_SESSION['admin_seen'] = time();
    return true;
}
function review_flash(string $type, string $message): void { review_session(); $_SESSION['flash'] = ['type'=>$type, 'message'=>$message]; }
function review_take_flash(): ?array { review_session(); $flash = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return $flash; }
