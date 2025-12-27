# GearGuard: React + PHP + MySQL Setup Guide

## 🚀 Tech Stack

- **Frontend:** React.js (with modern components)
- **Backend:** PHP (RESTful API)
- **Database:** MySQL (port 3307) ✅ Already set up
- **UI Library:** React components (Material-UI or Ant Design recommended)
- **State Management:** React Context API or Redux Toolkit
- **Routing:** React Router
- **HTTP Client:** Axios

---

## 📁 Project Structure (Hackathon Ready)

```
GearGuard/
│
├── backend/                          # PHP REST API
│   ├── config/
│   │   └── database.php             # Database connection
│   ├── api/
│   │   ├── equipment/
│   │   │   ├── index.php            # GET all, POST create
│   │   │   ├── read.php             # GET by ID
│   │   │   ├── update.php           # PUT update
│   │   │   └── delete.php           # DELETE
│   │   ├── teams/
│   │   │   ├── index.php
│   │   │   ├── read.php
│   │   │   ├── update.php
│   │   │   └── members.php          # Manage team members
│   │   └── requests/
│   │       ├── index.php            # GET all (with filters)
│   │       ├── read.php             # GET by ID
│   │       ├── create.php           # POST create
│   │       ├── update.php           # PUT update
│   │       ├── update_stage.php     # PUT update stage (for drag & drop)
│   │       ├── assign.php           # POST assign to user
│   │       └── calendar.php         # GET calendar events
│   ├── models/
│   │   ├── Equipment.php            # Equipment model class
│   │   ├── MaintenanceTeam.php      # Team model class
│   │   └── MaintenanceRequest.php   # Request model class
│   ├── utils/
│   │   ├── response.php             # JSON response helper
│   │   └── cors.php                 # CORS headers
│   └── .htaccess                    # Apache rewrite rules
│
├── frontend/                         # React Application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── Equipment/
│   │   │   │   ├── EquipmentList.jsx
│   │   │   │   ├── EquipmentCard.jsx
│   │   │   │   ├── EquipmentForm.jsx
│   │   │   │   └── EquipmentDetail.jsx
│   │   │   ├── Teams/
│   │   │   │   ├── TeamList.jsx
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   └── TeamForm.jsx
│   │   │   ├── Requests/
│   │   │   │   ├── KanbanBoard.jsx      # Main Kanban component
│   │   │   │   ├── KanbanColumn.jsx
│   │   │   │   ├── RequestCard.jsx
│   │   │   │   ├── RequestForm.jsx
│   │   │   │   ├── RequestDetail.jsx
│   │   │   │   └── CalendarView.jsx
│   │   │   └── Common/
│   │   │       ├── Loading.jsx
│   │   │       ├── ErrorMessage.jsx
│   │   │       └── Avatar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EquipmentPage.jsx
│   │   │   ├── TeamsPage.jsx
│   │   │   ├── RequestsPage.jsx        # Kanban board page
│   │   │   ├── CalendarPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance
│   │   │   ├── equipmentService.js
│   │   │   ├── teamService.js
│   │   │   └── requestService.js
│   │   ├── context/
│   │   │   └── AppContext.jsx          # Global state
│   │   ├── utils/
│   │   │   └── constants.js            # Constants (stages, types, etc.)
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env                            # Environment variables
│
├── gear_guard_mysql_schema.sql        # Database schema ✅
├── fix_trigger.sql                     # Database fix ✅
└── README.md
```

---

## 🔧 React Installation Commands

### Step 1: Install Node.js (if not installed)
Download from: https://nodejs.org/ (LTS version)

### Step 2: Create React App
```bash
# Navigate to your project directory
cd E:\GearGuard

# Create React app in frontend folder
npx create-react-app frontend

# Or if you want TypeScript (optional)
npx create-react-app frontend --template typescript
```

### Step 3: Install Required Packages
```bash
cd frontend

# Core dependencies
npm install axios react-router-dom

# UI Component Libraries (choose one):
# Option 1: Material-UI (MUI) - Recommended
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# Option 2: Ant Design
npm install antd @ant-design/icons

# Option 3: React Bootstrap
npm install react-bootstrap bootstrap

# For Drag & Drop (Kanban) - Use @dnd-kit (supports React 19)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# For Calendar
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid

# For Charts (Reports)
npm install recharts
# OR
npm install chart.js react-chartjs-2
```

### Step 4: Install Dev Dependencies (Optional)
```bash
npm install --save-dev prettier eslint
```

---

## 🎨 Recommended: Material-UI Setup

Material-UI gives you professional components quickly:

```bash
cd frontend
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

Then in your main file:
```javascript
// src/index.js
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

// Wrap your app
<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```

---

## 🗄️ Backend Setup (PHP)

### Step 1: Create Backend Structure
```bash
# In project root
mkdir backend
cd backend
mkdir -p config api/equipment api/teams api/requests models utils
```

### Step 2: Database Configuration
```php
// backend/config/database.php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$host = 'localhost';
$port = 3307;
$dbname = 'gear_guard';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}
?>
```

### Step 3: CORS Helper
```php
// backend/utils/cors.php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(200);
    exit();
}
?>
```

### Step 4: Response Helper
```php
// backend/utils/response.php
<?php
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}
?>
```

---

## 🔗 API Endpoints Structure

### Equipment API
```
GET    /api/equipment/          # List all equipment
POST   /api/equipment/          # Create equipment
GET    /api/equipment/{id}      # Get equipment by ID
PUT    /api/equipment/{id}      # Update equipment
DELETE /api/equipment/{id}      # Delete equipment
GET    /api/equipment/{id}/requests  # Get requests for equipment
```

### Maintenance Requests API
```
GET    /api/requests/           # List all requests (with filters)
POST   /api/requests/           # Create request
GET    /api/requests/{id}       # Get request by ID
PUT    /api/requests/{id}       # Update request
PUT    /api/requests/{id}/stage # Update stage (for drag & drop)
POST   /api/requests/{id}/assign # Assign to user
GET    /api/requests/calendar   # Get calendar events
```

### Teams API
```
GET    /api/teams/              # List all teams
POST   /api/teams/              # Create team
GET    /api/teams/{id}          # Get team by ID
PUT    /api/teams/{id}          # Update team
GET    /api/teams/{id}/members  # Get team members
POST   /api/teams/{id}/members  # Add member
DELETE /api/teams/{id}/members/{userId} # Remove member
```

---

## 🌐 Running the Application

### Backend (PHP)
```bash
# Option 1: Using XAMPP (Apache)
# Place backend folder in: C:\xampp\htdocs\gear_guard\backend
# Access: http://localhost/gear_guard/backend/api/equipment/

# Option 2: PHP Built-in Server
cd backend
php -S localhost:8000
# Access: http://localhost:8000/api/equipment/
```

### Frontend (React)
```bash
cd frontend
npm start
# Opens: http://localhost:3000
```

### Update React .env file
```bash
# frontend/.env
REACT_APP_API_URL=http://localhost/gear_guard/backend
# OR if using PHP server
REACT_APP_API_URL=http://localhost:8000
```

---

## 📝 Example API Implementation

### Example: Get All Equipment
```php
// backend/api/equipment/index.php
<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM equipment ORDER BY created_at DESC");
        $equipment = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(['data' => $equipment]);
    } catch (PDOException $e) {
        sendError('Failed to fetch equipment: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
```

### Example: React Service
```javascript
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// frontend/src/services/equipmentService.js
import api from './api';

export const getEquipment = () => api.get('/api/equipment/');
export const getEquipmentById = (id) => api.get(`/api/equipment/${id}`);
export const createEquipment = (data) => api.post('/api/equipment/', data);
export const updateEquipment = (id, data) => api.put(`/api/equipment/${id}`, data);
export const deleteEquipment = (id) => api.delete(`/api/equipment/${id}`);
```

### Example: React Component
```javascript
// frontend/src/components/Equipment/EquipmentList.jsx
import { useEffect, useState } from 'react';
import { getEquipment } from '../../services/equipmentService';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      setEquipment(response.data.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {equipment.map((item) => (
        <div key={item.equipment_id}>{item.equipment_name}</div>
      ))}
    </div>
  );
};

export default EquipmentList;
```

---

## 🎯 Key Features Implementation Notes

### 1. Kanban Board (Main Feature)
- Use `@dnd-kit/core` (supports React 19)
- Drag card between columns (stages)
- On drop, call API to update stage
- Show overdue indicator (red badge)
- Show assigned user avatar

### 2. Calendar View
- Use `@fullcalendar/react`
- Filter to show only Preventive requests
- Click date to create new request

### 3. Smart Button on Equipment
- Show request count badge
- Click opens filtered request list

### 4. Auto-Fill Logic
- When equipment selected in request form
- Fetch equipment details
- Auto-populate category and team fields

---

## ✅ Quick Start Checklist

- [ ] Install Node.js
- [ ] Create React app (`npx create-react-app frontend`)
- [ ] Install UI library (Material-UI recommended)
- [ ] Install drag & drop library
- [ ] Install calendar library
- [ ] Create backend folder structure
- [ ] Set up database connection
- [ ] Create first API endpoint (test connection)
- [ ] Set up React Router
- [ ] Create first React component
- [ ] Connect frontend to backend API

---

**You're all set! Start building! 🚀**

