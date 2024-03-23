<?php
//DO NOT USE THIS FILE 



require 'vendor/autoload.php'; // Include the Composer autoload file

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// MySQL database connection
$mysqli = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME'], $_ENV['DB_PORT']);

if ($mysqli->connect_error) {
    die ("Connection failed: " . $mysqli->connect_error);
}

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

// Login user
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

// API endpoint for listing products
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset ($_POST['name'], $_POST['description'], $_POST['price'], $_POST['image'], $_POST['quantity'])) {
    // Retrieve product data from the request
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $image = $_POST['image'];
    $quantity = $_POST['quantity'];

    // Insert the product into the database
    $stmt = $mysqli->prepare("INSERT INTO products (image, name, description, price, quantity) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $image, $name, $description, $price, $quantity);
    if ($stmt->execute()) {
        $response = array('success' => true, 'message' => 'Product listed successfully');
    } else {
        $response = array('success' => false, 'message' => 'Product listing failed');
    }
    echo json_encode($response);
    exit;
}

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


// If no action specified or incorrect action, return error
echo json_encode(array('success' => false, 'message' => 'Invalid action'));
?>
