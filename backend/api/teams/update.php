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

if ($method === 'PUT' || $method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        $team_id = $data['team_id'] ?? null;
        $team_name = $data['team_name'] ?? null;
        $description = $data['description'] ?? null;

        if (!$team_id || !$team_name) {
            sendError('Team ID and Team Name are required', 400);
        }

        // Check if team exists
        $checkSql = "SELECT COUNT(*) as count FROM maintenance_teams WHERE team_id = :team_id";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->execute([':team_id' => $team_id]);
        $result = $checkStmt->fetch();

        if ($result['count'] == 0) {
            sendError('Team not found', 404);
        }

        // Update the team
        $updateSql = "UPDATE maintenance_teams SET team_name = :team_name, description = :description WHERE team_id = :team_id";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->execute([
            ':team_id' => $team_id,
            ':team_name' => $team_name,
            ':description' => $description
        ]);

        sendSuccess(['message' => 'Team updated successfully'], 'Team updated successfully');
    } catch (PDOException $e) {
        sendError('Failed to update team: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>