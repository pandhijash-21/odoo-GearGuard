<?php
// Simple test endpoint to check if backend is accessible
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

echo json_encode([
    'success' => true,
    'message' => 'Backend is accessible!',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>

