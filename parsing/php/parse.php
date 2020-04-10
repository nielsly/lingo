<?php 
    $data = $_POST['objectString'];
    $name = $_POST['fileName'];
    $file = '../../words/' + $fileName + '.json';
    file_put_contents($file, $data);
?>