<?php
require './database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset ($_POST['loginUsername'], $_POST['loginPassword'])) {
    $username = $_POST['loginUsername'];
    $password = $_POST['loginPassword'];

    $sql = "SELECT id FROM users WHERE username = ? AND password = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $response = array('success' => true, 'message' => 'Login successful');
    } else {
        $response = array('success' => false, 'message' => 'Invalid username or password');
    }
    echo json_encode($response);
    exit;
}