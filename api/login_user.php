<?php
session_start(); // Start or resume the session

require './database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset ($_POST['loginUsername'], $_POST['loginPassword'])) {
    $username = $_POST['loginUsername'];
    $password = $_POST['loginPassword'];

    $sql = "SELECT id, username FROM users WHERE username = ? AND password = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // User credentials are correct, store user data in session
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        $response = array('success' => true, 'message' => 'Login successful');
    } else {
        $response = array('success' => false, 'message' => 'Invalid username or password');
    }
    echo json_encode($response);
    exit;
}
