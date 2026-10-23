<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
fwrite(STDERR, "Enter a unique admin password (input hidden where supported): ");
if (PHP_OS_FAMILY !== 'Windows') shell_exec('stty -echo');
$password = trim((string)fgets(STDIN));
if (PHP_OS_FAMILY !== 'Windows') shell_exec('stty echo');
fwrite(STDERR, PHP_EOL);
if (strlen($password) < 16) { fwrite(STDERR, "Use at least 16 characters.\n"); exit(1); }
echo password_hash($password, PASSWORD_DEFAULT) . PHP_EOL;
