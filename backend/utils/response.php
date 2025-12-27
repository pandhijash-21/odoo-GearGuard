<?php
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

function sendSuccess($data = null, $message = 'Success') {
    $response = ['success' => true, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    sendResponse($response, 200);
}
?>

