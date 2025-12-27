<?php
// CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
require_once '../../utils/response.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $type = $_GET['type'] ?? 'all';
        
        $reports = [];
        
        // Requests per Team
        if ($type === 'all' || $type === 'teams') {
            $sql = "SELECT 
                        mt.team_name,
                        COUNT(mr.request_id) as total_requests,
                        SUM(CASE WHEN rs.stage_name = 'New' THEN 1 ELSE 0 END) as new_requests,
                        SUM(CASE WHEN rs.stage_name = 'In Progress' THEN 1 ELSE 0 END) as in_progress_requests,
                        SUM(CASE WHEN rs.stage_name = 'Repaired' THEN 1 ELSE 0 END) as repaired_requests,
                        SUM(CASE WHEN mr.is_overdue = 1 THEN 1 ELSE 0 END) as overdue_requests
                    FROM maintenance_teams mt
                    LEFT JOIN maintenance_requests mr ON mt.team_id = mr.maintenance_team_id
                    LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id
                    GROUP BY mt.team_id, mt.team_name
                    ORDER BY total_requests DESC";
            
            $stmt = $conn->query($sql);
            $teamData = $stmt->fetchAll();
            $reports['by_team'] = $teamData ? $teamData : [];
        }
        
        // Requests per Equipment Category
        if ($type === 'all' || $type === 'categories') {
            $sql = "SELECT 
                        COALESCE(e.category, 'Uncategorized') as category,
                        COUNT(mr.request_id) as total_requests,
                        SUM(CASE WHEN rs.stage_name = 'New' THEN 1 ELSE 0 END) as new_requests,
                        SUM(CASE WHEN rs.stage_name = 'In Progress' THEN 1 ELSE 0 END) as in_progress_requests,
                        SUM(CASE WHEN rs.stage_name = 'Repaired' THEN 1 ELSE 0 END) as repaired_requests,
                        SUM(CASE WHEN mr.is_overdue = 1 THEN 1 ELSE 0 END) as overdue_requests
                    FROM equipment e
                    LEFT JOIN maintenance_requests mr ON e.equipment_id = mr.equipment_id
                    LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id
                    GROUP BY e.category
                    ORDER BY total_requests DESC";
            
            $stmt = $conn->query($sql);
            $categoryData = $stmt->fetchAll();
            $reports['by_category'] = $categoryData ? $categoryData : [];
        }
        
        // Overall Statistics
        if ($type === 'all' || $type === 'overall') {
            $sql = "SELECT 
                        COUNT(*) as total_requests,
                        SUM(CASE WHEN rs.stage_name = 'New' THEN 1 ELSE 0 END) as new_count,
                        SUM(CASE WHEN rs.stage_name = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
                        SUM(CASE WHEN rs.stage_name = 'Repaired' THEN 1 ELSE 0 END) as repaired_count,
                        SUM(CASE WHEN mr.is_overdue = 1 THEN 1 ELSE 0 END) as overdue_count,
                        SUM(CASE WHEN mr.request_type = 'Corrective' THEN 1 ELSE 0 END) as corrective_count,
                        SUM(CASE WHEN mr.request_type = 'Preventive' THEN 1 ELSE 0 END) as preventive_count
                    FROM maintenance_requests mr
                    LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id";
            
            $stmt = $conn->query($sql);
            $overallData = $stmt->fetch();
            $reports['overall'] = $overallData ? $overallData : null;
        }
        
        // Requests by Priority
        if ($type === 'all' || $type === 'priority') {
            $sql = "SELECT 
                        COALESCE(mr.priority, 'medium') as priority,
                        COUNT(*) as count
                    FROM maintenance_requests mr
                    GROUP BY mr.priority
                    ORDER BY 
                        CASE mr.priority
                            WHEN 'urgent' THEN 1
                            WHEN 'high' THEN 2
                            WHEN 'medium' THEN 3
                            WHEN 'low' THEN 4
                            ELSE 5
                        END";
            
            $stmt = $conn->query($sql);
            $priorityData = $stmt->fetchAll();
            $reports['by_priority'] = $priorityData ? $priorityData : [];
        }
        
        // Ensure all keys exist
        if (!isset($reports['by_team'])) $reports['by_team'] = [];
        if (!isset($reports['by_category'])) $reports['by_category'] = [];
        if (!isset($reports['overall'])) $reports['overall'] = null;
        if (!isset($reports['by_priority'])) $reports['by_priority'] = [];
        
        sendSuccess($reports);
    } catch (PDOException $e) {
        sendError('Failed to fetch reports: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
