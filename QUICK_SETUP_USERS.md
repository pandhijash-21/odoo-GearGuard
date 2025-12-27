# Quick Setup: Add Users with Passwords

## Step 1: Add Password Column (if table already exists)

Run this SQL in phpMyAdmin:

```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
```

Or use the file: `add_password_field.sql`

---

## Step 2: Add Sample Users

Run this SQL in phpMyAdmin:

```sql
-- Sample Users - All passwords are: 'password'
INSERT INTO users (full_name, email, role, password_hash, is_active) VALUES
('Admin User', 'admin@test.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Manager One', 'manager@test.com', 'manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Technician One', 'tech@test.com', 'technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Employee One', 'employee@test.com', 'employee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);
```

Or use the file: `sample_users_with_passwords.sql`

---

## Login Credentials

**All users have password:** `password`

- **Admin:** admin@test.com / password
- **Manager:** manager@test.com / password
- **Technician:** tech@test.com / password
- **Employee:** employee@test.com / password

---

## To Create New Password Hash (PHP)

If you want to create users with different passwords, generate hash using PHP:

```php
<?php
echo password_hash('yourpassword', PASSWORD_BCRYPT);
?>
```

Or create a simple PHP file:
```php
// hash_password.php
<?php
$password = $_GET['p'] ?? 'password';
echo password_hash($password, PASSWORD_BCRYPT);
?>
```

Run: `php hash_password.php?p=yourpassword`

---

## Quick Fix for Existing Users

If you already have users without passwords:

```sql
-- Set default password 'password' for all users without password
UPDATE users 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE password_hash IS NULL;
```

---

**Done! Now you can login with email and password! 🎉**

