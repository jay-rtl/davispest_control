<?php
declare(strict_types=1);
require dirname(__DIR__) . '/reviews/lib.php';
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
try {
    $rows = review_db()->query("SELECT display_name,rating,service,message FROM reviews WHERE status='published' ORDER BY published_at DESC, id DESC LIMIT 2")->fetchAll();
    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    error_log('Public reviews feed failed: ' . $error->getMessage());
    http_response_code(503);
    echo '[]';
}
