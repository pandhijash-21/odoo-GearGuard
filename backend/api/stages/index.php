<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM request_stages ORDER BY sequence_no");
        $stages = $stmt->fetchAll();
        sendSuccess($stages);
    } catch (PDOException $e) {
        sendError('Failed to fetch stages: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

