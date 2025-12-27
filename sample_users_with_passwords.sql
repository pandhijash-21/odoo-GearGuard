-- Sample Users with Passwords for GearGuard
-- Run this in phpMyAdmin

-- First, make sure password_hash column exists (run add_password_field.sql first)

-- Delete existing demo users if any
DELETE FROM users WHERE email LIKE '%@test.com' OR email LIKE '%@gearguard.com';

-- Insert sample users with hashed passwords
-- All passwords are: 'password' (change as needed)
-- Password hash generated using: password_hash('password', PASSWORD_BCRYPT)

INSERT INTO users (full_name, email, role, password_hash, is_active) VALUES
('Admin User', 'admin@test.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Manager One', 'manager@test.com', 'manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Technician One', 'tech@test.com', 'technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Employee One', 'employee@test.com', 'employee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- All users have password: 'password'
-- To create new password hash, use PHP:
-- echo password_hash('yourpassword', PASSWORD_BCRYPT);

