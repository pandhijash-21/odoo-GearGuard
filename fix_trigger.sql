-- Quick Fix for Trigger Syntax Error
-- Run this if you already imported the schema and got the trigger error

-- Drop the problematic trigger if it exists
DROP TRIGGER IF EXISTS trigger_log_request_changes;

-- Recreate the trigger with correct MySQL syntax
DELIMITER $$

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
    
    -- Fixed: MySQL doesn't support IS DISTINCT FROM, use proper NULL handling
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

