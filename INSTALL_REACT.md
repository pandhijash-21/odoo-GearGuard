# React Installation Commands for GearGuard

## Quick Install Steps

### 1. Install Node.js (if not installed)
Download from: https://nodejs.org/
- Choose LTS version
- Run installer
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Create React App
```bash
cd E:\GearGuard
npx create-react-app frontend
```

### 3. Install Core Dependencies
```bash
cd frontend
npm install axios react-router-dom
```

### 4. Install Material-UI (Recommended for Hackathon)
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

### 5. Install Drag & Drop (for Kanban)
```bash
# Use @dnd-kit (supports React 19) instead of react-beautiful-dnd
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 6. Install Calendar Library
```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
```

### 7. Install Chart Library (for Reports)
```bash
npm install recharts
```

### 8. Start Development Server
```bash
npm start
```

---

## Alternative: All-in-One Install Command

```bash
cd frontend
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid recharts
```

---

## Verify Installation

After installation, check `package.json` should have all dependencies listed.

