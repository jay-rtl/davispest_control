<?php
declare(strict_types=1);
require dirname(__DIR__) . '/reviews/lib.php';
review_headers();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); header('Allow: POST'); exit('Method not allowed'); }
review_same_origin();
review_check_token();
if (strlen((string)($_SERVER['CONTENT_LENGTH'] ?? '0')) > 5000) { http_response_code(413); exit('Request too large'); }
if (review_field('website', 100) !== '') { header('Location: /reviews/?submitted=1', true, 303); exit; }
$name = review_field('display_name', 80);
$message = review_field('message', 2000);
$service = review_field('service', 100);
$rating = filter_var($_POST['rating'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1,'max_range'=>5]]);
if (mb_strlen($name) < 2 || mb_strlen($message) < 20 || !$rating) {
    review_flash('error', 'Please add a display name, a 1–5 star rating and at least 20 characters about your experience.');
    header('Location: /reviews/#share-review', true, 303); exit;
}
try {
    $db = review_db();
    if (!review_rate_limit($db, 'submission', 3, 86400)) {
        review_flash('error', 'Too many review attempts from this connection. Please try again later.');
        header('Location: /reviews/#share-review', true, 303); exit;
    }
    $stmt = $db->prepare('INSERT INTO reviews(display_name,rating,service,message,status,source) VALUES(?,?,?,?,?,?)');
    $stmt->execute([$name, $rating, $service, $message, 'pending', 'customer']);
    review_flash('success', 'Thank you. Your review has been received and is awaiting moderation.');
    header('Location: /reviews/?submitted=1#share-review', true, 303); exit;
} catch (Throwable $error) {
    error_log('Review submission failed: ' . $error->getMessage());
    review_flash('error', 'The review form is temporarily unavailable. Please try again later.');
    header('Location: /reviews/#share-review', true, 303); exit;
}
