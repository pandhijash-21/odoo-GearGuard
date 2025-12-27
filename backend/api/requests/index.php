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

if ($method === 'GET') {
    try {
        // Get user info from token (simple decode - in production use JWT)
        $user_id = null;
        $user_role = null;
        
        // Get Authorization header - try multiple methods
        $authHeader = '';
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }
        if (empty($authHeader)) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        }
        
        // Extract token (remove "Bearer " prefix if present)
        $token = preg_replace('/^Bearer\s+/i', '', trim($authHeader));
        
        if ($token) {
            $decoded = json_decode(base64_decode($token), true);
            if ($decoded && isset($decoded['user_id'])) {
                $user_id = (int)$decoded['user_id'];
                $user_role = strtolower(trim($decoded['role'] ?? ''));
            }
        }
        
        $stage = $_GET['stage'] ?? null;
        $equipment_id = $_GET['equipment_id'] ?? null;
        $team_id = $_GET['team_id'] ?? null;
        
        $sql = "SELECT mr.*, 
                e.equipment_name, e.serial_number, e.location as equipment_location,
                rs.stage_name,
                mt.team_name,
                u1.full_name as assigned_to_name, u1.avatar_url as assigned_to_avatar, u1.email as assigned_to_email,
                u2.full_name as created_by_name, u2.email as created_by_email
                FROM maintenance_requests mr
                LEFT JOIN equipment e ON mr.equipment_id = e.equipment_id
                LEFT JOIN request_stages rs ON mr.stage_id = rs.stage_id
                LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.team_id
                LEFT JOIN users u1 ON mr.assigned_to = u1.user_id
                LEFT JOIN users u2 ON mr.created_by = u2.user_id
                WHERE 1=1";
        
        $params = [];
        
        // Role-based filtering
        if ($user_role === 'technician' && $user_id) {
            // Technicians only see requests assigned to them (assigned_to must match user_id and not be NULL)
            $sql .= " AND mr.assigned_to = :tech_user_id AND mr.assigned_to IS NOT NULL";
            $params[':tech_user_id'] = $user_id;
        } elseif ($user_role === 'employee' && $user_id) {
            // Employees only see requests they created
            $sql .= " AND mr.created_by = :emp_user_id";
            $params[':emp_user_id'] = $user_id;
        }
        // Admin and Manager see all requests (no filter)
        
        if ($stage) {
            $sql .= " AND rs.stage_name = :stage";
            $params[':stage'] = $stage;
        }
        if ($equipment_id) {
            $sql .= " AND mr.equipment_id = :equipment_id";
            $params[':equipment_id'] = $equipment_id;
        }
        if ($team_id) {
            $sql .= " AND mr.maintenance_team_id = :team_id";
            $params[':team_id'] = $team_id;
        }
        
        $sql .= " ORDER BY mr.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $requests = $stmt->fetchAll();
        
        sendSuccess($requests);
    } catch (PDOException $e) {
        sendError('Failed to fetch requests: ' . $e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>

