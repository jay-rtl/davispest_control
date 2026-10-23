$securePassword = Read-Host 'Enter a unique review admin password (16+ characters)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    if ($plainPassword.Length -lt 16) { throw 'Use at least 16 characters.' }
    $env:DAVIS_HASH_INPUT = $plainPassword
    php -r 'echo password_hash(getenv("DAVIS_HASH_INPUT"), PASSWORD_DEFAULT), PHP_EOL;'
} finally {
    Remove-Item Env:DAVIS_HASH_INPUT -ErrorAction SilentlyContinue
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $plainPassword = $null
}
