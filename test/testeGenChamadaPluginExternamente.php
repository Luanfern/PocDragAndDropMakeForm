<?php

require_once '../construct-pdf-editor/gen/construct-pdf-generator.php';

$caminhoArquivo = '../pdfSaves/argocorretorseguradoccc.json';
$jsonScaffold = file_get_contents($caminhoArquivo);

$requisicao = ["SEGURADORA_PRELIMINAR" => "ARGO", "SEGURADO_PRELIMINAR" => "Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa."];

$dt = date("Y/m/d");
$gg = new pdfGenerator("PDF-DIRECTA-PRELIMINAR-234322-".$dt,$requisicao, $jsonScaffold);
$gg->generate();

?>