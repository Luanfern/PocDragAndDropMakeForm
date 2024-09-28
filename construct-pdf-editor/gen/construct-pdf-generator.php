<?php
require __DIR__ . DIRECTORY_SEPARATOR."../dependencias/fpdf186/fpdf.php";
//defininfo a fonte !
define('FPDF_FONTPATH','../dependencias/fpdf186/font/');

class pdfGenerator extends FPDF{

    public $fieldsValue;
    public $jsonScaffold;
    public $nameFile;

    public function __construct($nameFile = 'DIRECTA_PDF', $fieldsValue, $jsonScaffold, $orientation='P', $unit='mm', $size='A4') {
        parent::__construct($orientation, $unit, $size);
        $this->fieldsValue = $fieldsValue;
        $this->jsonScaffold = json_decode($jsonScaffold);
        $vp = explode('.',$nameFile);
        if(count($vp) > 1) {
            $this->nameFile = $vp[0];
        } else {
            $this->nameFile = $nameFile;
        }
    }

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

    public function Footer()
    {
        if($this->jsonScaffold == null) return;

        foreach ($this->jsonScaffold->comuns as $key => $value) {

            if($value->elementType == 'Celula'){
                $this->SetY(-29.7 + $value->y);		
                $this->SetX($value->x);
                $hexaColor = $this->hexToRgb($value->tcolor);
                $this->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $hexaColor = $this->hexToRgb($value->bordercolor);
                $this->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $this->SetLineWidth(($value->borderwidth));
                $this->SetFont($value->tfont,$value->tweight,$value->tsize);
                $hexaColor = $this->hexToRgb($value->bcolor);
                $this->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $vShow = ($this->fieldsValue[$value->informacaoExterna]) ?? $value->text;
                $this->Cell($value->width,$value->height,$vShow,$value->border,'0',$value->talign, true);
            } else if($value->elementType == 'MultiCelula'){
                $this->SetY(-29.7 + $value->y);		
                $this->SetX($value->x);
                $hexaColor = $this->hexToRgb($value->tcolor);
                $this->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $hexaColor = $this->hexToRgb($value->bordercolor);
                $this->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $this->SetLineWidth(($value->borderwidth));
                $this->SetFont($value->tfont,$value->tweight,$value->tsize);
                $hexaColor = $this->hexToRgb($value->bcolor);
                $this->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                $vShow = ($this->fieldsValue[$value->informacaoExterna]) ?? $value->text;
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

     public function generate(){
        $pdf = new pdfGenerator($this->nameFile, $this->fieldsValue, json_encode($this->jsonScaffold), "P","cm","A4");
        //LOOP PAGES
        $setYIntoSheet = false;
        $yPage = 1000;
        
        if(isset($this->jsonScaffold->componentes)) {
            foreach ($this->jsonScaffold->componentes as $keyp => $valuep) {
                $cs = $keyp;
            
                //ADD OR NOT A PAGE
                foreach ($this->jsonScaffold->sheets as $key => $value) {
                    if($value->id == $cs && $value->unionPreviousPage == 0){
                        $pdf->AddPage('', '', 0);
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
                        
                    if($value->elementType == 'Celula'){
                        if($value->freeSheet == 1){
                            $pdf->SetY($value->y);
                            $setYIntoSheet = false;
                        }
                        $pdf->SetX($value->x);
                        $hexaColor = $this->hexToRgb($value->tcolor);
                        $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $hexaColor = $this->hexToRgb($value->bordercolor);
                        $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $pdf->SetLineWidth(($value->borderwidth));
                        $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
                        $hexaColor = $this->hexToRgb($value->bcolor);
                        $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $vShow = ($this->fieldsValue[$value->informacaoExterna]) ?? $value->text;
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
                        $hexaColor = $this->hexToRgb($value->tcolor);
                        $pdf->SetTextColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $hexaColor = $this->hexToRgb($value->bordercolor);
                        $pdf->SetDrawColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $pdf->SetLineWidth(($value->borderwidth));
                        $pdf->SetFont($value->tfont,$value->tweight,$value->tsize);
                        $hexaColor = $this->hexToRgb($value->bcolor);
                        $pdf->SetFillColor($hexaColor['r'],$hexaColor['g'],$hexaColor['b']);
                        $vShow = ($this->fieldsValue[$value->informacaoExterna]) ?? $value->text;
                    
                        /* 
                        Multicell são sempre last item
                        */
                        $pdf->MultiCell($value->width,$value->height,$vShow,$value->border,$value->talign, true);
                    } else if($value->elementType == 'ImageBuild') {
                        $vShow = ($value->informacaoExterna->url) ?? $value->text;
                        try {
                            $pdf->Image($vShow, $value->x, $value->y, $value->width, $value->height, $value->extensionImage);
                        } catch (\Throwable $th) {
                            print_r($th);
                            exit;
                        }
                    }
                }
            }
        }
        
        $pdf->Output($this->nameFile.".pdf","I", false);
        
        exit;
    }

}
?>