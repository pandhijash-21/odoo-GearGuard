# Start Backend with PHP Built-in Server

## 🚀 Quick Start

**Run this command in PowerShell:**

```powershell
cd backend
php -S localhost:8000
```

**That's it!** Backend will be running on `http://localhost:8000`

---

## ✅ Verify It's Working

Open in browser: `http://localhost:8000/test.php`

Should show:
```json
{"success":true,"message":"Backend is accessible!","timestamp":"..."}
```

---

## 📝 Notes

- **Port:** 8000 (can be changed if needed)
- **URL:** `http://localhost:8000`
- **Frontend:** Already configured to use `http://localhost:8000`
- **Keep terminal open:** Server runs until you press Ctrl+C

---

## 🔄 Alternative Port

If port 8000 is busy, use another port:

```powershell
php -S localhost:8080
```

Then update `frontend/src/services/api.js`:
```javascript
baseURL: 'http://localhost:8080'
```

---

**Backend is ready! Now try logging in! 🎉**

