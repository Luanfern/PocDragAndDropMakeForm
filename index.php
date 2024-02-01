<?php
if(isset($_GET['FILE']) && !empty($_GET['FILE'])){
  $FILE = $_GET['FILE'];
} else {
  $FILE = 0;
}
?>

<!doctype html>
<html lang="">

<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="css/editor.css">
  <link rel="stylesheet" href="css/inputs.css">
  <link rel="stylesheet" href="css/modal.css">
  <link rel="stylesheet" href="css/overlay.css">


  <meta name="theme-color" content="#fafafa">
</head>

<body>

  <div id="editor">
    <section id="menu">

      <div class="left">
        <div id="pagesList" class="btnMenu">Páginas</div>
        <di id="dropDownElements">
          <div class="lineElementClick">
            <div id="elements" class="btnMenu" onclick="elementsDropDown()">Elementos &#8595;</div>
            <div id="currentElement" class="btnMenu"> - - </div>
          </div>
          <div id="myDropDownElements" class="myDropDownElementsContent">
          </div>
        </di>
        <div id="handleElements" class="btnMenu">&#128432;</div>
      </div>
      <div class="center">
        <input type="text" value="PDFDIRECTA">
        <div id="salvarNome" class="btnMenu">&#9998;</div>
      </div>
      <div class="right">
        <div id="newPage" class="btnMenu">&#43; Página</div>
        <div id="config" class="btnMenu">&#9881;</div>
        <div id="publish" class="save btnMenu">Salvar</div>
        <div id="publish" class="gen btnMenu">Gerar PDF</div>
      </div>
    </section>
    <section id="viewManager">
      <div id="listElements">
        <div class="openArea">&rarr;</div>
        <div class="headerTopAux">
          <div class="closeArea">&times;</div>
          <p>Seus Elementos</p>
        </div>
        <div class="contentAUX">
        </div>
      </div>
      <div id="listSheets" class="">
        <div class="headerTopAux">
          <p>Páginas</p>
        </div>
      </div>
      <div id="zoomActions" class="">
        <div class="zoomValue">100%</div>
        <div class="controls">
          <div class="moreZoom">
            <span>+</span> &#x1F50D;
          </div>
          <div class="lessZoom">
            &#x1F50E; <span>-</span>
          </div>
        </div>
      </div>
      <div id="configSheet">
        <div class="openArea">&larr;</div>
        <div class="headerTopAux">
          <div class="closeArea">&times;</div>
          <p class="currentElement">Sem Elemento...</p>
        </div>
        <div class="contentAUX">
        </div>
      </div>
    </section>
  </div>

  <div id="backgroundManager"></div>

  <div id="myModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="title">CONFIGURAÇÕES PADRÃO DO PROJETO:</div>
        <p class="close">&times;</p>
      </div>
      <p style="font-size: 9px; margin-bottom:10px; border: 1px solid red; padding: 4px; border-radius: 3px;">Essas configurações serão aplicadas somente na criação de uma nova página. Após a criação da página, é impossível a alteração da margem!</p>
      <div class="configsContents">
        <div class="left">
          <div class="sectionConfig">
            <div class="subtitle">Margem padrão:</div>
            <div class="inp">
              <span>TOPO:</span>
              <input type="number" name="verticalMT" id="verticalMT" step="0.5" max="30" value=3.5>
            </div>
            <div class="inp">
              <span>RODAPÉ:</span>
              <input type="number" name="verticalMR" id="verticalMR" step="0.5" max="30" value=1.0>
            </div>
            <div class="inp">
              <span>ESQUERDA:</span>
              <input type="number" name="horizontalME" id="horizontalME" step="0.5" max="30" value=1.0>
            </div>
            <div class="inp">
              <span>DIREITA:</span>
              <input type="number" name="horizontalMD" id="horizontalMD" step="0.5" max="21" value=1.0>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="sectionConfig">
          <p style="font-size: 11px; color:red;">Mais opções em Breve...</p>
          </div>
        </div>
      </div>
      <div class="btnapply">Aplicar</div>
    </div>

  </div>

  <div id="overlay" class="overlay">
    <div class="loader"></div>
  </div>
  <script>
    const fileName = '<?=$FILE?>';
  </script>
  <script src="js/main.js"></script>
  <script src="js/generatePDF.js"></script>
  <script src="js/managePDF.js"></script>
  <script src="js/getExternalInformations.js"></script>
</body>

</html>
