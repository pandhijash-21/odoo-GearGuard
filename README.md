# GearGuard - Maintenance Management System

A comprehensive maintenance tracking system built with React, PHP, and MySQL for managing equipment, maintenance requests, teams, and analytics.

## 🚀 Quick Start

### Prerequisites
- PHP 8.x
- MySQL/MariaDB (XAMPP recommended)
- Node.js 16+ and npm
- XAMPP (for MySQL on port 3307)

### Backend Setup

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

### Database Setup

1. Create database in phpMyAdmin:
   ```sql
   CREATE DATABASE gear_guard;
   ```

2. Import schema:
   ```sql
   -- Import gear_guard.sql file
   ```

3. Update database configuration in `backend/config/database.php`:
   - Port: 3307 (XAMPP default)
   - Username: root
   - Password: (empty by default)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:3000`

---

## 🔐 Authentication & Roles

### User Roles:
- **Admin**: Full access (equipment, teams, requests, calendar, reports, users)
- **Manager**: Manage requests, calendar, view teams, reports
- **Technician**: View and work on assigned requests, calendar
- **Employee**: Create and view own requests

### Default Login:
- Use any email/password from the database
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
│   │   ├── reports/     # Analytics & Reports
│   │   └── users/       # Users list
│   ├── config/          # Database config
│   └── utils/           # Helper functions
├── frontend/            # React application
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── services/    # API services
└── gear_guard.sql      # Database schema
```

---

## 🎯 Features

- ✅ Authentication system with role-based access control
- ✅ Protected routes and navigation
- ✅ Modern UI with Material-UI
- ✅ Kanban board with drag & drop for requests
- ✅ Dashboard with statistics
- ✅ Equipment management (CRUD)
- ✅ Teams management (CRUD)
- ✅ Maintenance requests (Create, View, Update status)
- ✅ Calendar view for preventive maintenance
- ✅ Reports & Analytics (By Team, Category, Priority)
- ✅ Responsive design

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login.php` - Login
- `POST /api/auth/verify.php` - Verify token

### Equipment (Admin)
- `GET /api/equipment/` - List all
- `GET /api/equipment/read.php?id={id}` - Get by ID
- `POST /api/equipment/` - Create
- `PUT /api/equipment/update.php?id={id}` - Update

### Requests
- `GET /api/requests/` - List (with filters: stage, equipment_id, team_id, assigned_to, created_by)
- `GET /api/requests/read.php?id={id}` - Get by ID
- `POST /api/requests/create.php` - Create
- `PUT /api/requests/update_stage.php` - Update stage

### Teams (Admin)
- `GET /api/teams/` - List all
- `GET /api/teams/members.php?team_id={id}` - Get team members
- `POST /api/teams/` - Create
- `PUT /api/teams/update.php?id={id}` - Update
- `DELETE /api/teams/delete.php?id={id}` - Delete

### Reports (Admin/Manager)
- `GET /api/reports/` - Get all reports (by team, category, priority, overall stats)

### Users (Admin)
- `GET /api/users/` - List all (filter by role)

---

## 🎨 Tech Stack

- **Frontend**: React.js, Material-UI, Recharts, FullCalendar.js, @dnd-kit
- **Backend**: PHP 8.x, PDO
- **Database**: MySQL/MariaDB
- **Server**: XAMPP or PHP Built-in Server

---

## 📝 Notes

- Make sure MySQL is running on port 3307 before starting!
- Backend CORS is configured for `http://localhost:3000`
- Token-based authentication (simplified for demo - use JWT in production)
- Password hashing using PHP's `password_hash()` and `password_verify()`

---

## 📄 License

This project is developed for hackathon purposes.
