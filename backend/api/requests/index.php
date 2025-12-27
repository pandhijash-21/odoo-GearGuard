<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stage = $_GET['stage'] ?? null;
        $equipment_id = $_GET['equipment_id'] ?? null;
        $team_id = $_GET['team_id'] ?? null;
        
        $sql = "SELECT mr.*, 
                e.equipment_name, e.serial_number,
                rs.stage_name,
                mt.team_name,
                u1.full_name as assigned_to_name, u1.avatar_url as assigned_to_avatar,
                u2.full_name as created_by_name
                FROM maintenance_requests mr
                LEFT JOIN equipment e ON mr.equipment_id = e.equipment_id
                LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id
                LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.team_id
                LEFT JOIN users u1 ON mr.assigned_to = u1.user_id
                LEFT JOIN users u2 ON mr.created_by = u2.user_id
                WHERE 1=1";
        
        $params = [];
        if ($stage) {
            $sql .= " AND rs.stage_name = :stage";
            $params[':stage'] = $stage;
        }
        if ($equipment_id) {
            $sql .= " AND mr.equipment_id = :equipment_id";
            $params[':equipment_id'] = $equipment_id;
        }
        if ($team_id) {
            $sql .= " AND mr.maintenance_team_id = :team_id";
            $params[':team_id'] = $team_id;
        }
        
        $sql .= " ORDER BY mr.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $requests = $stmt->fetchAll();
        
        sendSuccess($requests);
    } catch (PDOException $e) {
        sendError('Failed to fetch requests: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

