<?php 
    $data = $_POST['objectString'];
    $name = $_POST['fileName'];
    $file = '../../words/' . $name . '.json';
    file_put_contents($file, $data);
    header('Location: ../');
?>