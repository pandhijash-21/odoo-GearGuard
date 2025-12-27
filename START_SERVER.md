# How to Start Backend Server

## Quick Start Commands

### Option 1: XAMPP (Easiest)

1. **Copy backend folder:**
   ```powershell
   # From E:\GearGuard
   Copy-Item -Path backend -Destination C:\xampp\htdocs\gear_guard\backend -Recurse -Force
   ```

2. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Click "Start" for **Apache** and **MySQL**
   - Both should show green "Running"

3. **Test Backend:**
   - Open browser: `http://localhost/gear_guard/backend/api/stages/`
   - Should return JSON with stages

---

### Option 2: PHP Built-in Server

```powershell
cd backend
php -S localhost:8000
```

Then test: `http://localhost:8000/api/stages/`

**Note:** Update `.env` in frontend if using port 8000:
```
REACT_APP_API_URL=http://localhost:8000
```

---

## Verify Setup

1. ✅ MySQL running on port 3307
2. ✅ Database `gear_guard` exists
3. ✅ Backend accessible (test API endpoint)
4. ✅ Frontend running on port 3000
5. ✅ CORS configured correctly

---

## Common Issues

**Issue:** "Connection refused"
- **Fix:** Make sure Apache/MySQL are running in XAMPP

**Issue:** "Database connection failed"
- **Fix:** Check MySQL port is 3307, database name is `gear_guard`

**Issue:** CORS errors in browser
- **Fix:** Make sure backend CORS headers allow `http://localhost:3000`

---

**That's it! Backend should be ready! 🚀**

