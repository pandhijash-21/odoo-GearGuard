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

$id = $_GET['id'] ?? null;

if (!$id) {
    sendError('Equipment ID is required', 400);
}

try {
    $stmt = $conn->prepare("SELECT * FROM equipment WHERE equipment_id = :id");
    $stmt->execute([':id' => $id]);
    $equipment = $stmt->fetch();
    
    if (!$equipment) {
        sendError('Equipment not found', 404);
    }
    
    // Get open requests count
    $stmt = $conn->prepare("
        SELECT COUNT(*) as open_count 
        FROM maintenance_requests mr
        JOIN request_stages rs ON mr.stage_id = rs.stage_id
        WHERE mr.equipment_id = :id AND rs.stage_name IN ('New', 'In Progress')
    ");
    $stmt->execute([':id' => $id]);
    $countResult = $stmt->fetch();
    $equipment['open_request_count'] = $countResult['open_count'] ?? 0;

    // Get team name
    if (!empty($equipment['maintenance_team_id'])) {
        $stmt = $conn->prepare("SELECT team_name FROM maintenance_teams WHERE team_id = :id");
        $stmt->execute([':id' => $equipment['maintenance_team_id']]);
        $team = $stmt->fetch();
        $equipment['team_name'] = $team['team_name'] ?? null;
    }

    // Get employee name
    if (!empty($equipment['assigned_employee_id'])) {
        $stmt = $conn->prepare("SELECT full_name FROM users WHERE user_id = :id");
        $stmt->execute([':id' => $equipment['assigned_employee_id']]);
        $employee = $stmt->fetch();
        $equipment['employee_name'] = $employee['full_name'] ?? null;
    }
    
    sendSuccess($equipment);
} catch (PDOException $e) {
    sendError('Failed to fetch equipment: ' . $e->getMessage(), 500);
}
?>
