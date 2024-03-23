<?php
require './database.php';

// Register user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset ($_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['username'], $_POST['password'], $_POST['street'], $_POST['zipCode'], $_POST['state'])) {
    $userData = $_POST;

    $sql = "INSERT INTO users (first_name, last_name, email, username, password, street, zip_code, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ssssssss", $userData['firstName'], $userData['lastName'], $userData['email'], $userData['username'], $userData['password'], $userData['street'], $userData['zipCode'], $userData['state']);
    if ($stmt->execute()) {
        $response = array('success' => true, 'message' => 'Registration successful');
    } else {
        $response = array('success' => false, 'message' => 'Registration failed');
    }
    echo json_encode($response);
    exit;
}