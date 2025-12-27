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

if ($method === 'DELETE' || $method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        $team_id = $data['team_id'] ?? null;

        if (!$team_id) {
            sendError('Team ID is required', 400);
        }

        // Check if team exists
        $checkSql = "SELECT COUNT(*) as count FROM maintenance_teams WHERE team_id = :team_id";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->execute([':team_id' => $team_id]);
        $result = $checkStmt->fetch();

        if ($result['count'] == 0) {
            sendError('Team not found', 404);
        }

        // Delete team members first (foreign key constraint)
        $deleteMembersSql = "DELETE FROM team_members WHERE team_id = :team_id";
        $deleteMembersStmt = $conn->prepare($deleteMembersSql);
        $deleteMembersStmt->execute([':team_id' => $team_id]);

        // Delete the team
        $deleteTeamSql = "DELETE FROM maintenance_teams WHERE team_id = :team_id";
        $deleteTeamStmt = $conn->prepare($deleteTeamSql);
        $deleteTeamStmt->execute([':team_id' => $team_id]);

        sendSuccess(['message' => 'Team deleted successfully'], 'Team deleted successfully');
    } catch (PDOException $e) {
        sendError('Failed to delete team: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>