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
        $full_name = trim($data['full_name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        
        // Validation
        if (empty($full_name) || empty($email) || empty($password)) {
            sendError('Full name, email, and password are required', 400);
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError('Invalid email format', 400);
        }
        
        if (strlen($password) < 6) {
            sendError('Password must be at least 6 characters long', 400);
        }
        
        // Check if email already exists
        $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $existingUser = $stmt->fetch();
        
        if ($existingUser) {
            sendError('Email already registered. Please use a different email or login.', 400);
        }
        
        // Hash password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user with default role 'employee'
        $sql = "INSERT INTO users (full_name, email, password_hash, role, is_active, created_at) 
                VALUES (:full_name, :email, :password_hash, 'employee', 1, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':full_name' => $full_name,
            ':email' => $email,
            ':password_hash' => $password_hash
        ]);
        
        $user_id = $conn->lastInsertId();
        
        // Get the created user (without password)
        $stmt = $conn->prepare("SELECT user_id, full_name, email, role, avatar_url, is_active, created_at FROM users WHERE user_id = :id");
        $stmt->execute([':id' => $user_id]);
        $user = $stmt->fetch();
        
        sendSuccess(['user' => $user], 'Account created successfully');
        
    } catch (PDOException $e) {
        sendError('Signup failed: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

