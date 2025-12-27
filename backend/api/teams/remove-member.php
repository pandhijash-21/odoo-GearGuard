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

        $team_id = $data['team_id'] ?? null;
        $user_id = $data['user_id'] ?? null;

        if (!$team_id || !$user_id) {
            sendError('Team ID and User ID are required', 400);
        }

        // Check if member exists
        $checkSql = "SELECT COUNT(*) as count FROM team_members WHERE team_id = :team_id AND user_id = :user_id";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->execute([
            ':team_id' => $team_id,
            ':user_id' => $user_id
        ]);
        $result = $checkStmt->fetch();

        if ($result['count'] == 0) {
            sendError('User is not a member of this team', 400);
        }

        // Remove member from team
        $sql = "DELETE FROM team_members WHERE team_id = :team_id AND user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':team_id' => $team_id,
            ':user_id' => $user_id
        ]);

        sendSuccess(['message' => 'Member removed successfully'], 'Member removed successfully');
    } catch (PDOException $e) {
        sendError('Failed to remove member: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>