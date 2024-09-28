<?php
require __DIR__ . "./dependencias/fpdf186/fpdf.php";

$requisicao = ["SEGURADORA_PRELIMINAR" => "ARGO", "SEGURADO_PRELIMINAR" => "Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa."];

$jsonScaffold = $_POST['jsonPdfScaffold'];
$jsonScaffold = json_decode($jsonScaffold);

/* echo '<pre>';
print_r($jsonScaffold);
exit; */

function hexToRgb($hex) {
    $hex = preg_replace("/[^0-9A-Fa-f]/", '', $hex);
    if (strlen($hex) != 6) {
        $hexa['r'] = 0;
        $hexa['g'] = 0;
        $hexa['b'] = 0;
        return $hex;
    }
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));
    $hexa['r'] = $r;
    $hexa['g'] = $g;
    $hexa['b'] = $b;
    return $hexa;
}

class PDF extends FPDF{
    //HEADER CARREGA ATRÀS DO CONTEÚDO
    /* function Header() {
        // Adiciona um fundo em todas as páginas
        $this->SetFillColor(33, 33, 33); // Cor do fundo (branco neste exemplo)
        $this->Rect(0, 0, $this->w, $this->h, 'F');
    } */

    public function Footer()
    {
        global $jsonScaffold;
        global $requisicao;

        foreach ($jsonScaffold->comuns as $key => $value) {

            if($value->elementType == 'Celula'){
                $this->SetY(-29.7 + $value->y);		
                $this->SetX($value->x);
                $hexaColor = hexToRgb($value->tcolor);
                $this->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $hexaColor = hexToRgb($value->bordercolor);
                $this->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $this->SetLineWidth(($value->borderwidth));
                $this->SetFont($value->tfont,$value->tweight,$value->tsize);
                $hexaColor = hexToRgb($value->bcolor);
                $this->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
                $this->Cell($value->width,$value->height,$vShow,$value->border,'0',$value->talign, true);
            } else if($value->elementType == 'MultiCelula'){
                $this->SetY(-29.7 + $value->y);		
                $this->SetX($value->x);
                $hexaColor = hexToRgb($value->tcolor);
                $this->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $hexaColor = hexToRgb($value->bordercolor);
                $this->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $this->SetLineWidth(($value->borderwidth));
                $this->SetFont($value->tfont,$value->tweight,$value->tsize);
                $hexaColor = hexToRgb($value->bcolor);
                $this->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
                $this->MultiCell($value->width,$value->height,$vShow,$value->border,$value->talign, true);
            } else if($value->elementType == 'ImageBuild') {
                $this->SetY(-29.7 + $value->y);	
                $vShow = ($value->informacaoExterna->url) ?? $value->text;
                $this->Image($vShow, $value->x, $value->y, $value->width * $value->proporcionalSize, $value->height* $value->proporcionalSize, $value->extensionImage);
            }
        }
    }
  
    public function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link=''){
             $txt = mb_convert_encoding($txt,"Windows-1252","UTF-8");
             parent::Cell($w, $h, $txt, $border, $ln, $align, $fill, $link);
     }


 }
//defininfo a fonte !
define('FPDF_FONTPATH','./dependencias/fpdf186/font/');
$pdf = new PDF("P","cm","A4");
//$qtdPages = count($jsonScaffold);
//$pdf->AliasNbPages("{$qtdPages}");
/* 
$pdf->AddPage();
    $pdf->SetAutoPageBreak(true);
    $pdf->SetMargins(0, 0, 0, 0);
    $pdf->SetY(25);		
    $pdf->SetX(5);
    $pdf->SetFont('Arial','',7);
    $pdf->SetFillColor('255', '255', '255');
    $pdf->MultiCell(5,0.6,'Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa.','B','0','J', true);
    //$pdf->Image('https://w7.pngwing.com/pngs/666/274/png-transparent-image-pictures-icon-photo-thumbnail.png', 5, 25, 10, 7.5, 'PNG');
    $pdf->SetFont('Arial','',7);
    $pdf->SetFillColor('255', '255', '255');
    $pdf->Cell(19, 15, 'Célula de Empurrar', 1, 1, 'L', true);
    $pdf->SetFillColor(200, 220, 255);
    $pdf->Cell(10, 5, 'Célula Maior', 1, 0, 'L', true);

    // Células menores à direita
    //$pdf->SetY($pdf->GetY() - 5); // Reposiciona na parte superior da célula maior
    $pdf->SetX(10); // Move para a direita
    $pdf->SetFillColor(255, 200, 200);
    $pdf->Cell(9, 1.75, 'Célula Menor 1', 1, 1, 'C', true);
    $pdf->SetX(10);
    $pdf->Cell(9, 1.75, 'Célula Menor 2', 1, 0, 'C', true);
    $pdf->SetX(10);
    $pdf->Cell(9, 1.75, 'Célula Menor 3', 1, 1, 'C', true);
    $pdf->SetX(10);
    $pdf->Cell(9, 1.75, 'Célula Menor 4', 1, 1, 'C', true);

    $pdf->SetFont('Arial','',7);
    $pdf->SetFillColor('255', '255', '255');
    $pdf->SetY(1);	
    $pdf->SetX(1);	
    $pdf->Cell(19,19,'ESPAÇO','BTLR','1','L');//saida		
    $pdf->MultiCell(10,0.4,'Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa.','BLRT','0','J', true);
    $pdf->SetY(1);	
    $pdf->SetX(11);	
	$pdf->Cell(9,0.35,'E-MAIL','T','1','L');//saida											
    $pdf->SetY(1.35);
    $pdf->SetX(11);	
    $pdf->Cell(9,0.35,'directasp@directasp.com.br','B','1','L');//saida	
    $pdf->SetY(1.70);
    $pdf->SetX(11);	
	$pdf->Cell(9,0.35,'CONTATO','T','1','L');//saida		
    $pdf->SetY(2.05);
    $pdf->SetX(11);	
    $pdf->Cell(9,0.35,'Flávio / Felipe','B','1','L');//saida									
    $pdf->SetY(2.40);
    $pdf->SetX(11);	
	$pdf->Cell(9,0.35,'TELEFONE','T','1','L');//saida																
    $pdf->SetY(2.75);
    $pdf->SetX(11);	
    $pdf->Cell(9,0.35,'(11)2741-9132','B','1','L');//saida	
   
    $pdf->Output("TESTE.pdf","I"); 
exit; */

//LOOP PAGES
$setYIntoSheet = false;
$yPage = 1000;

foreach ($jsonScaffold->componentes as $keyp => $valuep) {
    $cs = $keyp;

    //ADD OR NOT A PAGE
    foreach ($jsonScaffold->sheets as $key => $value) {
        if($value->id == $cs && $value->unionPreviousPage == 0){
            $pdf->AddPage();
            $pdf->SetMargins(3, 1, 1);
            $setYIntoSheet = false;
            $yPage = 1000;
        }
    }

    //LOOP COMPONENTS	
    foreach ($valuep[0] as $key => $value) {

        if($value->freeSheet == 0 && $setYIntoSheet == false){
            $pdf->SetY($value->y);
            if($yPage == 1000){
                $yPage = $value->y;
            } else {
                $pdf->SetY($yPage);
            }
            $setYIntoSheet = true;
        }

        //$pdf->SetAutoPageBreak(true, 1);
        //$pdf->SetMargins(0, 0, 0, 0);
        //$pdf->MultiCell($value->width,$value->height,'Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa.','B','0','J', true);
        //$pdf->Image('https://w7.pngwing.com/pngs/666/274/png-transparent-image-pictures-icon-photo-thumbnail.png', 2, 2, 100, 50, 'PNG');
            
        if($value->elementType == 'Celula'){
            if($value->freeSheet == 1){
                $pdf->SetY($value->y);
                $setYIntoSheet = false;
            }
            $pdf->SetX($value->x);
            $hexaColor = hexToRgb($value->tcolor);
            $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $hexaColor = hexToRgb($value->bordercolor);
            $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $pdf->SetLineWidth(($value->borderwidth));
            $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
            $hexaColor = hexToRgb($value->bcolor);
            $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
            $lastItm = $value->last;
            if(!isset($valuep[0][$key+1])){
                $lastItm = 1;
            }
            $pdf->Cell($value->width,$value->height,$vShow,$value->border,$lastItm,$value->talign, true);
        } else if($value->elementType == 'MultiCelula'){
            if($value->freeSheet == 1){
                $pdf->SetY($value->y);
                $setYIntoSheet = false;
            }
            $pdf->SetX($value->x);
            $hexaColor = hexToRgb($value->tcolor);
            $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $hexaColor = hexToRgb($value->bordercolor);
            $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $pdf->SetLineWidth(($value->borderwidth));
            $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
            $hexaColor = hexToRgb($value->bcolor);
            $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
            //$pdf->MultiCell($value->width,$value->height,$vShow,$value->border,'0',$value->talign, true);

            /* 
            Multicell são sempre last item
             */
            $pdf->MultiCell($value->width,$value->height,$vShow,$value->border,$value->talign, true);
        } else if($value->elementType == 'ImageBuild') {
            $vShow = ($value->informacaoExterna->url) ?? $value->text;
            $pdf->Image($vShow, $value->x, $value->y, $value->width * $value->proporcionalSize, $value->height* $value->proporcionalSize, $value->extensionImage);
        }
    }
}

$pdf->Output("TESTE.pdf","I");

exit;

/* $pdf->AddPage();
$pdf->SetMargins(3, 1, 1);
$pdf->SetY($jsonScaffold->componentes[0]->y);	
foreach ($jsonScaffold->componentes as $key => $value) {
    //$pdf->SetAutoPageBreak(true, 1);
    //$pdf->SetMargins(0, 0, 0, 0);
    //$pdf->MultiCell($value->width,$value->height,'Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa. Há um grande desejo em mim de sempre melhorar. Melhorar. É o que me faz feliz. E sempre que sinto que estou aprendendo menos, que a curva de aprendizado está nivelando, ou seja o que for, então não fico muito contente. E isso se aplica não só profissionalmente, como piloto, mas como pessoa.','B','0','J', true);
    //$pdf->Image('https://w7.pngwing.com/pngs/666/274/png-transparent-image-pictures-icon-photo-thumbnail.png', 2, 2, 100, 50, 'PNG');
        
        if($value->elementType == 'Cell'){
            //$pdf->SetY($value->y);		
            $pdf->SetX($value->x);
            $hexaColor = hexToRgb($value->tcolor);
            $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $hexaColor = hexToRgb($value->bordercolor);
            $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $pdf->SetLineWidth(($value->borderwidth));
            $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
            $hexaColor = hexToRgb($value->bcolor);
            $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
            $pdf->Cell($value->width,$value->height,$vShow,$value->border,$value->last,$value->talign, true);
        } else if($value->elementType == 'MultiCell'){
            //$pdf->SetY($value->y);		
            $pdf->SetX($value->x);
            $hexaColor = hexToRgb($value->tcolor);
            $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $hexaColor = hexToRgb($value->bordercolor);
            $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $pdf->SetLineWidth(($value->borderwidth));
            $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
            $hexaColor = hexToRgb($value->bcolor);
            $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
            $vShow = ($requisicao[$value->informacaoExterna]) ?? $value->text;
            //$pdf->MultiCell($value->width,$value->height,$vShow,$value->border,'0',$value->talign, true);
            $pdf->MultiCell($value->width,$value->height,$vShow,$value->border,$value->talign, true);
        } else if($value->elementType == 'ImageBuild') {
            $vShow = ($value->informacaoExterna->url) ?? $value->text;
            $pdf->Image($vShow, $value->x, $value->y, $value->width * $value->proporcionalSize, $value->height* $value->proporcionalSize, $value->extensionImage);
        }
    //$pdf->MultiCell(19,0.4,"DIRECTA TEXT!CURRICULUM VITAE  Eu já dei risada até a barriga doer, Já nadei até perder o fôlego, Já chorei até dormir E acordei com o rosto desfigurado. Já fiz cosquinha na minha irmã só pra ela parar de chorar, Já me queimei brincando com vela. Eu já fiz bola de chiclete e melequei todo o rosto. Já conversei com o espelho. E até já brinquei de ser bruxo. Já quis ser astronauta, Violonista, mágico, caçador e trapezista. Já me escondi atrás da cortina e esqueci os pés pra fora, Já passei trote por telefone, Já tomei banho de chuva, E acabei me viciando. Já roubei beijo, Já fiz confissões antes de dormir Num quarto escuro pro melhor amigo. Já confundi sentimentos, Peguei atalho errado E continuo andando pelo desconhecido. Já raspei o fundo da panela de arroz carreteiro, Já me cortei fazendo a barba apressado, Já chorei ouvindo música no ônibus. Já tentei esquecer algumas pessoas, Mas descobri que essas são as mais difíceis de se [esquecer. Já subi escondido no telhado pra tentar pegar estrelas, Já subi em árvore pra roubar fruta, Já caí da escada de bunda. Conheci a morte de perto, E agora anseio por viver cada dia. Já fiz juras eternas, Já escrevi no muro da escola, Já chorei sentado no chão do banheiro, Já fugi de casa pra sempre, E voltei no outro instante. Já saí pra caminhar sem rumo, Sem nada na cabeça, ouvindo estrelas. Já corri pra não deixar alguém chorando, Já fiquei sozinho no meio de mil pessoas Sentindo falta de uma só. Já vi pôr-do-sol cor-de-rosa e alaranjado, Já me joguei na piscina sem vontade de voltar, Já bebi uísque até sentir dormentes os meus lábios, Já olhei a cidade de cima E mesmo assim não encontrei meu lugar. Já senti medo do escuro, Já tremi de nervoso, Já quase morri de amor, Mas renasci novamente pro ver o sorriso de alguém [especial. Já acordei no meio da noite E fiquei com medo de levantar. Já apostei em correr descalço na rua, Já gritei de felicidade, Já roubei rosas num enorme jardim. Já me apaixonei e achei que era para sempre, Mas sempre era um \"para sempre\" pela metade. Já deitei na grama de madrugada E vi a Lua virar Sol, Já chorei por ver amigos partindo, Mas descobri que logo chegam novos, e a vida é mesmo um ir e vir sem razão. Foram tantas coisas feitas,DIRECTA TEXT!CURRICULUM VITAE  Eu já dei risada até a barriga doer, Já nadei até perder o fôlego, Já chorei até dormir E acordei com o rosto desfigurado. Já fiz cosquinha na minha irmã só pra ela parar de chorar, Já me queimei brincando com vela. Eu já fiz bola de chiclete e melequei todo o rosto. Já conversei com o espelho. E até já brinquei de ser bruxo. Já quis ser astronauta, Violonista, mágico, caçador e trapezista. Já me escondi atrás da cortina e esqueci os pés pra fora, Já passei trote por telefone, Já tomei banho de chuva, E acabei me viciando. Já roubei beijo, Já fiz confissões antes de dormir Num quarto escuro pro melhor amigo. Já confundi sentimentos, Peguei atalho errado E continuo andando pelo desconhecido. Já raspei o fundo da panela de arroz carreteiro, Já me cortei fazendo a barba apressado, Já chorei ouvindo música no ônibus. Já tentei esquecer algumas pessoas, Mas descobri que essas são as mais difíceis de se [esquecer. Já subi escondido no telhado pra tentar pegar estrelas, Já subi em árvore pra roubar fruta, Já caí da escada de bunda. Conheci a morte de perto, E agora anseio por viver cada dia. Já fiz juras eternas, Já escrevi no muro da escola, Já chorei sentado no chão do banheiro, Já fugi de casa pra sempre, E voltei no outro instante. Já saí pra caminhar sem rumo, Sem nada na cabeça, ouvindo estrelas. Já corri pra não deixar alguém chorando, Já fiquei sozinho no meio de mil pessoas Sentindo falta de uma só. Já vi pôr-do-sol cor-de-rosa e alaranjado, Já me joguei na piscina sem vontade de voltar, Já bebi uísque até sentir dormentes os meus lábios, Já olhei a cidade de cima E mesmo assim não encontrei meu lugar. Já senti medo do escuro, Já tremi de nervoso, Já quase morri de amor, Mas renasci novamente pro ver o sorriso de alguém [especial. Já acordei no meio da noite E fiquei com medo de levantar. Já apostei em correr descalço na rua, Já gritei de felicidade, Já roubei rosas num enorme jardim. Já me apaixonei e achei que era para sempre, Mas sempre era um \"para sempre\" pela metade. Já deitei na grama de madrugada E vi a Lua virar Sol, Já chorei por ver amigos partindo, Mas descobri que logo chegam novos, e a vida é mesmo um ir e vir sem razão. Foram tantas coisas feitas,DIRECTA TEXT!CURRICULUM VITAE  Eu já dei risada até a barriga doer, Já nadei até perder o fôlego, Já chorei até dormir E acordei com o rosto desfigurado. Já fiz cosquinha na minha irmã só pra ela parar de chorar, Já me queimei brincando com vela. Eu já fiz bola de chiclete e melequei todo o rosto. Já conversei com o espelho. E até já brinquei de ser bruxo. Já quis ser astronauta, Violonista, mágico, caçador e trapezista. Já me escondi atrás da cortina e esqueci os pés pra fora, Já passei trote por telefone, Já tomei banho de chuva, E acabei me viciando. Já roubei beijo, Já fiz confissões antes de dormir Num quarto escuro pro melhor amigo. Já confundi sentimentos, Peguei atalho errado E continuo andando pelo desconhecido. Já raspei o fundo da panela de arroz carreteiro, Já me cortei fazendo a barba apressado, Já chorei ouvindo música no ônibus. Já tentei esquecer algumas pessoas, Mas descobri que essas são as mais difíceis de se [esquecer. Já subi escondido no telhado pra tentar pegar estrelas, Já subi em árvore pra roubar fruta, Já caí da escada de bunda. Conheci a morte de perto, E agora anseio por viver cada dia. Já fiz juras eternas, Já escrevi no muro da escola, Já chorei sentado no chão do banheiro, Já fugi de casa pra sempre, E voltei no outro instante. Já saí pra caminhar sem rumo, Sem nada na cabeça, ouvindo estrelas. Já corri pra não deixar alguém chorando, Já fiquei sozinho no meio de mil pessoas Sentindo falta de uma só. Já vi pôr-do-sol cor-de-rosa e alaranjado, Já me joguei na piscina sem vontade de voltar, Já bebi uísque até sentir dormentes os meus lábios, Já olhei a cidade de cima E mesmo assim não encontrei meu lugar. Já senti medo do escuro, Já tremi de nervoso, Já quase morri de amor, Mas renasci novamente pro ver o sorriso de alguém [especial. Já acordei no meio da noite E fiquei com medo de levantar. Já apostei em correr descalço na rua, Já gritei de felicidade, Já roubei rosas num enorme jardim. Já me apaixonei e achei que era para sempre, Mas sempre era um \"para sempre\" pela metade. Já deitei na grama de madrugada E vi a Lua virar Sol, Já chorei por ver amigos partindo, Mas descobri que logo chegam novos, e a vida é mesmo um ir e vir sem razão. Foram tantas coisas feitas, novomC",$value->border,$value->talign, true);
}

$pdf->Output("TESTE.pdf","I");
 */
?>