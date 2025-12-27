<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

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
    
    sendSuccess($equipment);
} catch (PDOException $e) {
    sendError('Failed to fetch equipment: ' . $e->getMessage(), 500);
}
?>

