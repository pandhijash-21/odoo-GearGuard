# Troubleshooting: Login Failed / No Response

## 🔍 Quick Checks

### 1. Check if Backend is Accessible

Open in browser:
- `http://localhost/gear_guard/backend/test.php`
- Should show: `{"success":true,"message":"Backend is accessible!"}`

If this doesn't work:
- Backend path is wrong
- Apache isn't running
- Files aren't in the right location

---

### 2. Check API URL in Frontend

Open browser console and check:
- What URL is being called?
- Should be: `http://localhost/gear_guard/backend/api/auth/login.php`

**Fix:** Update `.env` file in `frontend/` folder:
```
REACT_APP_API_URL=http://localhost/gear_guard/backend
```

**Then restart React dev server** (Ctrl+C and `npm start` again)

---

### 3. Check CORS Headers

The "Provisional headers" warning often means CORS issue.

**Fix:** Make sure `backend/config/database.php` and `backend/api/auth/login.php` have CORS headers:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

### 4. Check Backend File Location

**For XAMPP:**
Backend should be at: `C:\xampp\htdocs\gear_guard\backend\`

**Check:**
- Is `login.php` at: `C:\xampp\htdocs\gear_guard\backend\api\auth\login.php`?
- If not, copy it there!

---

### 5. Check PHP Errors

Check Apache error log:
- `C:\xampp\apache\logs\error.log`

Or enable error display in PHP temporarily:
Add to top of `login.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

---

### 6. Test Login Endpoint Directly

Use Postman or curl:
```bash
curl -X POST http://localhost/gear_guard/backend/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'
```

Should return JSON response.

---

## 🚀 Quick Fix Steps

1. **Copy backend to htdocs** (if not already):
   ```powershell
   Copy-Item -Path backend -Destination C:\xampp\htdocs\gear_guard\backend -Recurse -Force
   ```

2. **Test backend**:
   - Open: `http://localhost/gear_guard/backend/test.php`
   - Should show JSON response

3. **Check .env file**:
   - File: `frontend/.env`
   - Should have: `REACT_APP_API_URL=http://localhost/gear_guard/backend`

4. **Restart React**:
   ```bash
   cd frontend
   npm start
   ```

5. **Check browser console** for actual error message

---

## 🔧 Alternative: Use PHP Built-in Server

If XAMPP path is problematic:

```powershell
cd backend
php -S localhost:8000
```

Then update `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

---

Let me know what error you see in browser console!

