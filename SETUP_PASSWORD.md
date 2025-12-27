# Setup Password Authentication - Quick Guide

## ✅ What I Fixed

1. ✅ Added `password_hash` column to database schema
2. ✅ Updated login.php to properly verify passwords
3. ✅ Created SQL scripts to add password field and sample users

---

## 🚀 Quick Setup (2 Steps)

### Step 1: Add Password Column to Existing Table

Run this in phpMyAdmin:

```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
```

**OR** run the file: `add_password_field.sql`

---

### Step 2: Add Users with Passwords

Run this in phpMyAdmin:

```sql
-- All passwords are: 'password'
INSERT INTO users (full_name, email, role, password_hash, is_active) VALUES
('Admin User', 'admin@test.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Manager One', 'manager@test.com', 'manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Technician One', 'tech@test.com', 'technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Employee One', 'employee@test.com', 'employee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);
```

**OR** run the file: `sample_users_with_passwords.sql`

---

## 🔑 Login Credentials

**Password for ALL users:** `password`

- **Admin:** admin@test.com / password
- **Manager:** manager@test.com / password  
- **Technician:** tech@test.com / password
- **Employee:** employee@test.com / password

---

## ✨ How It Works Now

1. User enters email and password in login form
2. Backend checks password using `password_verify()` (secure bcrypt)
3. If password matches → Login successful
4. If password doesn't match → Error message

---

## 🔧 Update Existing Users

If you already have users, set their passwords:

```sql
-- Set password 'password' for all users
UPDATE users 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE password_hash IS NULL;
```

---

**Done! Password authentication is now working! 🎉**

