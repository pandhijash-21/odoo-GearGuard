-- Add password field to users table
-- Run this in phpMyAdmin

ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;

-- Update existing users with default password 'password'
-- Passwords are hashed using bcrypt
UPDATE users SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE password_hash IS NULL;

-- This hash corresponds to password: 'password'
-- You can generate new hashes using PHP: password_hash('yourpassword', PASSWORD_BCRYPT)

