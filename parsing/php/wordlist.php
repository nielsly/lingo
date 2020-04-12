<?php
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['wordlist'])){
    $data = file_get_contents('../../words/' . $_POST['wordlist'] . '.txt');
    $arr = array();
    preg_match_all('/\b[A-z]{5,14}\b/', $data, $arr);

    $arr = array_unique($arr[0], SORT_REGULAR);
    sort($arr);

    $a5 = array();
    $a6 = array();
    $a7 = array();
    $a8 = array();
    $a9 = array();

    foreach ($arr as $k => $str) {
        $str = strtoupper($str);
        $split = str_split($str);
        $len = strlen($str);
        $ij = 0;
        for ($i = 1; $i < $len; $i++) { 
            if($split[$i-1] == I && $split[$i] == J) {
                $ij++;
            }
        };
        $len -= $ij;
        if ($len > 4 && $len < 10) {
            switch ($len) {
                case 5:
                    $a5[$str] = $str;
                    break;
                
                case 6:
                    $a6[$str] = $str;
                    break;
                
                case 7:
                    $a7[$str] = $str;
                    break;
                
                case 8:
                    $a8[$str] = $str;
                    break;
                
                case 9:
                    $a9[$str] = $str;
                    break;
                    
                default:
                    break;
            }
        }
    }

    $s5 = json_encode($a5);
    $s6 = json_encode($a6);
    $s7 = json_encode($a7);
    $s8 = json_encode($a8);
    $s9 = json_encode($a9);

    file_put_contents('../../words/5.json', $s5);
    file_put_contents('../../words/6.json', $s6);
    file_put_contents('../../words/7.json', $s7);
    file_put_contents('../../words/8.json', $s8);
    file_put_contents('../../words/9.json', $s9);
}
header('Location: ../');
?>