-- ============================================
-- GearGuard: Sample Data for Testing
-- Run this in phpMyAdmin after setting up the database
-- ============================================

-- Clear existing data (optional - uncomment if you want to start fresh)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE maintenance_requests;
-- TRUNCATE TABLE request_logs;
-- TRUNCATE TABLE equipment;
-- TRUNCATE TABLE team_members;
-- TRUNCATE TABLE maintenance_teams;
-- TRUNCATE TABLE departments;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USERS
-- All passwords are: 'password'
-- Password hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ============================================
INSERT INTO users (full_name, email, role, password_hash, is_active) VALUES
('Admin User', 'admin@test.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Manager One', 'manager@test.com', 'manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Technician One', 'tech1@test.com', 'technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Technician Two', 'tech2@test.com', 'technician', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Employee One', 'employee@test.com', 'employee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('John Smith', 'john@test.com', 'employee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- ============================================
-- 2. DEPARTMENTS
-- ============================================
INSERT INTO departments (department_name) VALUES
('Production'),
('IT'),
('Maintenance'),
('Administration'),
('Quality Control')
ON DUPLICATE KEY UPDATE department_name = VALUES(department_name);

-- ============================================
-- 3. MAINTENANCE TEAMS
-- ============================================
INSERT INTO maintenance_teams (team_name, description) VALUES
('Mechanics', 'Handles mechanical repairs and maintenance'),
('Electricians', 'Electrical system repairs and installations'),
('IT Support', 'Computer and network support'),
('HVAC Team', 'Heating, ventilation, and air conditioning'),
('General Maintenance', 'General facility maintenance tasks')
ON DUPLICATE KEY UPDATE team_name = VALUES(team_name);

-- ============================================
-- 4. TEAM MEMBERS (Link users to teams)
-- ============================================
-- Get IDs first (assuming they exist, adjust if needed)
INSERT INTO team_members (team_id, user_id)
SELECT 
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1)
    AND tm.user_id = (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
);

INSERT INTO team_members (team_id, user_id)
SELECT 
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Electricians' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech2@test.com' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = (SELECT team_id FROM maintenance_teams WHERE team_name = 'Electricians' LIMIT 1)
    AND tm.user_id = (SELECT user_id FROM users WHERE email = 'tech2@test.com' LIMIT 1)
);

INSERT INTO team_members (team_id, user_id)
SELECT 
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1)
    AND tm.user_id = (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
);

-- ============================================
-- 5. EQUIPMENT CATEGORIES (Optional)
-- ============================================
INSERT INTO equipment_categories (category_name, description) VALUES
('CNC Machines', 'Computer numerical control machines'),
('Vehicles', 'Company vehicles and forklifts'),
('Computers', 'Desktops, laptops, and servers'),
('HVAC Systems', 'Heating and cooling equipment'),
('Office Equipment', 'Printers, scanners, copiers')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- ============================================
-- 6. EQUIPMENT
-- ============================================
INSERT INTO equipment (
    equipment_name, 
    serial_number, 
    category, 
    purchase_date, 
    warranty_expiry_date, 
    warranty_info, 
    location, 
    department_id, 
    assigned_employee_id, 
    maintenance_team_id, 
    default_technician_id
) VALUES
(
    'CNC Milling Machine 01',
    'CNC-2023-001',
    'CNC Machines',
    '2023-01-15',
    '2026-01-15',
    '3-year warranty, includes maintenance',
    'Production Floor - Section A',
    (SELECT department_id FROM departments WHERE department_name = 'Production' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'john@test.com' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
),
(
    'Office Laptop - Dell XPS',
    'LAP-2024-045',
    'Computers',
    '2024-03-10',
    '2027-03-10',
    'Extended warranty - on-site support',
    'IT Department - Desk 5',
    (SELECT department_id FROM departments WHERE department_name = 'IT' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'employee@test.com' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
),
(
    'Printer HP LaserJet Pro',
    'PRN-2023-089',
    'Office Equipment',
    '2023-06-20',
    '2025-06-20',
    'Standard warranty',
    'Administration - Reception',
    (SELECT department_id FROM departments WHERE department_name = 'Administration' LIMIT 1),
    NULL,
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
),
(
    'Forklift - Toyota 8FGCU25',
    'FLT-2022-012',
    'Vehicles',
    '2022-11-05',
    NULL,
    'Warranty expired',
    'Warehouse - Bay 3',
    (SELECT department_id FROM departments WHERE department_name = 'Production' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'john@test.com' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
),
(
    'HVAC Unit - Building A',
    'HVAC-2021-001',
    'HVAC Systems',
    '2021-04-12',
    NULL,
    'Warranty expired - maintenance contract active',
    'Building A - Rooftop',
    (SELECT department_id FROM departments WHERE department_name = 'Administration' LIMIT 1),
    NULL,
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'HVAC Team' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech2@test.com' LIMIT 1)
),
(
    'Server Rack - Main Data Center',
    'SRV-2023-101',
    'Computers',
    '2023-09-01',
    '2026-09-01',
    'Premium support included',
    'Data Center - Room 204',
    (SELECT department_id FROM departments WHERE department_name = 'IT' LIMIT 1),
    NULL,
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1)
);

-- ============================================
-- 7. MAINTENANCE REQUESTS
-- ============================================
-- Get stage IDs
SET @stage_new = (SELECT stage_id FROM request_stages WHERE stage_name = 'New' LIMIT 1);
SET @stage_in_progress = (SELECT stage_id FROM request_stages WHERE stage_name = 'In Progress' LIMIT 1);
SET @stage_repaired = (SELECT stage_id FROM request_stages WHERE stage_name = 'Repaired' LIMIT 1);

-- Insert sample requests
INSERT INTO maintenance_requests (
    subject,
    description,
    request_type,
    priority,
    equipment_id,
    maintenance_team_id,
    created_by,
    assigned_to,
    stage_id,
    scheduled_date,
    duration_hours,
    date_start,
    completed_at
) VALUES
(
    'Leaking Oil from CNC Machine',
    'CNC Machine 01 is leaking hydraulic oil from the base. Oil puddle forming on floor. Needs immediate attention to prevent damage.',
    'Corrective',
    'high',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'CNC-2023-001' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'john@test.com' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1),
    @stage_in_progress,
    NULL,
    NULL,
    NOW() - INTERVAL 2 HOUR,
    NULL
),
(
    'Laptop Not Starting',
    'Dell XPS laptop shows black screen when power button is pressed. No beep, no lights. Suspected power supply issue.',
    'Corrective',
    'medium',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'LAP-2024-045' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'employee@test.com' LIMIT 1),
    NULL,
    @stage_new,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'Printer Paper Jam',
    'HP LaserJet Pro keeps jamming with every print job. Paper gets stuck in the middle. Tried cleaning but issue persists.',
    'Corrective',
    'low',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'PRN-2023-089' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'employee@test.com' LIMIT 1),
    NULL,
    @stage_new,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'Monthly Forklift Inspection',
    'Routine monthly inspection of forklift. Check hydraulic system, brakes, tires, and battery.',
    'Preventive',
    'medium',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'FLT-2022-012' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'manager@test.com' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1),
    @stage_repaired,
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    2.5,
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    DATE_ADD(CURDATE(), INTERVAL 3 DAY)
),
(
    'HVAC Filter Replacement',
    'Quarterly filter replacement for Building A HVAC unit. Schedule during off-hours.',
    'Preventive',
    'low',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'HVAC-2021-001' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'HVAC Team' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'manager@test.com' LIMIT 1),
    NULL,
    @stage_new,
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    NULL,
    NULL,
    NULL
),
(
    'Server Backup Verification',
    'Weekly server backup verification and log check. Ensure all backups are running correctly.',
    'Preventive',
    'medium',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'SRV-2023-101' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'IT Support' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'manager@test.com' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'tech1@test.com' LIMIT 1),
    @stage_repaired,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    1.0,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY)
),
(
    'Forklift Battery Replacement',
    'Forklift battery is no longer holding charge. Needs replacement. Order new battery first.',
    'Corrective',
    'urgent',
    (SELECT equipment_id FROM equipment WHERE serial_number = 'FLT-2022-012' LIMIT 1),
    (SELECT team_id FROM maintenance_teams WHERE team_name = 'Mechanics' LIMIT 1),
    (SELECT user_id FROM users WHERE email = 'john@test.com' LIMIT 1),
    NULL,
    @stage_new,
    NULL,
    NULL,
    NULL,
    NULL
);

-- ============================================
-- Verify Data
-- ============================================
SELECT 'Sample data inserted successfully!' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_departments FROM departments;
SELECT COUNT(*) AS total_teams FROM maintenance_teams;
SELECT COUNT(*) AS total_equipment FROM equipment;
SELECT COUNT(*) AS total_requests FROM maintenance_requests;

