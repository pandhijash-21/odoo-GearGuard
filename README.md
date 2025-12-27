# GearGuard - The Ultimate Maintenance Tracker

A comprehensive maintenance management system built with React, PHP, and MySQL for managing equipment, maintenance requests, teams, and analytics.

![GearGuard](https://img.shields.io/badge/GearGuard-Maintenance%20Tracker-667eea?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)
![PHP](https://img.shields.io/badge/PHP-8.x-purple?style=flat-square&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange?style=flat-square&logo=mysql)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Database Setup](#1-database-setup)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Features Overview](#features-overview)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

GearGuard is a full-stack maintenance management system designed to streamline equipment maintenance workflows. It provides role-based access control, real-time request tracking, team management, and comprehensive analytics.

### Key Highlights

- **Role-Based Access Control**: Admin, Manager, Technician, and Employee roles with distinct permissions
- **Kanban Board**: Visual drag-and-drop interface for managing maintenance requests
- **Calendar View**: Schedule and track preventive maintenance
- **Analytics Dashboard**: Reports by team, equipment category, and priority
- **User Management**: Admin can manage users and assign roles
- **Modern UI**: Built with Material-UI for a professional, responsive interface

---

## ✨ Features

### 🔐 Authentication & User Management
- User registration (signup) with password hashing
- Secure login with token-based authentication
- Role-based access control (Admin, Manager, Technician, Employee)
- Admin can view and update user roles
- Protected routes based on user permissions

### 📦 Equipment Management (Admin)
- Create, read, update equipment
- Equipment details with warranty information
- Assign equipment to departments and employees
- Link equipment to maintenance teams
- Track equipment status (active/scrapped)

### 👥 Team Management (Admin)
- Create and manage maintenance teams
- Add/remove team members
- View team details and member lists
- Assign teams to equipment

### 🎫 Maintenance Requests
- **Create Requests**: Employees can create maintenance requests
- **Kanban Board**: Visual board with drag-and-drop (New, In Progress, Repaired, Overdue)
- **Request Details**: View complete request information
- **Status Updates**: Technicians can update request status
- **Role-Based Filtering**:
  - Technicians see only assigned requests
  - Employees see only their created requests
  - Admin/Manager see all requests
- **Request Types**: Corrective (Breakdown) and Preventive (Routine Checkup)
- **Priority Levels**: Urgent, High, Medium, Low

### 📅 Calendar View
- Visual calendar for scheduled maintenance
- View preventive maintenance schedules
- Identify overdue requests
- Click events to view request details

### 📊 Reports & Analytics (Admin/Manager)
- **Overall Statistics**: Total requests, completed, in progress, overdue
- **By Team**: Requests distribution across maintenance teams
- **By Category**: Equipment category-wise analysis
- **By Priority**: Priority distribution with charts
- Interactive charts using Recharts
- Refreshable data

### 🎨 User Interface
- Modern Material-UI design
- Responsive layout (mobile, tablet, desktop)
- Gradient themes and glassmorphism effects
- Intuitive navigation
- Loading states and error handling

---

## 🛠 Tech Stack

### Frontend
- **React.js 18.2** - UI framework
- **Material-UI (MUI) 7.x** - Component library
- **React Router DOM 7.x** - Routing
- **Axios** - HTTP client
- **@dnd-kit** - Drag and drop for Kanban
- **FullCalendar.js** - Calendar component
- **Recharts** - Data visualization

### Backend
- **PHP 8.x** - Server-side language
- **PDO** - Database abstraction
- **MySQL/MariaDB** - Database (via XAMPP)

### Database
- **MySQL/MariaDB** - Relational database
- **Port**: 3307 (XAMPP default)

### Development Tools
- **XAMPP** - Local development server
- **Node.js & npm** - Frontend package management

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **XAMPP** (includes Apache, MySQL, PHP)
   - Download from: https://www.apachefriends.org/
   - Version: Latest (PHP 8.x recommended)

2. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Includes npm

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

4. **Code Editor** (VS Code recommended)

---

## 🚀 Installation & Setup

### 1. Database Setup

#### Step 1: Start XAMPP Services
1. Open **XAMPP Control Panel**
2. Start **Apache** (for PHP)
3. Start **MySQL** (for database)
   - Default port: **3307** (if you changed it, update `backend/config/database.php`)

#### Step 2: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click **"New"** in the left sidebar
3. Database name: `gear_guard`
4. Collation: `utf8mb4_general_ci`
5. Click **"Create"**

#### Step 3: Import Schema
1. In phpMyAdmin, select the `gear_guard` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select `gear_guard.sql` from the project root
5. Click **"Go"** at the bottom
6. Wait for "Import has been successfully finished" message

#### Step 4: Verify Database
- Check that tables are created:
  - `users`, `equipment`, `maintenance_teams`, `maintenance_requests`, `departments`, `request_stages`, etc.

### 2. Backend Setup

#### Option A: Using XAMPP (Recommended)

1. **Copy Backend to htdocs**:
   ```powershell
   # Windows PowerShell
   Copy-Item -Path "E:\GearGuard\backend" -Destination "C:\xampp\htdocs\gear_guard\backend" -Recurse -Force
   ```

   Or manually:
   - Copy the `backend` folder to `C:\xampp\htdocs\gear_guard\`
   - Final path: `C:\xampp\htdocs\gear_guard\backend\`

2. **Configure Database Connection**:
   - Edit `C:\xampp\htdocs\gear_guard\backend\config\database.php`
   - Verify settings:
     ```php
     $host = 'localhost';
     $port = 3307;  // XAMPP default MySQL port
     $dbname = 'gear_guard';
     $username = 'root';
     $password = '';  // Empty by default in XAMPP
     ```

3. **Access Backend**:
   - Backend URL: `http://localhost/gear_guard/backend/`
   - Test: `http://localhost/gear_guard/backend/test.php` (should show "Backend is working")

#### Option B: Using PHP Built-in Server

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Start PHP server**:
   ```bash
   php -S localhost:8000
   ```

3. **Access Backend**:
   - Backend URL: `http://localhost:8000`
   - Test: `http://localhost:8000/test.php`

### 3. Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages (React, Material-UI, etc.)

3. **Configure API URL** (if needed):
   - Edit `frontend/.env` (create if doesn't exist):
     ```
     REACT_APP_API_URL=http://localhost:8000
     ```
   - Or for XAMPP:
     ```
     REACT_APP_API_URL=http://localhost/gear_guard/backend
     ```

4. **Start Development Server**:
   ```bash
   npm start
   ```
   - Frontend will open at: `http://localhost:3000`
   - Browser should open automatically

---

## 🏃 Running the Application

### Quick Start Commands

1. **Start XAMPP**:
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Start Backend** (if using PHP built-in server):
   ```bash
   cd backend
   php -S localhost:8000
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Access Application**:
   - Open browser: `http://localhost:3000`
   - Login with credentials (see below)

---

## 🔑 Default Credentials

### For Testing

After importing `gear_guard.sql`, you can:

1. **Create a new account**:
   - Go to `/signup`
   - Register with any email/password
   - Default role: **Employee**

2. **Use existing users** (if sample data was imported):
   - Check the database `users` table for existing accounts
   - Passwords are hashed using `password_hash()`

### Sample Users (if you add them manually)

You can create users directly in the database:

```sql
-- Admin user
INSERT INTO users (full_name, email, password_hash, role, is_active) 
VALUES ('Admin User', 'admin@gearguard.com', '$2y$10$...', 'admin', 1);

-- Note: Generate password hash using PHP password_hash() function
```

**For quick testing**, you can temporarily modify `backend/api/auth/login.php` to accept any password, but **DO NOT** do this in production!

---

## 📁 Project Structure

```
GearGuard/
├── backend/                    # PHP Backend API
│   ├── api/                    # API Endpoints
│   │   ├── auth/              # Authentication
│   │   │   ├── login.php      # User login
│   │   │   ├── signup.php     # User registration
│   │   │   └── verify.php     # Token verification
│   │   ├── equipment/         # Equipment CRUD
│   │   ├── teams/             # Team management
│   │   ├── requests/          # Maintenance requests
│   │   ├── reports/           # Analytics & reports
│   │   └── users/             # User management
│   ├── config/
│   │   └── database.php       # Database configuration
│   └── utils/
│       ├── cors.php           # CORS handling
│       └── response.php       # Response helpers
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   ├── favicon.svg        # App icon
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Auth/         # Login, Signup
│   │   │   ├── Layout/       # Header, Layout
│   │   │   └── Requests/     # Kanban, Modals
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EquipmentPage.jsx
│   │   │   ├── TeamsPage.jsx
│   │   │   ├── RequestsPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── UsersPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── services/          # API services
│   │   │   ├── api.js        # Axios instance
│   │   │   ├── requestService.js
│   │   │   └── equipmentService.js
│   │   └── App.js            # Main app component
│   └── package.json          # Dependencies
│
├── gear_guard.sql            # Database schema
└── README.md                 # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login.php` - User login
- `POST /api/auth/signup.php` - User registration
- `POST /api/auth/verify.php` - Verify authentication token

### Equipment (Admin Only)
- `GET /api/equipment/` - List all equipment
- `GET /api/equipment/read.php?id={id}` - Get equipment by ID
- `POST /api/equipment/` - Create new equipment
- `PUT /api/equipment/update.php?id={id}` - Update equipment

### Teams (Admin Only)
- `GET /api/teams/` - List all teams
- `GET /api/teams/members.php?team_id={id}` - Get team members
- `POST /api/teams/` - Create team
- `PUT /api/teams/update.php?id={id}` - Update team
- `DELETE /api/teams/delete.php?id={id}` - Delete team
- `POST /api/teams/add-member.php` - Add member to team
- `POST /api/teams/remove-member.php` - Remove member from team

### Requests
- `GET /api/requests/` - List requests (with filters: stage, equipment_id, team_id)
- `GET /api/requests/read.php?id={id}` - Get request by ID
- `POST /api/requests/create.php` - Create new request
- `PUT /api/requests/update_stage.php` - Update request stage

### Reports (Admin/Manager Only)
- `GET /api/reports/` - Get all reports (by team, category, priority, overall stats)

### Users (Admin Only)
- `GET /api/users/` - List all users (filter by role: `?role=admin`)
- `PUT /api/users/update.php?id={id}` - Update user role

### Departments
- `GET /api/departments/` - List all departments

### Stages
- `GET /api/stages/` - List all request stages

---

## 👥 User Roles & Permissions

### 🔴 Admin
**Full system access**
- ✅ View and manage all equipment
- ✅ Create, edit, delete teams
- ✅ Manage team members
- ✅ View all maintenance requests
- ✅ View calendar
- ✅ Access reports and analytics
- ✅ Manage users and assign roles
- ✅ Create equipment

### 🟡 Manager
**Management access**
- ✅ View all maintenance requests
- ✅ View calendar
- ✅ Access reports and analytics
- ✅ View teams (read-only)
- ❌ Cannot manage equipment
- ❌ Cannot manage teams
- ❌ Cannot manage users

### 🔵 Technician
**Request handling**
- ✅ View assigned maintenance requests only
- ✅ Update request status
- ✅ View calendar
- ❌ Cannot create requests
- ❌ Cannot view reports
- ❌ Cannot manage equipment/teams

### 🟢 Employee
**Request creation**
- ✅ Create maintenance requests
- ✅ View own created requests only
- ❌ Cannot view calendar
- ❌ Cannot view reports
- ❌ Cannot manage anything

---

## 🎯 Features Overview

### 1. Dashboard
- **Statistics Cards**: Total equipment, active requests, teams, overdue items
- **Recent Requests**: Quick view of latest requests
- **Quick Actions**: Buttons to navigate to key features
- **Role-based content**: Different views for different roles

### 2. Equipment Management
- **Equipment List**: Grid view of all equipment
- **Equipment Details**: Full information including warranty, location, assigned team
- **Create/Edit**: Forms for adding and updating equipment
- **Related Requests**: View all maintenance requests for specific equipment

### 3. Team Management
- **Team Cards**: Visual representation of teams
- **Member Management**: Add/remove team members
- **Team Details**: View team information and members
- **Edit Teams**: Update team name and description

### 4. Maintenance Requests
- **Kanban Board**: Drag-and-drop interface with columns:
  - New
  - In Progress
  - Repaired
  - Overdue
- **Request Creation**: Form with equipment selection, priority, type
- **Request Details Modal**: View complete request information
- **Status Updates**: Technicians can move requests between stages
- **Auto-assignment**: Equipment selection auto-fills maintenance team

### 5. Calendar View
- **Monthly/Weekly/Daily Views**: FullCalendar integration
- **Scheduled Maintenance**: Shows preventive maintenance dates
- **Overdue Highlighting**: Red color for overdue requests
- **Event Click**: View request details from calendar

### 6. Reports & Analytics
- **Overall Statistics**: Total, completed, in progress, overdue counts
- **By Team**: Bar chart showing requests per team
- **By Category**: Equipment category analysis
- **By Priority**: Pie chart of priority distribution
- **Interactive Charts**: Hover for details, refreshable data
- **Summary Tables**: Quick reference tables

### 7. User Management (Admin)
- **User List**: Table of all users with roles
- **Role Management**: Update user roles via dialog
- **User Status**: View active/inactive status
- **Creation Date**: Track when users joined

### 8. Authentication
- **Login**: Secure authentication with password verification
- **Signup**: User registration with validation
- **Token-based Auth**: JWT-like token system
- **Protected Routes**: Role-based route protection
- **Persistent Sessions**: Login state persists on refresh

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Database connection failed"
- ✅ Check XAMPP MySQL is running
- ✅ Verify port in `database.php` (default: 3307)
- ✅ Check database name is `gear_guard`
- ✅ Verify username/password (default: root/empty)

**Problem**: "404 Not Found" on API calls
- ✅ Check backend URL in `frontend/.env`
- ✅ Verify backend is accessible: `http://localhost/gear_guard/backend/test.php`
- ✅ Check CORS headers in PHP files

**Problem**: "CORS error" in browser
- ✅ Verify CORS headers in `backend/config/database.php`
- ✅ Check `Access-Control-Allow-Origin` includes `http://localhost:3000`

### Frontend Issues

**Problem**: "npm install" fails
- ✅ Check Node.js version (v16+)
- ✅ Delete `node_modules` and `package-lock.json`, then retry
- ✅ Use `npm install --legacy-peer-deps` if needed

**Problem**: "Cannot connect to backend"
- ✅ Verify backend server is running
- ✅ Check `REACT_APP_API_URL` in `.env`
- ✅ Check browser console for exact error

**Problem**: "Login redirects immediately"
- ✅ Check token verification endpoint
- ✅ Verify user exists in database
- ✅ Check browser console for errors

### Database Issues

**Problem**: "Table doesn't exist"
- ✅ Verify `gear_guard.sql` was imported successfully
- ✅ Check database name matches in `database.php`
- ✅ Re-import SQL file if needed

**Problem**: "Access denied for user"
- ✅ Check MySQL username/password
- ✅ Verify user has permissions in phpMyAdmin

---

## 📝 Development Notes

### Adding New Features

1. **Backend API**:
   - Create endpoint in `backend/api/`
   - Add CORS headers
   - Use `sendSuccess()` and `sendError()` from `utils/response.php`

2. **Frontend Service**:
   - Add function in `frontend/src/services/`
   - Use `api` instance from `api.js`

3. **Frontend Component**:
   - Create component in `frontend/src/components/` or `pages/`
   - Add route in `App.js`
   - Update navigation if needed

### Code Style

- **PHP**: PSR-12 style, use PDO prepared statements
- **JavaScript**: ES6+, functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for hackathon/educational purposes.

---

## 👨‍💻 Authors

- **GearGuard Team** - Initial work

---

## 🙏 Acknowledgments

- Material-UI for the component library
- React team for the amazing framework
- FullCalendar.js for calendar functionality
- Recharts for data visualization

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the code comments
3. Check browser console and network tab for errors

---

## 🎉 Getting Started Checklist

- [ ] Install XAMPP and start Apache + MySQL
- [ ] Create `gear_guard` database in phpMyAdmin
- [ ] Import `gear_guard.sql` file
- [ ] Configure `backend/config/database.php` (port, credentials)
- [ ] Copy backend to XAMPP htdocs OR start PHP built-in server
- [ ] Install Node.js dependencies (`npm install` in frontend folder)
- [ ] Configure `frontend/.env` with backend URL
- [ ] Start frontend (`npm start`)
- [ ] Open `http://localhost:3000`
- [ ] Create account or login
- [ ] Start exploring! 🚀

---

**Happy Coding! ⚙️**
