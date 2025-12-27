# Load Sample Data for Testing

## Quick Steps

1. **Open phpMyAdmin**
   - Go to: http://localhost/phpmyadmin
   - Select database: `gear_guard`

2. **Run Sample Data SQL**
   - Click on "SQL" tab
   - Copy and paste contents of `sample_data.sql`
   - Click "Go"

3. **Verify Data**
   - Check each table:
     - Users (should have 6 users)
     - Departments (5 departments)
     - Maintenance Teams (5 teams)
     - Equipment (6 equipment items)
     - Maintenance Requests (7 requests)

---

## What's Included

### Users (6 users)
- **Admin:** admin@test.com / password
- **Manager:** manager@test.com / password
- **Technician 1:** tech1@test.com / password (assigned to Mechanics & IT Support)
- **Technician 2:** tech2@test.com / password (assigned to Electricians)
- **Employee 1:** employee@test.com / password
- **Employee 2:** john@test.com / password

### Departments (5)
- Production
- IT
- Maintenance
- Administration
- Quality Control

### Maintenance Teams (5)
- Mechanics
- Electricians
- IT Support
- HVAC Team
- General Maintenance

### Equipment (6 items)
1. CNC Milling Machine (Production)
2. Office Laptop (IT)
3. HP Printer (Administration)
4. Forklift (Production)
5. HVAC Unit (Administration)
6. Server Rack (IT)

### Maintenance Requests (7 requests)
- Mix of Corrective and Preventive
- Various stages (New, In Progress, Repaired)
- Different priorities
- Some assigned, some unassigned
- Some overdue (preventive with past dates)

---

## Test Scenarios

1. **Login as Employee:**
   - Can create requests
   - Can view requests

2. **Login as Technician:**
   - Can view assigned requests
   - Can drag & drop in Kanban
   - Can work on requests

3. **Login as Manager:**
   - Can see all requests
   - Can assign requests
   - Can create preventive maintenance

4. **Login as Admin:**
   - Full access
   - Can manage equipment
   - Can manage teams
   - Can see all data

---

**Ready to test! 🎉**

