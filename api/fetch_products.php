<?php
require './database.php';

// Endpoint to fetch all products
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query all products with user information, including quantity
    $sql = "SELECT p.id, p.image, p.name, p.description, p.price, p.quantity, u.username
            FROM products p
            INNER JOIN users u ON p.user_id = u.id";
    $result = $mysqli->query($sql);

    $products = array();
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode(array('success' => true, 'data' => $products));
    exit;
}

