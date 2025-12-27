# How to Start Backend Server

## Option 1: Using XAMPP (Recommended)

1. **Copy backend folder to htdocs:**
   ```powershell
   # From project root (E:\GearGuard)
   Copy-Item -Path backend -Destination C:\xampp\htdocs\gear_guard\backend -Recurse -Force
   ```

2. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

3. **Access Backend:**
   - Base URL: `http://localhost/gear_guard/backend`
   - Test: `http://localhost/gear_guard/backend/api/stages/`

---

## Option 2: PHP Built-in Server (Alternative)

```bash
cd backend
php -S localhost:8000
```

Then access: `http://localhost:8000/api/stages/`

---

## Quick Start Command (PowerShell)

```powershell
# Navigate to backend folder
cd backend

# Start PHP server
php -S localhost:8000
```

---

**Note:** Make sure MySQL is running on port 3307 before starting!

