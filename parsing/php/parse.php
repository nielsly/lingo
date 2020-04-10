<?php 
    $data = $_POST['jsonString'];
    $name = $_POST['fileName'];
    $file = "../words/" + $fileName + ".json"
    //set mode of file to writable.
    chmod($file, 0777);
    $f = fopen($file, "w+") or die("fopen failed");
    fwrite($f, $data);
    fclose($f);
?>