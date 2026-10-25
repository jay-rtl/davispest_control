<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function google_reviews_setting(string $name): string {
    $value = getenv($name);
    if (is_string($value) && $value !== '') return $value;
    static $private = null;
    if ($private === null) {
        $root = dirname((string)($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)));
        $file = $root . '/davis-private/google-reviews-config.php';
        $private = is_file($file) ? require $file : [];
        if (!is_array($private)) $private = [];
    }
    return (string)($private[$name] ?? '');
}

function google_reviews_request(string $url, ?array $post = null, string $token = ''): array {
    if (!function_exists('curl_init')) throw new RuntimeException('cURL extension unavailable');
    $curl = curl_init($url);
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_HTTPHEADER => array_filter(['Accept: application/json', $token !== '' ? 'Authorization: Bearer ' . $token : '']),
    ];
    if ($post !== null) {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_POSTFIELDS] = http_build_query($post);
    }
    curl_setopt_array($curl, $options);
    $body = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if (!is_string($body) || $status < 200 || $status >= 300) throw new RuntimeException('Google API request failed');
    $json = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($json)) throw new RuntimeException('Invalid Google API response');
    return $json;
}

function google_reviews_live(): array {
    $clientId = google_reviews_setting('DAVIS_GOOGLE_CLIENT_ID');
    $clientSecret = google_reviews_setting('DAVIS_GOOGLE_CLIENT_SECRET');
    $refreshToken = google_reviews_setting('DAVIS_GOOGLE_REFRESH_TOKEN');
    $location = google_reviews_setting('DAVIS_GOOGLE_LOCATION');
    if ($clientId === '' || $clientSecret === '' || $refreshToken === '' || !preg_match('~^accounts/[0-9]+/locations/[0-9]+$~', $location)) {
        throw new RuntimeException('Google Business Profile integration not configured');
    }
    $auth = google_reviews_request('https://oauth2.googleapis.com/token', [
        'client_id' => $clientId, 'client_secret' => $clientSecret,
        'refresh_token' => $refreshToken, 'grant_type' => 'refresh_token',
    ]);
    $token = $auth['access_token'] ?? '';
    if (!is_string($token) || $token === '') throw new RuntimeException('Google token unavailable');
    $reviews = [];
    $pageToken = '';
    for ($page = 0; $page < 100; $page++) {
        $query = ['pageSize' => 50, 'orderBy' => 'updateTime desc'];
        if ($pageToken !== '') $query['pageToken'] = $pageToken;
        $data = google_reviews_request('https://mybusiness.googleapis.com/v4/' . $location . '/reviews?' . http_build_query($query), null, $token);
        foreach (($data['reviews'] ?? []) as $review) {
            if (!is_array($review)) continue;
            $rating = array_search($review['starRating'] ?? '', ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'], true);
            if ($rating === false) continue;
            $comment = trim((string)($review['comment'] ?? ''));
            if ($comment === '') continue;
            $reviews[] = [
                'rating' => $rating + 1,
                'comment' => $comment,
                'author' => !empty($review['reviewer']['isAnonymous']) ? 'Google reviewer' : trim((string)($review['reviewer']['displayName'] ?? 'Google reviewer')),
                'date' => (string)($review['createTime'] ?? ''),
            ];
        }
        $pageToken = (string)($data['nextPageToken'] ?? '');
        if ($pageToken === '') break;
    }
    if ($pageToken !== '') throw new RuntimeException('Review pagination incomplete');
    usort($reviews, static fn(array $a, array $b): int => strcmp($b['date'], $a['date']));
    return ['reviews' => array_slice($reviews, 0, 5), 'syncedAt' => gmdate(DATE_ATOM)];
}

$root = dirname((string)($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)));
$cacheFile = $root . '/davis-private/google-reviews-cache.json';
$cache = null;
if (is_file($cacheFile)) {
    $stored = json_decode((string)file_get_contents($cacheFile), true);
    if (is_array($stored) && isset($stored['reviews']) && is_array($stored['reviews'])) $cache = $stored;
}
if ($cache !== null && filemtime($cacheFile) > time() - 3600) {
    echo json_encode($cache, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
try {
    $result = google_reviews_live();
    if (is_dir(dirname($cacheFile)) && is_writable(dirname($cacheFile))) {
        $temp = tempnam(dirname($cacheFile), 'google-reviews-');
        if ($temp !== false) {
            file_put_contents($temp, json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
            @chmod($temp, 0600);
            rename($temp, $cacheFile);
        }
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log('Google reviews sync: ' . $error->getMessage());
    if ($cache !== null) {
        $cache['stale'] = true;
        echo json_encode($cache, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        http_response_code(503);
        echo '{"reviews":[],"status":"unavailable"}';
    }
}
