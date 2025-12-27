-- ============================================
-- GearGuard: Complete Database Schema (MySQL/MariaDB)
-- Maintenance Management System
-- Compatible with XAMPP
-- ============================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS gear_guard;
-- USE gear_guard;

-- Drop existing objects if recreating (uncomment if needed)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS request_logs;
-- DROP TABLE IF EXISTS maintenance_requests;
-- DROP TABLE IF EXISTS request_stages;
-- DROP TABLE IF EXISTS equipment;
-- DROP TABLE IF EXISTS team_members;
-- DROP TABLE IF EXISTS maintenance_teams;
-- DROP TABLE IF EXISTS departments;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS equipment_categories;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role ENUM('admin', 'manager', 'technician', 'employee') NOT NULL,
    avatar_url TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. MAINTENANCE TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. TEAM MEMBERS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    team_member_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES maintenance_teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_user (team_id, user_id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. EQUIPMENT CATEGORIES TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS equipment_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. EQUIPMENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    category_id INT,
    purchase_date DATE,
    warranty_expiry_date DATE,
    warranty_info TEXT,
    location VARCHAR(100),
    department_id INT,
    assigned_employee_id INT,
    maintenance_team_id INT,
    default_technician_id INT,
    is_scrapped TINYINT(1) DEFAULT 0,
    scrap_date DATE,
    scrap_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES equipment_categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_employee_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (default_technician_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. REQUEST STAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS request_stages (
    stage_id INT AUTO_INCREMENT PRIMARY KEY,
    stage_name VARCHAR(20) UNIQUE NOT NULL,
    sequence_no INT NOT NULL,
    is_closed TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default stages
INSERT INTO request_stages (stage_name, sequence_no, is_closed) VALUES
('New', 1, 0),
('In Progress', 2, 0),
('Repaired', 3, 1),
('Scrap', 4, 1)
ON DUPLICATE KEY UPDATE stage_name = stage_name;

-- ============================================
-- 8. MAINTENANCE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    request_type ENUM('Corrective', 'Preventive') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    equipment_id INT NOT NULL,
    maintenance_team_id INT NOT NULL,
    assigned_to INT,
    created_by INT NOT NULL,
    stage_id INT NOT NULL,
    scheduled_date DATETIME,
    duration_hours DECIMAL(5,2),
    date_start DATETIME,
    is_overdue TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE RESTRICT,
    FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(team_id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (stage_id) REFERENCES request_stages(stage_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 9. REQUEST LOGS TABLE (Audit Trail)
-- ============================================
CREATE TABLE IF NOT EXISTS request_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    action VARCHAR(100),
    old_stage VARCHAR(20),
    new_stage VARCHAR(20),
    action_by INT,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES maintenance_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (action_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 10. PERFORMANCE INDEXES
-- ============================================

-- Equipment indexes
CREATE INDEX idx_equipment_department ON equipment(department_id);
CREATE INDEX idx_equipment_category ON equipment(category_id);
CREATE INDEX idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX idx_equipment_serial ON equipment(serial_number);
CREATE INDEX idx_equipment_scrapped ON equipment(is_scrapped);
CREATE INDEX idx_equipment_employee ON equipment(assigned_employee_id);

-- Maintenance requests indexes
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_team ON maintenance_requests(maintenance_team_id);
CREATE INDEX idx_requests_stage ON maintenance_requests(stage_id);
CREATE INDEX idx_requests_assigned ON maintenance_requests(assigned_to);
CREATE INDEX idx_requests_scheduled ON maintenance_requests(scheduled_date);
CREATE INDEX idx_requests_type ON maintenance_requests(request_type);
CREATE INDEX idx_requests_overdue ON maintenance_requests(is_overdue);
CREATE INDEX idx_requests_created_by ON maintenance_requests(created_by);
CREATE INDEX idx_requests_priority ON maintenance_requests(priority);

-- Request logs indexes
CREATE INDEX idx_logs_request ON request_logs(request_id);
CREATE INDEX idx_logs_action_time ON request_logs(action_time);
CREATE INDEX idx_logs_action_by ON request_logs(action_by);

-- Team members indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================
-- 11. VIEWS FOR REPORTING
-- ============================================

-- Equipment with open request count (for smart button)
CREATE OR REPLACE VIEW equipment_with_open_requests AS
SELECT 
    e.*,
    COUNT(CASE WHEN mr.stage_id IN (
        SELECT stage_id FROM request_stages 
        WHERE stage_name IN ('New', 'In Progress')
    ) THEN 1 END) as open_request_count
FROM equipment e
LEFT JOIN maintenance_requests mr ON mr.equipment_id = e.equipment_id
WHERE e.is_scrapped = 0
GROUP BY e.equipment_id;

-- Team performance dashboard
CREATE OR REPLACE VIEW team_performance AS
SELECT 
    mt.team_id,
    mt.team_name,
    COUNT(mr.request_id) as total_requests,
    COUNT(CASE WHEN mr.request_type = 'Corrective' THEN 1 END) as corrective_count,
    COUNT(CASE WHEN mr.request_type = 'Preventive' THEN 1 END) as preventive_count,
    AVG(mr.duration_hours) as avg_duration_hours,
    COUNT(CASE WHEN mr.is_overdue = 1 THEN 1 END) as overdue_count
FROM maintenance_teams mt
LEFT JOIN maintenance_requests mr ON mr.maintenance_team_id = mt.team_id
GROUP BY mt.team_id, mt.team_name;

-- Equipment by category report
CREATE OR REPLACE VIEW equipment_by_category AS
SELECT 
    COALESCE(e.category, ec.category_name, 'Uncategorized') as category,
    COUNT(*) as equipment_count,
    COUNT(CASE WHEN e.is_scrapped = 0 THEN 1 END) as active_count,
    COUNT(CASE WHEN e.is_scrapped = 1 THEN 1 END) as scrapped_count
FROM equipment e
LEFT JOIN equipment_categories ec ON e.category_id = ec.category_id
GROUP BY COALESCE(e.category, ec.category_name, 'Uncategorized');

-- ============================================
-- 12. TRIGGERS FOR AUTO-UPDATES
-- ============================================

DELIMITER $$

-- Trigger: Auto-update is_overdue flag
CREATE TRIGGER trigger_update_overdue_before_insert
BEFORE INSERT ON maintenance_requests
FOR EACH ROW
BEGIN
    IF NEW.request_type = 'Preventive' 
       AND NEW.scheduled_date IS NOT NULL
       AND NEW.scheduled_date < NOW()
       AND NEW.stage_id NOT IN (
           SELECT stage_id FROM request_stages WHERE stage_name IN ('Repaired', 'Scrap')
       ) THEN
        SET NEW.is_overdue = 1;
    ELSE
        SET NEW.is_overdue = 0;
    END IF;
END$$

CREATE TRIGGER trigger_update_overdue_before_update
BEFORE UPDATE ON maintenance_requests
FOR EACH ROW
BEGIN
    IF NEW.request_type = 'Preventive' 
       AND NEW.scheduled_date IS NOT NULL
       AND NEW.scheduled_date < NOW()
       AND NEW.stage_id NOT IN (
           SELECT stage_id FROM request_stages WHERE stage_name IN ('Repaired', 'Scrap')
       ) THEN
        SET NEW.is_overdue = 1;
    ELSE
        SET NEW.is_overdue = 0;
    END IF;
END$$

-- Trigger: Auto-update equipment scrap status
CREATE TRIGGER trigger_equipment_scrap
AFTER UPDATE ON maintenance_requests
FOR EACH ROW
BEGIN
    IF NEW.stage_id = (SELECT stage_id FROM request_stages WHERE stage_name = 'Scrap')
       AND (OLD.stage_id IS NULL OR OLD.stage_id != NEW.stage_id) THEN
        UPDATE equipment
        SET is_scrapped = 1,
            scrap_date = CURDATE(),
            scrap_reason = COALESCE(NEW.description, NEW.subject, 'Scrapped via maintenance request')
        WHERE equipment_id = NEW.equipment_id;
    END IF;
END$$

-- Trigger: Auto-log request changes
CREATE TRIGGER trigger_log_request_changes
AFTER UPDATE ON maintenance_requests
FOR EACH ROW
BEGIN
    IF OLD.stage_id IS NULL OR OLD.stage_id != NEW.stage_id THEN
        INSERT INTO request_logs (request_id, action, old_stage, new_stage, action_by)
        VALUES (
            NEW.request_id,
            'Stage Changed',
            (SELECT stage_name FROM request_stages WHERE stage_id = OLD.stage_id),
            (SELECT stage_name FROM request_stages WHERE stage_id = NEW.stage_id),
            COALESCE(NEW.assigned_to, NEW.created_by)
        );
    END IF;
    
    IF (OLD.assigned_to IS NULL AND NEW.assigned_to IS NOT NULL) 
       OR (OLD.assigned_to IS NOT NULL AND NEW.assigned_to IS NULL)
       OR (OLD.assigned_to IS NOT NULL AND NEW.assigned_to IS NOT NULL AND OLD.assigned_to != NEW.assigned_to) THEN
        INSERT INTO request_logs (request_id, action, action_by)
        VALUES (
            NEW.request_id,
            'Assignment Changed',
            COALESCE(NEW.assigned_to, NEW.created_by)
        );
    END IF;
END$$

DELIMITER ;

-- ============================================
-- 13. HELPER FUNCTIONS (Stored Procedures)
-- ============================================

DELIMITER $$

-- Function: Get open request count for equipment
CREATE PROCEDURE get_equipment_open_requests(IN p_equipment_id INT, OUT v_count INT)
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM maintenance_requests mr
    JOIN request_stages rs ON mr.stage_id = rs.stage_id
    WHERE mr.equipment_id = p_equipment_id
      AND rs.stage_name IN ('New', 'In Progress');
END$$

-- Function: Check if user is team member
CREATE PROCEDURE is_team_member(IN p_user_id INT, IN p_team_id INT, OUT v_exists BOOLEAN)
BEGIN
    DECLARE count_result INT;
    SELECT COUNT(*) INTO count_result
    FROM team_members 
    WHERE user_id = p_user_id AND team_id = p_team_id;
    
    SET v_exists = (count_result > 0);
END$$

DELIMITER ;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Verification queries (optional - run to verify setup)
-- SELECT 'Tables created successfully' as status;
-- SHOW TABLES;
-- SELECT * FROM request_stages ORDER BY sequence_no;

