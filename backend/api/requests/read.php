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
        $id = $_GET['id'] ?? null;

        if (!$id) {
            sendError('Request ID is required', 400);
        }

        $sql = "SELECT mr.*, 
                e.equipment_name, e.serial_number, e.location as equipment_location,
                rs.stage_name,
                mt.team_name,
                u1.full_name as assigned_to_name, u1.avatar_url as assigned_to_avatar, u1.email as assigned_to_email,
                u2.full_name as created_by_name, u2.email as created_by_email
                FROM maintenance_requests mr
                LEFT JOIN equipment e ON mr.equipment_id = e.equipment_id
                LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id
                LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.team_id
                LEFT JOIN users u1 ON mr.assigned_to = u1.user_id
                LEFT JOIN users u2 ON mr.created_by = u2.user_id
                WHERE mr.request_id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id]);
        $request = $stmt->fetch();

        if (!$request) {
            sendError('Request not found', 404);
        }

        sendSuccess($request);
    } catch (PDOException $e) {
        sendError('Failed to fetch request: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

