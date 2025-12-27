<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $role = $_GET['role'] ?? null;
        
        $sql = "SELECT user_id, full_name, email, role, avatar_url, is_active, created_at FROM users WHERE 1=1";
        $params = [];
        
        if ($role) {
            $sql .= " AND role = :role";
            $params[':role'] = $role;
        }
        
        $sql .= " ORDER BY full_name";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();
        
        sendSuccess($users);
    } catch (PDOException $e) {
        sendError('Failed to fetch users: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

