# GearGuard - Maintenance Management System

## 🚀 Quick Start

### Backend Setup (PHP)

**Option 1: XAMPP (Recommended)**
```powershell
# Copy backend to htdocs
Copy-Item -Path backend -Destination C:\xampp\htdocs\gear_guard\backend -Recurse -Force

# Start XAMPP Control Panel
# Start Apache and MySQL
```

**Option 2: PHP Built-in Server**
```bash
cd backend
php -S localhost:8000
```

Backend URL: `http://localhost/gear_guard/backend` (XAMPP) or `http://localhost:8000` (PHP server)

### Frontend Setup (React)
```bash
cd frontend
npm start
```

Frontend URL: `http://localhost:3000`

---

## 🔐 Authentication & Roles

### User Roles:
- **Admin**: Full access (equipment, teams, requests, calendar, users)
- **Manager**: Manage requests, calendar, view teams
- **Technician**: View and work on assigned requests, calendar
- **Employee**: Limited access (create requests only)

### Default Login (for development):
- Any email/password works (no password checking yet)
- Users must exist in database with roles: `admin`, `manager`, `technician`, `employee`

---

## 📁 Project Structure

```
GearGuard/
├── backend/              # PHP REST API
│   ├── api/
│   │   ├── auth/        # Login, verify
│   │   ├── equipment/   # Equipment CRUD
│   │   ├── teams/       # Teams CRUD
│   │   ├── requests/    # Requests CRUD
│   │   └── users/       # Users list
│   ├── config/          # Database config
│   └── utils/           # Helper functions
├── frontend/            # React application
│   └── src/
│       ├── components/
│       │   ├── Auth/    # Login component
│       │   ├── Layout/  # Header, Layout
│       │   └── Requests/# Kanban board
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── services/    # API services
└── gear_guard_mysql_schema.sql
```

---

## 🎯 Features Implemented

- ✅ Authentication system (login/logout)
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Modern UI with Material-UI
- ✅ Kanban board with drag & drop
- ✅ Dashboard with statistics
- ✅ Responsive design
- ⏳ Equipment management (admin only)
- ⏳ Teams management (admin only)
- ⏳ Calendar view
- ⏳ Request forms

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login.php` - Login
- `POST /api/auth/verify.php` - Verify token

### Equipment (Admin)
- `GET /api/equipment/` - List all
- `GET /api/equipment/read.php?id={id}` - Get by ID
- `POST /api/equipment/` - Create

### Requests
- `GET /api/requests/` - List (with filters: stage, equipment_id, team_id)
- `POST /api/requests/create.php` - Create
- `PUT /api/requests/update_stage.php` - Update stage

### Teams (Admin)
- `GET /api/teams/` - List all
- `POST /api/teams/` - Create

### Users (Admin)
- `GET /api/users/` - List all (filter by role)

---

## 🎨 UI Improvements

- Modern Material-UI design
- Clean, professional interface
- Role-based navigation
- Improved Kanban board with better cards
- Dashboard with statistics and quick actions
- Responsive layout
- Better color scheme and typography

---

## 📝 Next Steps

1. Add sample users to database
2. Complete Equipment CRUD pages
3. Complete Teams management
4. Add Calendar view
5. Add Request creation form
6. Add filters and search
7. Add user profile page

---

**Note:** Make sure MySQL is running on port 3307 before starting!
