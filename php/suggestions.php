<?php
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['suggestion'])){
    $suggestions = '';
    $size = $_POST['size'];

    foreach ($_POST['suggestion'] as $key => $value) {
        echo $key . ' ' . $value;
        $suggestions .= "\r\n" . $value;
    }

    file_put_contents('../suggestions/' . $size . '.txt', $suggestions, FILE_APPEND | LOCK_EX);
}

header('Location: ../');
?>