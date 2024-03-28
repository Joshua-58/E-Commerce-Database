<?php
require 'database.php'; // Assuming you have a file to handle database connection

// Query all product listings from the database
$sql = "SELECT id, image, name, description, price, quantity FROM products";
$result = $mysqli->query($sql);

// Check for errors
if ($result === false) {
    // Query execution failed, send error response
    echo json_encode(['success' => false, 'message' => 'Failed to retrieve product listings']);
} else {
    // Fetch product listings and send success response
    $products = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'data' => $products]);
}

// Close database connection
$mysqli->close();
