<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM equipment ORDER BY created_at DESC");
        $equipment = $stmt->fetchAll();
        sendSuccess($equipment);
    } catch (PDOException $e) {
        sendError('Failed to fetch equipment: ' . $e->getMessage(), 500);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO equipment (equipment_name, serial_number, category, purchase_date, warranty_expiry_date, warranty_info, location, department_id, assigned_employee_id, maintenance_team_id, default_technician_id) 
                VALUES (:equipment_name, :serial_number, :category, :purchase_date, :warranty_expiry_date, :warranty_info, :location, :department_id, :assigned_employee_id, :maintenance_team_id, :default_technician_id)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':equipment_name' => $data['equipment_name'] ?? null,
            ':serial_number' => $data['serial_number'] ?? null,
            ':category' => $data['category'] ?? null,
            ':purchase_date' => $data['purchase_date'] ?? null,
            ':warranty_expiry_date' => $data['warranty_expiry_date'] ?? null,
            ':warranty_info' => $data['warranty_info'] ?? null,
            ':location' => $data['location'] ?? null,
            ':department_id' => $data['department_id'] ?? null,
            ':assigned_employee_id' => $data['assigned_employee_id'] ?? null,
            ':maintenance_team_id' => $data['maintenance_team_id'] ?? null,
            ':default_technician_id' => $data['default_technician_id'] ?? null
        ]);
        
        $id = $conn->lastInsertId();
        sendSuccess(['id' => $id, 'equipment_id' => $id], 'Equipment created successfully');
    } catch (PDOException $e) {
        sendError('Failed to create equipment: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

