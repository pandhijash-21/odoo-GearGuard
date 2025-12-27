<?php
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM maintenance_teams ORDER BY team_name");
        $teams = $stmt->fetchAll();
        
        // Get member count for each team
        foreach ($teams as &$team) {
            $stmt = $conn->prepare("SELECT COUNT(*) as member_count FROM team_members WHERE team_id = :id");
            $stmt->execute([':id' => $team['team_id']]);
            $count = $stmt->fetch();
            $team['member_count'] = $count['member_count'] ?? 0;
        }
        
        sendSuccess($teams);
    } catch (PDOException $e) {
        sendError('Failed to fetch teams: ' . $e->getMessage(), 500);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO maintenance_teams (team_name, description) VALUES (:team_name, :description)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':team_name' => $data['team_name'] ?? null,
            ':description' => $data['description'] ?? null
        ]);
        
        $id = $conn->lastInsertId();
        sendSuccess(['id' => $id, 'team_id' => $id], 'Team created successfully');
    } catch (PDOException $e) {
        sendError('Failed to create team: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

