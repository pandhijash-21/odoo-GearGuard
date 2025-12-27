-- Sample Users for GearGuard
-- Run this in phpMyAdmin or your MySQL client

-- Insert sample users (passwords are not hashed - for demo only)
-- In production, use password_hash() in PHP

INSERT INTO users (full_name, email, role, is_active) VALUES
('Admin User', 'admin@gearguard.com', 'admin', 1),
('Manager One', 'manager@gearguard.com', 'manager', 1),
('Technician One', 'tech1@gearguard.com', 'technician', 1),
('Technician Two', 'tech2@gearguard.com', 'technician', 1),
('Employee One', 'employee@gearguard.com', 'employee', 1);

-- Note: For login to work, you'll need to either:
-- 1. Add password_hash column to users table, OR
-- 2. Modify login.php to skip password check for demo

-- To add password column (optional):
-- ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
-- UPDATE users SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@gearguard.com';
-- (Above hash is for password: 'password')

