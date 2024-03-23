<?php
require './database.php';

// Endpoint for fetching user's cart items
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Implement the logic to fetch the user's cart items from the database
    $sql = "
        SELECT c.product_id, p.image, p.name, p.price, c.quantity
        FROM cart c
        INNER JOIN products p ON c.product_id = p.id
    ";

    $result = $mysqli->query($sql);

    if ($result) {
        $cartItems = array();
        while ($row = $result->fetch_assoc()) {
            $cartItems[] = $row;
        }

        echo json_encode(array('success' => true, 'data' => $cartItems));
        exit;
    } else {
        echo json_encode(array('success' => false, 'message' => 'Failed to fetch cart items'));
        exit;
    }
} else {
    // Invalid HTTP method
    echo json_encode(array('success' => false, 'message' => 'Invalid HTTP method'));
    exit;
}