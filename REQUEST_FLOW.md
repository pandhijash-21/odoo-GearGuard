# Maintenance Request Flow in GearGuard

## 📋 Request Lifecycle

### 1. **Request Creation** (by Employee)
   - **Who:** Any logged-in user (Employee, Technician, Manager, Admin)
   - **What:** Creates a maintenance request for equipment
   - **Form Fields:**
     - Subject (required)
     - Description (optional)
     - Request Type: Corrective (repair) or Preventive (scheduled)
     - Priority: Low, Medium, High, Urgent
     - Equipment (required) - selects from available equipment
     - Maintenance Team (auto-filled from equipment)
     - Scheduled Date (for Preventive requests)
   - **Initial Stage:** Automatically set to **"New"**
   - **Auto-Assignment:**
     - ✅ **Equipment** → Auto-fills Maintenance Team from equipment
     - ❌ **Technician** → NOT auto-assigned (remains NULL initially)
     - ✅ **Created By** → Automatically set to current logged-in user

---

### 2. **Request Assignment** (by Manager/Admin)
   - **Who:** Manager or Admin
   - **What:** Assigns request to a specific technician
   - **How:** 
     - Manager/Admin views the request
     - Assigns it to a technician from the maintenance team
   - **Status:** Request remains in "New" stage until technician starts work

---

### 3. **Work Begins** (by Technician)
   - **Who:** Assigned Technician
   - **What:** Technician drags request from "New" to "In Progress"
   - **Auto-Updates:**
     - Stage changes to **"In Progress"**
     - `date_start` automatically set to current timestamp
   - **Access:** Technician can only see requests assigned to them

---

### 4. **Work Completion** (by Technician)
   - **Who:** Assigned Technician
   - **What:** Technician drags request from "In Progress" to "Repaired"
   - **Auto-Updates:**
     - Stage changes to **"Repaired"**
     - `date_end` automatically set to current timestamp
     - `completed_at` automatically set to current timestamp
     - `duration_hours` can be manually entered (optional)

---

### 5. **Scrapping** (Optional, by Manager/Admin)
   - **Who:** Manager or Admin
   - **What:** If equipment cannot be repaired, mark as "Scrap"
   - **Auto-Updates:**
     - Equipment's `is_scrapped` flag set to TRUE
     - `scrap_date` set to current date
     - Equipment no longer available for new requests

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. EMPLOYEE CREATES REQUEST                                 │
│    - Fills form (subject, equipment, type, priority)       │
│    - Equipment → Auto-fills Maintenance Team               │
│    - Stage: "New"                                           │
│    - Assigned To: NULL (not assigned yet)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MANAGER/ADMIN ASSIGNS REQUEST                            │
│    - Views request details                                  │
│    - Selects technician from team                           │
│    - Assigns request to technician                          │
│    - Stage: Still "New"                                     │
│    - Assigned To: [Technician ID]                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. TECHNICIAN STARTS WORK                                   │
│    - Drags card to "In Progress"                           │
│    - date_start: Auto-set to NOW                           │
│    - Stage: "In Progress"                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. TECHNICIAN COMPLETES WORK                                │
│    - Drags card to "Repaired"                              │
│    - date_end: Auto-set to NOW                             │
│    - completed_at: Auto-set to NOW                         │
│    - Stage: "Repaired"                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 Role-Based Access

### **Employee**
- ✅ Create requests
- ✅ View own requests (created_by = employee)
- ✅ See request details
- ❌ Cannot assign requests
- ❌ Cannot update stages

### **Technician**
- ✅ View assigned requests (assigned_to = technician)
- ✅ Update request stages (drag & drop)
- ✅ See request details
- ❌ Cannot assign requests to others
- ❌ Cannot create requests (can but limited visibility)

### **Manager**
- ✅ View ALL requests
- ✅ Assign requests to technicians
- ✅ Create requests
- ✅ See all request details
- ✅ View calendar and reports

### **Admin**
- ✅ Full access to everything
- ✅ Manage equipment
- ✅ Manage teams
- ✅ Assign requests
- ✅ View all data and reports

---

## 🔍 Key Database Fields

| Field | Description | Auto-Set? |
|-------|-------------|-----------|
| `created_by` | User who created request | ✅ Yes (current user) |
| `assigned_to` | Technician assigned | ❌ No (manual by manager) |
| `stage_id` | Current stage | ✅ Yes (starts at "New") |
| `date_start` | Work start time | ✅ Yes (when moved to "In Progress") |
| `date_end` | Work end time | ✅ Yes (when moved to "Repaired") |
| `completed_at` | Completion timestamp | ✅ Yes (when moved to "Repaired") |
| `maintenance_team_id` | Team for equipment | ✅ Yes (from equipment) |

---

## 📝 Summary

**Employee Assignment:** 
- ✅ **Created By** is auto-assigned (the employee creating the request)
- ❌ **Assigned To** (technician) is NOT auto-assigned - Manager/Admin must assign

**Technician Assignment:**
- Must be done manually by Manager/Admin
- Technician receives notification (via seeing it in their Kanban board)
- Only assigned technician can update the request stages

This ensures proper workflow: Employee creates → Manager assigns → Technician works → Request completed ✅

