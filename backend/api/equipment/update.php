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
        $id = $_GET['id'] ?? null;
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$id) {
            sendError('Equipment ID is required', 400);
        }

        // Build update query dynamically
        $fields = [];
        $params = [':equipment_id' => $id];

        $allowedFields = [
            'equipment_name', 'serial_number', 'category', 'purchase_date',
            'warranty_expiry_date', 'warranty_info', 'location', 'department_id',
            'assigned_employee_id', 'maintenance_team_id', 'default_technician_id'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            sendError('No fields to update', 400);
        }

        $sql = "UPDATE equipment SET " . implode(', ', $fields) . " WHERE equipment_id = :equipment_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        sendSuccess(['equipment_id' => $id], 'Equipment updated successfully');
    } catch (PDOException $e) {
        sendError('Failed to update equipment: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

