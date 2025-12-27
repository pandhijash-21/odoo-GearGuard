<?php
// CORS headers - must be before any output
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
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
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            sendError('Email and password are required', 400);
        }
        
        // Get user with password hash
        $stmt = $conn->prepare("SELECT user_id, full_name, email, password_hash, role, avatar_url, is_active, created_at FROM users WHERE email = :email AND is_active = 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendError('Invalid credentials', 401);
        }
        
        // Check password
        if (empty($user['password_hash'])) {
            sendError('Password not set for this user. Please contact administrator.', 401);
        }
        
        if (!password_verify($password, $user['password_hash'])) {
            sendError('Invalid email or password', 401);
        }
        
        // Remove sensitive data
        unset($user['password_hash']);
        
        // Generate simple token (in production, use JWT)
        $token = base64_encode(json_encode(['user_id' => $user['user_id'], 'role' => $user['role']]));
        
        sendSuccess([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
        
    } catch (PDOException $e) {
        sendError('Login failed: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

