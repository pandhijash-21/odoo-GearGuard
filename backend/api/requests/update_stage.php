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

if ($method === 'PUT') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $request_id = $data['request_id'] ?? null;
        $stage_id = $data['stage_id'] ?? null;
        
        if (!$request_id || !$stage_id) {
            sendError('Request ID and Stage ID are required', 400);
        }
        
        $sql = "UPDATE maintenance_requests SET stage_id = :stage_id";
        
        // If moving to In Progress, set date_start
        $stmt = $conn->prepare("SELECT stage_name FROM request_stages WHERE stage_id = :id");
        $stmt->execute([':id' => $stage_id]);
        $stage = $stmt->fetch();
        
        if ($stage && $stage['stage_name'] === 'In Progress') {
            $sql .= ", date_start = NOW()";
        }
        
        // If moving to Repaired, set date_end and completed_at
        if ($stage && $stage['stage_name'] === 'Repaired') {
            $sql .= ", date_end = NOW(), completed_at = NOW()";
        }
        
        $sql .= " WHERE request_id = :request_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':stage_id' => $stage_id,
            ':request_id' => $request_id
        ]);
        
        sendSuccess(['request_id' => $request_id], 'Stage updated successfully');
    } catch (PDOException $e) {
        sendError('Failed to update stage: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

