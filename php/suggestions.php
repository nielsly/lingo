<?php
$suggestions = '';
$size = $_POST['size'];
foreach ($_POST['suggestion'] as $key => $value) {
    $suggestions .= "\r\n" . value;
}
file_put_contents('../suggestions/' . $size, $suggestions, FILE_APPEND | LOCK_EX);
header('../');
?>