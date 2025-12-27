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
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = str_replace('Bearer ', '', $authHeader);
        
        if (empty($token)) {
            sendError('Token required', 401);
        }
        
        // Decode token (in production, verify JWT signature)
        $decoded = json_decode(base64_decode($token), true);
        
        if (!$decoded || !isset($decoded['user_id'])) {
            sendError('Invalid token', 401);
        }
        
        $stmt = $conn->prepare("SELECT user_id, full_name, email, role, avatar_url, is_active FROM users WHERE user_id = :id AND is_active = 1");
        $stmt->execute([':id' => $decoded['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendError('User not found', 401);
        }
        
        sendSuccess(['user' => $user], 'Token valid');
        
    } catch (PDOException $e) {
        sendError('Verification failed: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
