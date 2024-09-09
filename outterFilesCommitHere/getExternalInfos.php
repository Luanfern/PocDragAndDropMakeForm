<?php

//$ACAO = $_POST['ACAO'];
$ACAO = 1;
unset($_POST['ACAO']);
$FORM = $_POST;

$images[] = ["src"=>"https://img.freepik.com/fotos-premium/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg?w=2000", "url"=>"https://img.freepik.com/fotos-premium/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg"];
$images[] = ["src"=>"https://img.freepik.com/fotos-premium/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg?w=2000", "url"=>"https://img.freepik.com/fotos-premium/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg"];

$columns[] = ["key" => "ID_PRELIMINAR", "value" => "ID_PRELIMINAR"];
$columns[] = ["key" => "SEGURADORA_PRELIMINAR", "value" => "SEGURADORA_PRELIMINAR"];
$columns[] = ["key" => "SEGURADO_PRELIMINAR", "value" => "SEGURADO_PRELIMINAR"];
$columns[] = ["key" => "DATA_PRELIMINAR", "value" => "DATA_PRELIMINAR"];
$columns[] = ["key" => "LOCAL_PRELIMINAR", "value" => "ILOCAL_PRELIMINARD_PRELIMINAR"];

if($ACAO == 1){
    echo json_encode($images);
}


if($ACAO == 2){
    echo json_encode($columns);
}

?>