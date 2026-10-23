<?php
declare(strict_types=1);
require dirname(__DIR__, 2) . '/reviews/lib.php';
review_headers(true);
review_session();
$error = '';
$db = null;
try { $db = review_db(); } catch (Throwable $exception) { error_log('Review admin unavailable: ' . $exception->getMessage()); $error = 'Review storage is not configured.'; }
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    review_same_origin(); review_check_token();
    $action = review_field('action', 30);
    if ($action === 'logout') { $_SESSION = []; session_regenerate_id(true); header('Location: /admin/reviews/', true, 303); exit; }
    if ($action === 'login' && $db) {
        $hash = review_setting('REVIEWS_ADMIN_HASH');
        try {
            $allowed = review_rate_limit($db, 'login', 6, 900);
            $valid = $hash !== '' && password_verify((string)($_POST['password'] ?? ''), $hash);
            if ($allowed && $valid) {
                session_regenerate_id(true); $_SESSION['admin'] = true; $_SESSION['admin_seen'] = time();
                header('Location: /admin/reviews/', true, 303); exit;
            }
            $error = 'Sign-in failed. Check the password or try again later.';
        } catch (Throwable $exception) { error_log('Review login failed: ' . $exception->getMessage()); $error = 'Sign-in is temporarily unavailable.'; }
    } elseif (review_admin() && $db) {
        try {
            if ($action === 'add') {
                $name = review_field('display_name', 80); $message = review_field('message', 2000); $service = review_field('service', 100);
                $rating = filter_var($_POST['rating'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1,'max_range'=>5]]);
                if (mb_strlen($name) < 2 || mb_strlen($message) < 20 || !$rating || ($_POST['genuine'] ?? '') !== 'yes') throw new InvalidArgumentException('Add a genuine, permissioned review with all required fields.');
                $db->prepare("INSERT INTO reviews(display_name,rating,service,message,status,source) VALUES(?,?,?,?,'pending','manual')")->execute([$name,$rating,$service,$message]);
                review_flash('success', 'Genuine review saved as pending. Approve it separately to publish.');
            } else {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]);
                if (!$id) throw new InvalidArgumentException('Invalid review.');
                if ($action === 'approve') {
                    $db->prepare("UPDATE reviews SET status='published', published_at=CURRENT_TIMESTAMP, moderated_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?")->execute([$id]);
                    review_flash('success', 'Review published.');
                } elseif (in_array($action, ['reject','hide'], true)) {
                    $status = $action === 'reject' ? 'rejected' : 'hidden';
                    $db->prepare("UPDATE reviews SET status=?, published_at=NULL, moderated_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?")->execute([$status,$id]);
                    review_flash('success', 'Review updated.');
                } elseif ($action === 'delete' && ($_POST['confirm_delete'] ?? '') === 'yes') {
                    $db->prepare('DELETE FROM reviews WHERE id=?')->execute([$id]);
                    review_flash('success', 'Review deleted.');
                } else throw new InvalidArgumentException('Action not confirmed.');
            }
            header('Location: /admin/reviews/', true, 303); exit;
        } catch (Throwable $exception) { $error = $exception instanceof InvalidArgumentException ? $exception->getMessage() : 'The action could not be completed.'; error_log('Review moderation failed: ' . $exception->getMessage()); }
    }
}
$authed = review_admin();
$rows = []; $counts = [];
if ($authed && $db) {
    foreach ($db->query('SELECT status, COUNT(*) AS total FROM reviews GROUP BY status') as $item) $counts[$item['status']] = (int)$item['total'];
    $filter = (string)($_GET['status'] ?? 'all');
    if (!in_array($filter, ['all','pending','published','rejected','hidden'], true)) $filter = 'all';
    $search = trim((string)($_GET['q'] ?? ''));
    $sort = ($_GET['sort'] ?? '') === 'oldest' ? 'ASC' : 'DESC';
    $where = []; $params = [];
    if ($filter !== 'all') { $where[] = 'status = ?'; $params[] = $filter; }
    if ($search !== '') { $where[] = '(display_name LIKE ? OR message LIKE ? OR service LIKE ?)'; $needle = '%' . mb_substr($search,0,100) . '%'; array_push($params,$needle,$needle,$needle); }
    $sql = 'SELECT * FROM reviews' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at ' . $sort . ' LIMIT 100';
    $statement = $db->prepare($sql); $statement->execute($params); $rows = $statement->fetchAll();
}
$flash = review_take_flash();
?><!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Review management | Davis Pest Solutions</title><link rel="stylesheet" href="/assets/css/admin-reviews.css"></head><body><a class="skip" href="#main">Skip to main content</a><header class="admin-header"><a href="/" aria-label="Davis Pest Solutions home"><img src="/assets/images/davis-logo.jpg" width="160" height="118" alt="Davis Pest Solutions"></a><div><strong>Review management</strong><span>Private admin area</span></div><?php if ($authed): ?><form method="post"><input type="hidden" name="csrf" value="<?= review_e(review_token()) ?>"><button name="action" value="logout">Sign out</button></form><?php endif; ?></header><main id="main" class="admin-main">
<?php if ($flash): ?><p class="notice <?= review_e($flash['type']) ?>" role="status"><?= review_e($flash['message']) ?></p><?php endif; ?><?php if ($error): ?><p class="notice error" role="alert"><?= review_e($error) ?></p><?php endif; ?>
<?php if (!$authed): ?><section class="login-panel"><span class="eyebrow">Authorised access</span><h1>Sign in to manage reviews.</h1><p>Customer reviews remain pending until they are approved here.</p><form method="post"><input type="hidden" name="csrf" value="<?= review_e(review_token()) ?>"><label for="password">Admin password</label><input id="password" type="password" name="password" autocomplete="current-password" required><button name="action" value="login">Sign in</button></form></section>
<?php else: ?><div class="admin-title"><div><span class="eyebrow">Davis Pest Solutions</span><h1>Customer reviews</h1></div><a href="/reviews/">View public page ↗</a></div><div class="stats"><?php foreach (['pending','published','rejected','hidden'] as $status): ?><a href="?status=<?= $status ?>"><strong><?= $counts[$status] ?? 0 ?></strong><span><?= ucfirst($status) ?></span></a><?php endforeach; ?></div>
<form class="filters" method="get"><label>Status <select name="status"><?php foreach (['all','pending','published','rejected','hidden'] as $option): ?><option value="<?= $option ?>" <?= $filter === $option ? 'selected' : '' ?>><?= ucfirst($option) ?></option><?php endforeach; ?></select></label><label>Search <input name="q" value="<?= review_e($search) ?>" maxlength="100" placeholder="Name, service or message"></label><label>Sort <select name="sort"><option value="newest" <?= $sort === 'DESC' ? 'selected' : '' ?>>Newest first</option><option value="oldest" <?= $sort === 'ASC' ? 'selected' : '' ?>>Oldest first</option></select></label><button>Apply</button></form>
<section class="review-list" aria-label="Review results"><?php if (!$rows): ?><p class="empty">No reviews match these filters.</p><?php endif; ?><?php foreach ($rows as $row): ?><article class="admin-review"><div class="review-top"><div><span class="status status-<?= review_e($row['status']) ?>"><?= review_e(ucfirst($row['status'])) ?></span><span class="source"><?= $row['source'] === 'manual' ? 'Manual entry' : 'Customer submission' ?></span><h2><?= review_e($row['display_name']) ?></h2><p class="stars" aria-label="<?= (int)$row['rating'] ?> out of 5 stars"><?= str_repeat('★', (int)$row['rating']) ?></p><?php if ($row['service'] !== ''): ?><p><?= review_e($row['service']) ?></p><?php endif; ?></div><small><?= review_e($row['created_at']) ?> UTC</small></div><p class="message"><?= nl2br(review_e($row['message'])) ?></p><div class="review-actions"><form method="post"><input type="hidden" name="csrf" value="<?= review_e(review_token()) ?>"><input type="hidden" name="id" value="<?= (int)$row['id'] ?>"><button name="action" value="approve">Approve / publish</button><button name="action" value="reject">Reject</button><button name="action" value="hide">Hide</button></form><details><summary>Delete review…</summary><form method="post"><input type="hidden" name="csrf" value="<?= review_e(review_token()) ?>"><input type="hidden" name="id" value="<?= (int)$row['id'] ?>"><label><input type="checkbox" name="confirm_delete" value="yes" required> I confirm permanent deletion of this review.</label><button class="danger" name="action" value="delete">Delete permanently</button></form></details></div></article><?php endforeach; ?></section>
<section class="manual-panel"><span class="eyebrow">Manual addition</span><h2>Add a genuine customer testimonial</h2><p>Only enter a review you have permission to publish. New entries are saved as pending.</p><form method="post"><input type="hidden" name="csrf" value="<?= review_e(review_token()) ?>"><label>Customer display name <input name="display_name" required minlength="2" maxlength="80"></label><label>Rating <select name="rating" required><option value="">Choose</option><?php for ($i=1;$i<=5;$i++): ?><option value="<?= $i ?>"><?= $i ?> stars</option><?php endfor; ?></select></label><label>Service (optional) <input name="service" maxlength="100"></label><label class="wide">Review <textarea name="message" required minlength="20" maxlength="2000" rows="5"></textarea></label><label class="wide"><input type="checkbox" name="genuine" value="yes" required> I confirm this is a genuine customer review and Davis has permission to publish it.</label><button name="action" value="add">Save as pending</button></form></section>
<?php endif; ?></main></body></html>
