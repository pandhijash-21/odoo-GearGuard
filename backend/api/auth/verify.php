<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    try {
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION'] ?? '');
        
        if (empty($token)) {
            sendError('Token required', 401);
        }
        
        // Decode token (in production, verify JWT signature)
        $decoded = json_decode(base64_decode($token), true);
        
        if (!$decoded || !isset($decoded['user_id'])) {
            sendError('Invalid token', 401);
        }
        
        $stmt = $conn->prepare("SELECT user_id, full_name, email, role, avatar_url FROM users WHERE user_id = :id AND is_active = 1");
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

