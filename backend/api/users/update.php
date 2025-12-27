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
        
        if (!$id) {
            sendError('User ID is required', 400);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $role = $data['role'] ?? null;
        
        if (!$role) {
            sendError('Role is required', 400);
        }
        
        // Validate role
        $validRoles = ['admin', 'manager', 'technician', 'employee'];
        if (!in_array($role, $validRoles)) {
            sendError('Invalid role. Must be one of: ' . implode(', ', $validRoles), 400);
        }
        
        // Check if user exists
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE user_id = :id");
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendError('User not found', 404);
        }
        
        // Update user role
        $stmt = $conn->prepare("UPDATE users SET role = :role WHERE user_id = :id");
        $stmt->execute([
            ':role' => $role,
            ':id' => $id
        ]);
        
        // Get updated user
        $stmt = $conn->prepare("SELECT user_id, full_name, email, role, avatar_url, is_active, created_at FROM users WHERE user_id = :id");
        $stmt->execute([':id' => $id]);
        $updatedUser = $stmt->fetch();
        
        sendSuccess(['user' => $updatedUser], 'User role updated successfully');
        
    } catch (PDOException $e) {
        sendError('Failed to update user: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

