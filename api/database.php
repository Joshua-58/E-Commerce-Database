<?php
require '../vendor/autoload.php'; // Include the Composer autoload file
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Establish MySQL database connection
$mysqli = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME'], $_ENV['DB_PORT']);

if ($mysqli->connect_error) {
    die ("Connection failed: " . $mysqli->connect_error);
}

