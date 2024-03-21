<?php
// Assign MySQL database connection details directly
$host = "b6jfzrhwaz71vzd6qlyw-mysql.services.clever-cloud.com";
$user = "uyjmoaoq0vr6bphn";
$password = "kgMsbcMnK4UlgbERm1cV";
$database = "b6jfzrhwaz71vzd6qlyw";
$port = 3306;

// MySQL database connection
$mysqli = new mysqli($host, $user, $password, $database, $port);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Register user
if (isset($_GET['register'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
}

// Login user
if (isset($_GET['login'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $loginData = $_POST;
        $username = $loginData['loginUsername'];
        $password = $loginData['loginPassword'];

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
}

// If no action specified or incorrect action, return error
echo json_encode(array('success' => false, 'message' => 'Invalid action'));
?>
