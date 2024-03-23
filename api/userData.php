<?php
require './database.php'; // Assuming you have a file to handle database connection

// Check if the user is authenticated
if (!isset ($_SESSION['user_id'])) {
    // If not authenticated, send error response
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit; // Terminate script execution
}

// Extract user ID from session
$userId = $_SESSION['user_id'];

// Query user data from your database based on the userId
$sql = "SELECT username FROM users WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

// Check for errors or empty result
if ($result->num_rows === 0) {
    // User not found in database
    echo json_encode(['success' => false, 'message' => 'User not found']);
} else {
    // User found, fetch data and send success response
    $userData = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $userData]);
}

// Close database connection
$stmt->close();
$mysqli->close();
?>
