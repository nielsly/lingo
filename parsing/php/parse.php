<?php 
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['objectString']) && isset($_POST['fileName'])){
    $data = $_POST['objectString'];
    $name = $_POST['fileName'];
    $file = '../../words/' . $name . '.json';
    file_put_contents($file, $data);
}
header('Location: ../');
?>