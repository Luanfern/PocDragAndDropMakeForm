<?php

$json = file_get_contents('php://input');
$data = json_decode($json);

$FILE = $data->FILE;
$ACAO = $data->ACAO;
unset($data->ACAO);
$FORM = $data;

if($ACAO == 1){
    $path = './pdfSaves/'.$FILE.'.json';
    $jsonString = json_encode($FORM, JSON_PRETTY_PRINT);
    $fp = fopen($path, 'w');
    fwrite($fp, $jsonString);
    fclose($fp);
    print_r('SAVED!');
}

if($ACAO == 2){
    $path = './pdfSaves/'.$FILE.'.json';
    if(file_exists($path)){
        $jsonString = file_get_contents($path);
        print_r($jsonString);
    } else{
        print_r('');
        exit;
    }
}

?>