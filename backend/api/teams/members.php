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
$team_id = $_GET['team_id'] ?? null;

if ($method === 'GET') {
    try {
        if (!$team_id) {
            sendError('Team ID is required', 400);
        }

        $sql = "SELECT u.user_id, u.full_name, u.email, u.role, u.avatar_url
                FROM users u
                INNER JOIN team_members tm ON u.user_id = tm.user_id
                WHERE tm.team_id = :team_id
                ORDER BY u.full_name";

        $stmt = $conn->prepare($sql);
        $stmt->execute([':team_id' => $team_id]);
        $members = $stmt->fetchAll();

        sendSuccess($members);
    } catch (PDOException $e) {
        sendError('Failed to fetch team members: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

