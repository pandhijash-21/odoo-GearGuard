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

if ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Get default stage_id for "New"
        $stmt = $conn->query("SELECT stage_id FROM request_stages WHERE stage_name = 'New' LIMIT 1");
        $newStage = $stmt->fetch();
        $stage_id = $newStage['stage_id'] ?? 1;
        
        // Auto-fill category and team from equipment if not provided
        $maintenance_team_id = $data['maintenance_team_id'] ?? null;
        
        if (!empty($data['equipment_id']) && empty($maintenance_team_id)) {
            $stmt = $conn->prepare("SELECT category, maintenance_team_id FROM equipment WHERE equipment_id = :id");
            $stmt->execute([':id' => $data['equipment_id']]);
            $equipment = $stmt->fetch();
            
            if ($equipment && !empty($equipment['maintenance_team_id'])) {
                $maintenance_team_id = $equipment['maintenance_team_id'];
            }
        }
        
        if (empty($maintenance_team_id)) {
            sendError('Maintenance team is required', 400);
        }
        
        $sql = "INSERT INTO maintenance_requests (subject, description, request_type, priority, equipment_id, maintenance_team_id, created_by, stage_id, scheduled_date) 
                VALUES (:subject, :description, :request_type, :priority, :equipment_id, :maintenance_team_id, :created_by, :stage_id, :scheduled_date)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':subject' => $data['subject'] ?? null,
            ':description' => $data['description'] ?? null,
            ':request_type' => $data['request_type'] ?? 'Corrective',
            ':priority' => $data['priority'] ?? 'medium',
            ':equipment_id' => $data['equipment_id'] ?? null,
            ':maintenance_team_id' => $maintenance_team_id,
            ':created_by' => $data['created_by'] ?? 1, // TODO: Get from session/auth token
            ':stage_id' => $stage_id,
            ':scheduled_date' => $data['scheduled_date'] ?? null
        ]);
        
        $id = $conn->lastInsertId();
        sendSuccess(['id' => $id, 'request_id' => $id], 'Request created successfully');
    } catch (PDOException $e) {
        sendError('Failed to create request: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

