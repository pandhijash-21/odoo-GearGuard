# 📋 Request Flow - Quick Summary

## Auto-Assignment Status

### ✅ AUTO-ASSIGNED:
1. **Created By** → Automatically set to the logged-in user creating the request
2. **Maintenance Team** → Automatically filled from selected equipment
3. **Stage** → Automatically set to "New"
4. **Equipment** → User selects, then team is auto-filled

### ❌ NOT AUTO-ASSIGNED:
1. **Assigned To (Technician)** → Must be manually assigned by Manager/Admin
   - This ensures proper workflow: Employee creates → Manager reviews → Manager assigns → Technician works

---

## Complete Request Journey

### Step 1: Employee Creates Request
- **Who:** Any user (Employee, Technician, Manager, Admin)
- **Action:** Fills form with:
  - Subject, Description
  - Equipment (required)
  - Request Type (Corrective/Preventive)
  - Priority
- **Auto-filled:**
  - ✅ Maintenance Team (from equipment)
  - ✅ Created By (current user)
  - ✅ Stage = "New"
- **Result:** Request created, but NO technician assigned yet

### Step 2: Manager/Admin Assigns Technician (OPTIONAL)
- **Who:** Manager or Admin
- **Action:** Views request → Assigns to a technician
- **Result:** Request now has `assigned_to` = technician ID
- **Status:** Still in "New" stage

### Step 3: Technician Starts Work
- **Who:** Assigned Technician
- **Action:** Drags request card from "New" → "In Progress"
- **Auto-updates:**
  - ✅ Stage = "In Progress"
  - ✅ date_start = NOW()
- **Result:** Work has begun

### Step 4: Technician Completes Work
- **Who:** Assigned Technician
- **Action:** Drags request card from "In Progress" → "Repaired"
- **Auto-updates:**
  - ✅ Stage = "Repaired"
  - ✅ date_end = NOW()
  - ✅ completed_at = NOW()
- **Result:** Request completed ✅

---

## Key Points

1. **Employee is NOT auto-assigned as technician**
   - Employee creates the request (`created_by`)
   - Manager/Admin assigns a technician (`assigned_to`)

2. **Technician assignment is manual** for quality control:
   - Manager reviews the request first
   - Manager assigns to appropriate technician based on expertise
   - Prevents incorrect assignments

3. **Technicians can only see requests assigned to them**
   - Role-based filtering ensures clear workflow
   - Employee sees their own created requests
   - Technician sees assigned requests
   - Manager/Admin sees all requests

---

**Current Implementation:**
- ✅ Dashboard requests are clickable → Shows detail modal with all info
- ✅ Request detail modal shows assigned technician (if assigned)
- ✅ Role-based filtering works correctly
- ✅ Auto-assignment of team from equipment works
- ⚠️ Technician assignment is manual (by design)

