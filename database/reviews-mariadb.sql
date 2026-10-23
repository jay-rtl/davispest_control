CREATE TABLE IF NOT EXISTS reviews (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  scope VARCHAR(30) NOT NULL,
  fingerprint CHAR(64) NOT NULL,
  created_at BIGINT NOT NULL,
  INDEX idx_review_attempts (scope, fingerprint, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
