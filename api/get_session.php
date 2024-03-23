<?php
require './database.php';

session_start(); // Start session if not already started

$response = []; // Initialize response array

if (isset ($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    // Fetch user details from the database based on $userId
    $sql = "SELECT * FROM users WHERE id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response = ['success' => true, 'user' => $user]; // Update response array
    } else {
        $response = ['success' => false, 'message' => 'User not found']; // Update response array
    }
} else {
    $response = ['success' => false, 'message' => 'User not logged in']; // Update response array
}

// Output JSON response
header('Content-Type: application/json');
echo json_encode($response);
