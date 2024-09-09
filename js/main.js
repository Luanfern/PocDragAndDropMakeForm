//FIXED VARIABLES

const viewManager = document.querySelector('#viewManager');
const newPageButton = document.querySelector("#newPage");
const saveNameButton = document.querySelector("#salvarNome");
const pagesListButton = document.querySelector("#pagesList");
const elementsButton = document.querySelector("#elements");
const listSheetsArea = document.querySelector("#listSheets");
const listElementsArea = document.querySelector("#listElements");
const configSheetArea = document.querySelector("#configSheet");
const closeAreas = document.querySelectorAll('.closeArea');
const openAreas = document.querySelectorAll('.openArea');
const elementsdropdown = document.querySelector('#myDropDownElements');
const zoomActions = document.querySelector('#zoomActions');

// -- modal
var modal = document.getElementById("myModal");
var configbtn = document.getElementById("config");
var span = document.getElementsByClassName("close")[0];
var btnapply = document.getElementsByClassName("btnapply")[0];

listFontes = [{
    "key": "Arial",
    "value": "Arial"
  },
  {
    "key": "Helvetica",
    "value": "Helvetica"
  },
  {
    "key": "Times New Roman",
    "value": "Times New Roman"
  },
  {
    "key": "Courier",
    "value": "Courier"
  },
  {
    "key": "Courier New",
    "value": "Courier New"
  },
  {
    "key": "Verdana",
    "value": "Verdana"
  },
  {
    "key": "Georgia",
    "value": "Georgia"
  },
  {
    "key": "Comic Sans MS",
    "value": "Comic Sans MS"
  },
  {
    "key": "Impact",
    "value": "Impact"
  },
  {
    "key": "Trebuchet MS",
    "value": "Trebuchet MS"
  },
  {
    "key": "Palatino",
    "value": "Palatino"
  },
  {
    "key": "Garamond",
    "value": "Garamond"
  },
  {
    "key": "Book Antiqua",
    "value": "Book Antiqua"
  },
  {
    "key": "Arial Narrow",
    "value": "Arial Narrow"
  },
  {
    "key": "Arial Black",
    "value": "Arial Black"
  },
  {
    "key": "Palatino Linotype",
    "value": "Palatino Linotype"
  },
  {
    "key": "Lucida Sans Unicode",
    "value": "Lucida Sans Unicode"
  },
  {
    "key": "Lucida Console",
    "value": "Lucida Console"
  },
  {
    "key": "Franklin Gothic Medium",
    "value": "Franklin Gothic Medium"
  }
]

tttBordasOpcoesPDF = [{
    "value": "Margem na base",
    "key": "B"
  },
  {
    "value": "Margem no topo",
    "key": "T"
  },
  {
    "value": "Margem à esquerda",
    "key": "L"
  },
  {
    "value": "Margem à direita",
    "key": "R"
  },
  {
    "value": "...",
    "key": "Possível usar mais de um por vez"
  }
];

listalinhamentoTextPDF = [{
    "key": "C",
    "value": "centro"
  },
  {
    "key": "L",
    "value": "esquerda"
  },
  {
    "key": "R",
    "value": "direita"
  },
  {
    "key": "J",
    "value": "justificado - *Multicell*"
  }
];

tttestiloTextPDF = [{
    "value": "Texto Sublinhado",
    "key": "U"
  },
  {
    "value": "Texto Negrito",
    "key": "B"
  },
  {
    "value": "Texto Italico",
    "key": "I"
  },
  {
    "value": "...",
    "key": "Possível usar mais de um por vez"
  }
];

const sideChars = {
  "B": 'borderBottom',
  "L": 'borderLeft',
  "R": 'borderRight',
  "T": 'borderTop'
}

const alignText = {
  "C": "center",
  "L": "left",
  "R": "right"
}

const weightText = {
  "U": "underline",
  "B": "bold",
  "I": "italic"
}

//MAIN SYSTEM EDITOR PDF

class PdfEditor{

  listFieldsPDF = [];
  listImagesPDF = [];
  defaultConfigurations = {
    zoom: {
      x: 210,
      y: 297
    },
    zoomPctg: 1.0,
    margens: {
      "top": 3,
      "bottom": 1,
      "left": 1,
      "right": 1
    }
  }
  templateModelBackground = null;
  modalConfId = null;
  shiftPressed = false;
  ctrlPressed = false;
  elementos = []
  incrementPageId = 1;
  currentElement = null;
  selectedGroupComponentsProvSquare = {
    x: 21,
    y: 29,
    w: 0,
    h: 0,
    moving: false,
    draw: {
      x: 0,
      y: 0
    }
  };
  selectedGroupComponents = [];
  selectedComponent = {
    np: null,
    el: {
      id: null
    }
  };
  mousePositionPage = {
    x: 0,
    y: 0
  }
  cntrCGroupComponent = {
    np: null,
    el: []
  };
  cntrCComponent = {
    np: null,
    el: {
      id: null
    }
  };
  selectedComponentAnchorMove = null;
  currentAction = null;
  currentPage = null;
  sheets = [];
  comumComponents = [];
  
  constructor(config, onSave, getJson, getImages, getFields) {
    this.config = config;
    this.onSave = onSave;
    this.getJson = getJson;
    this.getImages = getImages;
    this.getFields = getFields;
  }

  controlsEditor(){

    //MODAL CONTROLLS
    configbtn.addEventListener('click', function (e) {
      document.getElementById('verticalMT').value = this.defaultConfigurations.margens.top;
      document.getElementById('verticalMR').value = this.defaultConfigurations.margens.bottom;
      document.getElementById('horizontalME').value = this.defaultConfigurations.margens.left;
      document.getElementById('horizontalMD').value = this.defaultConfigurations.margens.right;
      modal.style.display = "block";
    });
    
    span.onclick = function () {
      modal.style.display = "none";
      document.getElementById('verticalMT').value = this.defaultConfigurations.margens.top;
      document.getElementById('verticalMR').value = this.defaultConfigurations.margens.bottom;
      document.getElementById('horizontalME').value = this.defaultConfigurations.margens.left;
      document.getElementById('horizontalMD').value = this.defaultConfigurations.margens.right;
    }
    btnapply.onclick = function () {
      modal.style.display = "none";
      this.defaultConfigurations.margens.top = document.getElementById('verticalMT').value;
      this.defaultConfigurations.margens.bottom = document.getElementById('verticalMR').value;
      this.defaultConfigurations.margens.left = document.getElementById('horizontalME').value;
      this.defaultConfigurations.margens.right = document.getElementById('horizontalMD').value;
    
      if(document.querySelector("#templatemodelbackgroundBTN").files[0] != undefined){
        
        const reader = new FileReader();
        reader.onload = function(e) {
          const url = e.target.result;
          this.templateModelBackground = `url('${url}')`;
          this.sheets.forEach(s => s.setBackgroundImageTemplate());
        };
        reader.readAsDataURL(document.querySelector("#templatemodelbackgroundBTN").files[0]);
    
      } else if(document.querySelector("#templatemodelbackgroundTEXT").value != ''||document.querySelector("#templatemodelbackgroundTEXT").value != null || document.querySelector("#templatemodelbackgroundTEXT").value != undefined) {
        const url = document.querySelector("#templatemodelbackgroundTEXT").value;
        this.templateModelBackground = `url('${url}')`;
        this.sheets.forEach(s => s.setBackgroundImageTemplate());
      } else {
        this.templateModelBackground = null;
        this.sheets.forEach(s => s.setBackgroundImageTemplate());
      }
    
    }
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    //SCROLL ACTIONS
    viewManager.addEventListener('wheel', this.sheetpredominante);


    //KEYBOARD ACTIONS
    window.addEventListener('keydown', function(event) {  
      if ((event.key === 'Z' || event.key === 'z') && (event.ctrlKey || event.metaKey)) {
          if(this.selectedComponent.el != null){
            this.selectedComponent.el.rollback();
          }
      }

      if ((event.key === 'C' || event.key === 'c') && (event.ctrlKey || event.metaKey)) {
        if(this.selectedGroupComponents.length > 0){
          this.cntrCGroupComponent.el = this.selectedGroupComponents;
          this.cntrCGroupComponent.np = this.currentPage ?? this.selectedGroupComponents[0].sheet.id;
        } else {
          if(this.selectedComponent.el != null){
            this.cntrCComponent.el = this.selectedComponent.el;
            this.cntrCComponent.np = this.selectedComponent.np;
          }
        }
      }

      if ((event.key === 'V' || event.key === 'v') && (event.ctrlKey || event.metaKey)) {
        if(this.cntrCGroupComponent.el.length > 0){
          let content = this.cntrCGroupComponent.np.selfReference.querySelector('.content');
          let fp = content.querySelector('.flutpoint');
          if(fp != null){
            if((parseFloat(fp.style.width) / this.cntrCGroupComponent.np.wcm) >= ((this.cntrCGroupComponent.np.width - ((this.cntrCGroupComponent.np.margem.left + this.cntrCGroupComponent.np.margem.right)  / this.cntrCGroupComponent.np.wcm))*0.75)){
              fp.style.top = Number((this.mousePositionPage.y * this.cntrCGroupComponent.np.hcm) - (parseFloat(fp.style.height) / 2))+'px';
            } else {
              fp.style.left = Number((this.mousePositionPage.x * this.cntrCGroupComponent.np.wcm) - (parseFloat(fp.style.width) / 2))+'px';
              fp.style.top = Number((this.mousePositionPage.y * this.cntrCGroupComponent.np.hcm) - (parseFloat(fp.style.height) / 2))+'px';
            }

            let cabdrawPaste = this.verificarSobreposicao(this.cntrCGroupComponent.np.components.filter(pec => !this.cntrCGroupComponent.el.includes(pec)),
            (parseFloat(fp.style.left)/this.cntrCGroupComponent.np.wcm), (parseFloat(fp.style.top)/this.cntrCGroupComponent.np.hcm),
            (parseFloat(fp.style.width)/this.cntrCGroupComponent.np.wcm), (parseFloat(fp.style.height)/this.cntrCGroupComponent.np.hcm));

            this.selectedGroupComponentsProvSquare.draw.x = (parseFloat(fp.style.left)/this.cntrCGroupComponent.np.wcm);
            this.selectedGroupComponentsProvSquare.draw.y = (parseFloat(fp.style.top)/this.cntrCGroupComponent.np.hcm);

            if(cabdrawPaste){
              this.cntrCGroupComponent.el.forEach((rdg) => {
                rdg.copyPaste(3, (rdg.x + (this.selectedGroupComponentsProvSquare.draw.x - this.selectedGroupComponentsProvSquare.x)), (rdg.y + (this.selectedGroupComponentsProvSquare.draw.y - this.selectedGroupComponentsProvSquare.y)));
              });
            }
        }
        this.selectedGroupComponentsProvSquare={x: 21,y: 29,w: 0,h: 0,moving: false,draw: {x: 0,y: 0}};
        this.selectedGroupComponents = [];
        this.cntrCGroupComponent = {np: null,el: []};

        } else {
          if(this.cntrCComponent.el.id != null){
            this.cntrCComponent.el.copyPaste(1);
            this.cntrCComponent.el = {id: null};
            this.cntrCComponent.np = null;
          }
        }
      }
      if ((event.key === 'B' || event.key === 'b') && (event.ctrlKey || event.metaKey)) {
        if(this.cntrCComponent.el.id != null){
          this.cntrCComponent.el.copyPaste(2);
        }
      }
      if (event.key === 'DELETE' || event.key === 'Delete') {
        if(this.selectedComponent.el != null){
          
        }
      }
      if (event.key === 'Shift') {
        this.shiftPressed = true;
      }
      if (event.key === 'Control') {
        this.ctrlPressed = true;
      }
    });

    window.addEventListener('keyup', function(event) { 
      if (event.key === 'Shift') {
        this.shiftPressed = false;
      }
      if (event.key === 'Control') {
        this.ctrlPressed = false;
      }  
    });
   
    //BTN ACTIONS 
    document.querySelector('#publish.gen').addEventListener('click', function (e) {
      this.preview()
    });

    document.querySelector('#publish.save').addEventListener('click', function (e) {
      this.save();
    });

    zoomActions.querySelector('.moreZoom').addEventListener('click', function (e) {
      let z = parseFloat((this.defaultConfigurations.zoomPctg + 0.1));
      this.defaultConfigurations.zoomPctg = z;
      zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
      this.sheets.forEach(s => {
        s.setSizeSheet(z);
      });
    });
    
    zoomActions.querySelector('.lessZoom').addEventListener('click', function (e) {
      let z = (this.defaultConfigurations.zoomPctg - 0.1);
      this.defaultConfigurations.zoomPctg = z;
      zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
      this.sheets.forEach(s => {
        s.setSizeSheet(z);
      });
    });

    handleElements.addEventListener('click', function (e) {
      let esis = document.querySelectorAll('.sheet');
      esis.forEach((s) => {
        s.classList.add('gragItems');
        s.querySelectorAll('.componentPDF').forEach(c => {
          c.classList.add('NOhighlight');
        })
      })
      editor.currentAction = 'HANDLE';
      //this.currentElement = null;
    });

    pagesListButton.addEventListener('click', function (e) {
      listSheetsArea.classList.toggle("show");
    });

    elementsButton.addEventListener('click', this.elementsDropDown());

    document.querySelector('#currentElement').addEventListener('click', function () {
      this.selectedAddElement(this.currentElement, false);
    });

    closeAreas.forEach(ca => {
      let element = ca.parentElement.parentElement;
      let toClose = element.querySelector('.contentAUX');
      let toCloseheaderTopAux = element.querySelector('.headerTopAux');
      let openB = element.querySelector('.openArea');
    
      ca.addEventListener("click", function (e) {
        element.style.width = '50px';
        toCloseheaderTopAux.style.display = 'none';
        toClose.style.display = 'none';
        openB.style.display = 'block';
      })
    
    });
    
    openAreas.forEach(ca => {
      let element = ca.parentElement;
      let toClose = element.querySelector('.contentAUX');
      let toCloseheaderTopAux = element.querySelector('.headerTopAux');
      let openB = element.querySelector('.openArea');
    
      ca.addEventListener("click", function (e) {
        element.style.width = '210px';
        toCloseheaderTopAux.style.display = 'flex';
        toClose.style.display = 'flex';
        openB.style.display = 'none';
      })
    
    });
    
    //CRIAR PAGINA
    newPageButton.addEventListener("click", this.criarpaginafe);
  }

  start(data, json) {
    let bodyEditor = '<div id="editor"><section id="menu"><div class="left"><div id="pagesList" class="btnMenu">Páginas</div><di id="dropDownElements"><div class="lineElementClick"><div id="elements" class="btnMenu">Elementos &#8595;</div><div id="currentElement" class="btnMenu"> - - </div></div><div id="myDropDownElements" class="myDropDownElementsContent"></div></di><div id="handleElements" class="btnMenu">&#128432;</div></div><div class="center"><input type="text" value="PDFDIRECTA"><div id="salvarNome" class="btnMenu">&#9998;</div></div><div class="right"><div id="newPage" class="btnMenu">&#43; Página</div><div id="config" class="btnMenu">&#9881;</div><div id="publish" class="save btnMenu">Salvar</div><div id="publish" class="gen btnMenu">Gerar PDF</div></div></section><section id="viewManager"><div id="listElements"><div class="openArea">&rarr;</div><div class="headerTopAux"><div class="closeArea">&times;</div><p>Seus Elementos</p></div><div class="contentAUX"></div></div><div id="listSheets" class=""><div class="headerTopAux"><p>Páginas</p></div></div><div id="zoomActions" class=""><div class="zoomValue">100%</div><div class="controls"><div class="moreZoom"><span>+</span> &#x1F50D;</div><div class="lessZoom">&#x1F50E; <span>-</span></div></div></div><div id="configSheet"><div class="openArea">&larr;</div><div class="headerTopAux"><div class="closeArea">&times;</div><p class="currentElement">Sem Elemento...</p></div><div class="contentAUX"></div></div></section></div><div id="backgroundManager"></div><div id="myModal" class="modal"><div class="modal-content"><div class="modal-header"><div class="title">CONFIGURAÇÕES PADRÃO DO PROJETO:</div><p class="close">&times;</p></div><p style="font-size: 9px; margin-bottom:10px; border: 1px solid red; padding: 4px; border-radius: 3px;">Essas configurações serão aplicadas somente na criação de uma nova página. Após a criação da página, é impossível a alteração da margem!</p><div class="configsContents"><div class="left"><div class="sectionConfig"><div class="subtitle">Margem padrão:</div><div class="inp"><span>TOPO:</span><input type="number" name="verticalMT" id="verticalMT" step="0.5" max="30" value=3.5></div><div class="inp"><span>RODAPÉ:</span><input type="number" name="verticalMR" id="verticalMR" step="0.5" max="30" value=1.0></div><div class="inp"><span>ESQUERDA:</span><input type="number" name="horizontalME" id="horizontalME" step="0.5" max="30" value=1.0></div><div class="inp"><span>DIREITA:</span><input type="number" name="horizontalMD" id="horizontalMD" step="0.5" max="21" value=1.0></div></div></div><div class="right"><div class="sectionConfig"><div class="templatemodelbackground separatorConfigItems"><label for="templatemodelbackgroundBTN"><b>Inserir template Modelo no fundo:</b><div style="font-size: 9px; margin:5px; padding: 2px;"><p>Inserir uma imagem template. É possível alterar a qualquer momento.</p><p>A imagem template não será salva. Carregue novamente sempre que precisar.</p></div></label><input class="btnConfigModal" type="file" name="templatemodelbackgroundBTN" id="templatemodelbackgroundBTN"><p style="font-size: 11px; margin:5px;">OU</p><input  style="width: 100%;" type="text" name="templatemodelbackgroundTEXT" id="templatemodelbackgroundTEXT" placeholder="URL do template aqui!"></div><p style="font-size: 11px; color:red;">Mais opções em Breve...</p></div></div></div><div class="btnapply">Aplicar</div></div></div><div id="overlay" class="overlay"><div class="loader"></div></div>';
    let container = document.getElementById('editor-pdf-container');
    container.innerHTML = bodyEditor;

    //this.systemStartEvents();
    //this.controlsEditor();
  }

  criarpaginafe(e) {
    new SHEET(this.incrementPageId, this.defaultConfigurations.margens).createSheet();
    this.incrementPageId = this.incrementPageId + 1;
  }

  systemStartEvents(){
    window.addEventListener('load', function () {
      this.initial();
    });    
  }

  async initialRequests() {
    this.listImagesPDF = await this.getImages();
    this.listFieldsPDF = await this.getFields();
  }


  verificarSobreposicao(components, x, y, width, height) { //SOBREPOSIÇÃO DE COMPONENTES
    for (const elemento of components) {
        const { x: elementoX, y: elementoY, width: elementoWidth, height: elementoHeight } = elemento;

        // Verifica se os retângulos estão se sobrepondo
        if (
            x < elementoX + elementoWidth &&
            x + width > elementoX &&
            y < elementoY + elementoHeight &&
            y + height > elementoY
        ) {
            console.log(elemento);
            console.log(x+', '+y+', '+width+', '+height);
            return false;
        }
    }

    return true;
  }

  setCurrentPage(sheetClassId, doScroll, clickMiniPage = false) {

    this.currentPage = this.sheets[this.sheets.findIndex(s => s.id == sheetClassId)];
    listSheetsArea.querySelectorAll('.minisheet').forEach((m) => {
      let r = m.getAttribute('rel');

      let nm = m.querySelector('.contentMiniSheet')
      if (r == sheetClassId) {
        m.classList.add('miniSheetActive');
        nm.innerHTML = 'AQUI <p>ID ' + r + '</p>';
      } else {
        m.classList.remove('miniSheetActive');
        nm.innerHTML = '<p>ID ' + r + '</p>';
      }
    });
    let esheet = document.querySelector('.sheet[rel="' + sheetClassId + '"]');
    if (doScroll) {
      esheet.scrollIntoView({
        behavior: 'smooth'
      });
    }
    if (clickMiniPage) {
      listSheetsArea.classList.toggle("show");
    }
  }

  applyMargins(sheetClassId, margins = null) {
    let sheet = this.sheets[this.sheets.findIndex((sheet) => sheet.id === sheetClassId)];
    if(margins != null) sheet.setMargem(margins.top, margins.bottom, margins.left , margins.right);
  }

  sheetpredominante() {
    const items = document.querySelectorAll('.sheet');
    let maiorVisibilidade = 0;
    let elementoPredominante = null;
    items.forEach(item => {
      const bounding = item.getBoundingClientRect();
      const visibilidade = (bounding.top >= 0 && bounding.bottom <= window.innerHeight) ? (bounding.bottom - bounding.top) : 0;
      if (visibilidade > maiorVisibilidade) {
        maiorVisibilidade = visibilidade;
        elementoPredominante = item;
      }
    });
    if (elementoPredominante) {
      this.setCurrentPage(elementoPredominante.getAttribute('rel'), false);
    }
  }

  createAccordeonComumComponents() {
    let pageAccordeon = document.createElement('div');
    pageAccordeon.setAttribute('class', 'pageAccordeon');
    pageAccordeon.setAttribute('rel', 'comumComponents');
  
    let pageButtonAccordeon = document.createElement('div');
    pageButtonAccordeon.setAttribute('class', 'pageButtonAccordeon');
    pageButtonAccordeon.innerHTML = 'Componentes Comuns';
  
    let pagePanelAcordeon = document.createElement('div');
    pagePanelAcordeon.setAttribute('class', 'pagePanelAcordeon active');
  
    pageAccordeon.append(pageButtonAccordeon);
    pageAccordeon.append(pagePanelAcordeon);
  
    pageButtonAccordeon.addEventListener('click', function (e) {
      document.querySelectorAll('.pageAccordeon').forEach(ac => {
        if (ac.getAttribute('rel') != 'comumComponents') {
          ac.querySelector('.pageButtonAccordeon').classList.remove("active");
          ac.querySelector('.pagePanelAcordeon').classList.remove("active");
        }
      })
  
      pageButtonAccordeon.classList.toggle("active");
      pagePanelAcordeon.classList.toggle("active");
    })
  
    listElementsArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', pageAccordeon);
  }

  addToMyElements(el, np) {
    let me = document.createElement('div');
    me.setAttribute('rel', el.id);
    me.setAttribute('class', 'myElement');
    let content = '<div class="icon"></div><span rel="text" class="name">' + el.text + '</span>';
  
    let lc = document.createElement('div');
    lc.setAttribute('class', 'layerControlComponent');
  
    let clcu = document.createElement('div');
    clcu.setAttribute('class', 'up');
    clcu.innerHTML = '&uarr;';
  
    let clcd = document.createElement('div');
    clcd.setAttribute('class', 'down');
    clcd.innerHTML = '&darr;';
  
    let confShow = document.createElement('div');
    confShow.setAttribute('class', 'confShow');
  
    let cnfCompContent = document.createElement('div');
    cnfCompContent.setAttribute('class', 'cnfCompContent');
  
    let deleteComp = document.createElement('div');
    deleteComp.setAttribute('class', 'deleteComp');
    deleteComp.insertAdjacentText('beforeend', 'Deletar');
  
    let configComp = document.createElement('div');
    configComp.setAttribute('class', 'configComp');
    configComp.insertAdjacentText('beforeend', 'Configuração');
  
    confShow.insertAdjacentHTML('beforeend', '|||');
    confShow.insertAdjacentElement('beforeend', cnfCompContent);
    cnfCompContent.insertAdjacentElement('beforeend', deleteComp);
    cnfCompContent.insertAdjacentElement('beforeend', configComp);
  
    lc.append(clcu);
    lc.append(clcd);
  
    me.insertAdjacentHTML('beforeend', content);
    me.insertAdjacentElement('beforeend', lc);
    me.insertAdjacentElement('beforeend', confShow);
  
    let p = listElementsArea.querySelector('.contentAUX').querySelector('.pageAccordeon[rel="' + np + '"]').querySelector('.pagePanelAcordeon');
    p.insertAdjacentElement('afterbegin', me);
  
    el.addConnection('text', ['text'], me);
  
    deleteComp.addEventListener('click', function (e) {
      e.stopPropagation();
      if (confirm("Deseja excluir o componente " + el.text + " ?") == true) {
        if (el.deleteMe()) {
          me.parentNode.removeChild(me);
          if (configSheetArea.querySelectorAll('.contentAUX .inpConfig')[0].getAttribute('rel') == el.id) {
            configSheetArea.querySelector('.currentElement').textContent = 'Sem Elemento...';
            configSheetArea.querySelector('.contentAUX').innerHTML = '';
          }
        }
  
      }
    })
  
    configComp.addEventListener('click', function (e) {
      e.stopPropagation();
    })
  
    confShow.addEventListener('click', function (e) {
      confShow.classList.toggle('active');
    })
  
    clcu.addEventListener('click', function (e) {
      let noe = me;
      let pvs = me.previousElementSibling;
  
      if (pvs) {
        el.changeOrder('up');
        pvs.parentElement.insertBefore(noe, pvs);
      }
    })
  
    clcd.addEventListener('click', function (e) {
      let noe = me;
      let nxt = me.nextElementSibling;
  
      if (nxt) {
        el.changeOrder('down');
        noe.parentElement.insertBefore(nxt, noe);
      }
    })
  
    me.addEventListener('click', function (e) {
      this.selectComponent(np, el);
    })
  
    me.addEventListener('mouseover', function (e) {
      if (this.currentAction == 'HANDLE') {
        el.getSR().classList.add('highlight');
        el.getSR().classList.remove('NOhighlight');
      }
    });
  
    me.addEventListener('mouseout', (e) => {
      if (this.currentAction == 'HANDLE') {
        el.getSR().classList.remove('highlight');
        el.getSR().classList.add('NOhighlight');
      }
    });
  }

  selectComponent(np, el) {
    this.selectedComponent = {
      np: np,
      el: el
    }
    configSheetArea.querySelector('.currentElement').textContent = el.text;
    Array.from(listElementsArea.querySelectorAll('.pagePanelAcordeon .myElement')).forEach(accds => {
      if (accds.getAttribute('rel') == el.id) {
        accds.classList.add('active');
      } else {
        accds.classList.remove('active');
      }
    })
    this.createFormFromElement(el)
  }
  
  createFormFromElement(e) { //CREATE FORM OF COMPONENT PROPERTIES
    configSheetArea.querySelector('.contentAUX').innerHTML = '';
    let indexEl = this.elementos.findIndex(item => item.className == e.constructor.name);
  
    let configs = this.elementos[indexEl].configuracoes;
    for (let [key, value] of Object.entries(configs)) {
     let opts = [];
     let tt = [];
     if(value.values?.length > 0){
      opts = value.values;
     }
     if(value.tt?.length > 0){
      tt = value.tt;
     }
  
     let inpObj = {
      type: value.type ?? '',
      property: key ?? '',
      el: e ?? null,
      label: value.label ?? '',
      options: opts ?? [],
       iconSelect: value.icon ?? null,
       tutorialPass: tt ?? [],
       steps: value.step ?? 0.02
      };
  
      let inpArea = this.inputEscolhido(inpObj);
      configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);
    }
  
    if(e.freeSheet){ //TORNAR COMUM ENTRE PAGINAS
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', e.id);
      let btnComum = document.createElement('button');
      btnComum.innerHTML = "Tornar Comum";
      btnComum.setAttribute("type", "button");
      inpArea.append(btnComum);
      configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);
      btnComum.addEventListener("click", function() {
        var result = window.confirm("Tornar o elemento "+e.text+" comum ? (irreversível)");
        if (result) {
          e.changeComumComponent();
        }
      });
    }
  }
  
  unirPaginaAnterior(checkbox) {
    alert('Ao realizar essa alteração, o conteúdo desta página será continuado a partir da página anterior. Esse método é particularmente útil em situações envolvendo multicélulas ou componentes que expandem dinamicamente.\nSe a página anterior não estiver completamente preenchida, os elementos desta página a complementarão. Se, por acaso, esses elementos forem suficientes para preencher toda a página atual, ela não será carregada.');
    var id = checkbox.getAttribute('rel');
    var pos = this.sheets.findIndex(s => s.id == id);
    if (checkbox.checked && pos > 0) {
      this.sheets[pos].unionPreviousPage = true;
    }
    if (!checkbox.checked) {
      this.sheets[pos].unionPreviousPage = false;
      checkbox.checked = false;
    }
    if (pos <= 0 || this.sheets[pos-1] == undefined) {
      alert('Primeira página.\nSem paginas anteiores para Unir!');
      this.sheets[pos].unionPreviousPage = false;
      checkbox.checked = false;
    }
  }

  inputEscolhido({type, property, el, label, options = [], iconSelect = null, tutorialPass = [], steps = 0.02}) { //INPUTS FORM SWITCH
    let tutorial = document.createElement('div');
    tutorial.setAttribute('class', 'tutorialInputUse');
    let b = document.createElement('b');
    b.fontSize = '12px';
    b.innerHTML = 'Como Usar:';
    let ul = document.createElement('ul');
    tutorialPass.forEach(e => {
      let li = document.createElement('li');
      li.innerHTML = '<b>'+e.key+':</b>&nbsp&nbsp'+e.value;
      ul.append(li);
    });
    tutorial.append(b);
    tutorial.append(ul);
    
    if(type == 'number') {
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('input');
      inpAreaInput.setAttribute('type', 'number');
      inpAreaInput.setAttribute('step', steps);
      inpAreaInput.setAttribute('value', el[property]);
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = parseFloat(inpAreaInput.value);
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);

      return inpArea;
    }

    if(type == 'checkbox') {
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;

      let divCinpAreaInput = document.createElement('div');
      divCinpAreaInput.style.display = 'flex';
      divCinpAreaInput.style.justifyContent = 'center';
      divCinpAreaInput.style.width = '100%';
      divCinpAreaInput.style.marginLeft = '15px';
      //divCinpAreaInput.style.fontSize = '10px';

      let inpAreaInput = document.createElement('input');
      inpAreaInput.setAttribute('type', 'checkbox');
      inpAreaInput.setAttribute('id', el.id+'_checkbox_'+property);
      if(el[property] == 1)inpAreaInput.checked = true;
      if(el[property] == 0)inpAreaInput.checked = false;
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.style.width = '15px';
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = (inpAreaInput.checked) ? 1 : 0;
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);

      let labelinpAreaInput = document.createElement('label');
      labelinpAreaInput.style.fontSize = '10px';
      labelinpAreaInput.setAttribute('for', el.id+'_checkbox_'+property);
      labelinpAreaInput.textContent = ' SIM[X] ou NÃO[ ]';
      labelinpAreaInput.style.width = 'calc(100% - 20px)';

      divCinpAreaInput.append(inpAreaInput);
      divCinpAreaInput.append(labelinpAreaInput);

      inpArea.append(inpAreaSpan);
      inpArea.append(divCinpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);

      return inpArea;
    }

    if(type == 'select'){                
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('select');
      inpAreaInput.style.width = '100%';
      inpAreaInput.setAttribute('rel', property);
      [...[{key: '', value: ''}], ...options].forEach(vs => {
        var option = document.createElement('option');
        let stringTextOPT = iconSelect+' | '+vs.value;
        if(iconSelect == "" || (vs.value == "" && vs.key == "")) stringTextOPT = vs.value;
        option.value = vs.key;
        option.text = stringTextOPT;
        if(vs.key == el[property]) option.selected = true;
        inpAreaInput.appendChild(option);
      })
      inpAreaInput.addEventListener('change', function (ri) {
        el.setParameterComponent(inpAreaInput.value, property);
      })
      el.addConnection('select', [property], inpAreaInput);

      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);


      return inpArea;
    }

    if(type == 'hidden'){
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('input');
      inpAreaInput.setAttribute('type', 'hidden');
      inpAreaInput.setAttribute('value', el[property]);
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = inpAreaInput.value;
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);


      return inpArea;
    }

    if(type == 'text'){
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('input');
      inpAreaInput.setAttribute('type', 'text');
      inpAreaInput.setAttribute('value', el[property]);
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = inpAreaInput.value;
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);


      return inpArea;
    }

    if(type == 'color'){
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('input');
      inpAreaInput.setAttribute('type', 'color');
      inpAreaInput.setAttribute('value', el[property]);
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = inpAreaInput.value;
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);


      return inpArea;
    }

    if(type == 'imageSelect'){
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;

      let inpAreaInput = document.createElement('div');
      inpAreaInput.setAttribute('class', 'listagemImages');

      var removeOption = document.createElement('img');
      removeOption.src = 'https://static.vecteezy.com/system/resources/previews/018/887/460/original/signs-close-icon-png.png';
      removeOption.valUrl= '';
      removeOption.rel=property;
      inpAreaInput.appendChild(removeOption);

      removeOption.addEventListener('click', function (ri) {
        el.setParameterComponent('', property);
      })

      options.forEach(vs => {
        var option = document.createElement('img');
        option.src = vs.src;
        option.valUrl= vs.url;
        option.rel=property;
        inpAreaInput.appendChild(option);

        option.addEventListener('click', function (ri) {
          el.setParameterComponent(vs, property);
        })
      })

      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);
      return inpArea;
    }

    if(type == 'textarea'){
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', el.id);
      let inpAreaSpan = document.createElement('span');
      inpAreaSpan.innerHTML = label;
      let inpAreaInput = document.createElement('textarea');
      inpAreaInput.setAttribute('value', el[property]);
      inpAreaInput.setAttribute('rows', '6');
      inpAreaInput.setAttribute('rel', property);
      inpAreaInput.value = el[property];
      inpAreaInput.addEventListener('change', function (ri) {
        let vr = inpAreaInput.value;
        el.setParameterComponent(vr, property);
      })
      el.addConnection('input', [property], inpAreaInput);
      inpArea.append(inpAreaSpan);
      inpArea.append(inpAreaInput);
      if(tutorialPass.length > 0) inpArea.append(tutorial);
      return inpArea;
    }
  }

  mapeareOrdenarElementos(contentElement, sheet) {
    const elementos = Array.from(contentElement.children);
    const elementosOrdenados = elementos.sort((a, b) => {
        const posicaoVerticalA = a.offsetTop;
        const posicaoVerticalB = b.offsetTop;
        const posicaoHorizontalA = a.offsetLeft;
        const posicaoHorizontalB = b.offsetLeft;
  
        if (posicaoVerticalA !== posicaoVerticalB) {
            return posicaoVerticalA - posicaoVerticalB;
        } else {
            return posicaoHorizontalA - posicaoHorizontalB;
        }
    });
    let orderComponents = [];
    elementosOrdenados.forEach(eh => {
      let compInstance = sheet.components[sheet.components.findIndex(i => i.id == eh.getAttribute('rel'))];
      if(compInstance != undefined) orderComponents.push(compInstance);
    });  
    /* console.log(orderComponents); */
    return orderComponents;
  }

  elementsDropDown() {
    elementsButton.parentElement.parentElement.querySelector('#myDropDownElements').classList.toggle("show");
  };
  
  selectedAddElement(e, fromHTML = true) {
    document.querySelectorAll('.sheet').forEach(s => {
      s.classList.remove('gragItems');
    })
  
    let indexEl;
  
    if(fromHTML){
      let id = e.getAttribute('rel');
      indexEl = this.elementos.findIndex(item => item.id === Number(id));
    } else {
      indexEl = this.elementos.findIndex(item => item.id === Number(e));
    }
  
    document.querySelector('#currentElement').innerHTML = this.elementos[indexEl].nome;
    this.currentElement = this.elementos[indexEl].id;
    this.currentAction = 'CREATE';
    let esis = document.querySelectorAll('.sheet');
    esis.forEach((s) => {
      s.classList.remove('gragItems');
      s.querySelectorAll('.componentPDF').forEach(c => {
        c.classList.remove('NOhighlight');
        c.classList.remove('highlight');
      })
    })
    this.elementsDropDown();
  }

  initial(){
    document.getElementById('overlay').style.display = 'flex';
    this.initialRequests().then(() => {
        this.elementos = [{
          id: 1,
          nome: "Célula",
          icon: " &#9633",
          class: Celula,
          className: 'Celula',
          configuracoes: {
            last: {
              icon: "",
              label: "Último elemento da Linha",
              type: "checkbox"
            },
            x: {
              icon: "",
              label: "eixo X",
              type: "number",
              step: "0.1"
            },
            y: {
              icon: "",
              label: "eixo Y",
              type: "number",
              step: "0.1"
            },
            width: {
              icon: "",
              label: "largura",
              type: "number",
              step: "0.5"
            },
            height: {
              icon: "",
              label: "altura",
              type: "number",
              step: "0.5"
            },
            talign: {
              icon: "📏",
              label: "alinhamento",
              type: "select",
              values: listalinhamentoTextPDF
            },
            tfont: {
              icon: "🔬",
              label: "fonte",
              type: "select",
              values: listFontes
            },
            tsize: {
              icon: "",
              label: "tamanho do texto",
              type: "number",
              step: "1"
            },
            tweight: {
              icon: "",
              label: "estilo do texto",
              type: "text",
              tt: tttestiloTextPDF
            },
            tcolor: {
              icon: "",
              label: "cor do texto",
              type: "color"
            },
            text: {
              icon: "",
              label: "Texto da Célula",
              type: "text",
            },
            informacaoExterna: {
              icon: "🛢️",
              label: "Campo do Banco",
              type: "select",
              values: this.listFieldsPDF
            },
            bcolor: {
              icon: "",
              label: "cor de fundo",
              type: "color"
            },
            border: {
              icon: "",
              label: "borda",
              type: "text",
              tt: tttBordasOpcoesPDF
            },
            borderwidth: {
              icon: "",
              label: "tamanho da borda",
              type: "number",
              step: "0.02"
            },
            bordercolor: {
              icon: "",
              label: "cor da borda",
              type: "color"
            },
            link: {
              icon: "",
              label: "link",
              type: "text"
            },
          }
        },
        {
          id: 2,
          nome: "Multi-Célula",
          icon: " &#9633",
          class: MultiCelula,
          className: 'MultiCelula',
          configuracoes: {
            last: {
              icon: "",
              label: "Último elemento da Linha, padrão TRUE",
              type: "hidden"
            },
            x: {
              icon: "",
              label: "eixo X",
              type: "number",
              step: "0.1"
            },
            y: {
              icon: "",
              label: "eixo Y",
              type: "number",
              step: "0.1"
            },
            width: {
              icon: "",
              label: "largura",
              type: "number",
              step: "0.5"
            },
            height: {
              icon: "",
              label: "altura das linhas",
              type: "number",
              step: "0.4"
            },
            talign: {
              icon: "📏",
              label: "alinhamento",
              type: "select",
              values: listalinhamentoTextPDF
            },
            tfont: {
              icon: "🔬",
              label: "fonte",
              type: "select",
              values: listFontes
            },
            tsize: {
              icon: "",
              label: "tamanho do texto",
              type: "number",
              step: "1"
            },
            tweight: {
              icon: "",
              label: "estilo do texto",
              type: "text",
              tt: tttestiloTextPDF
            },
            tcolor: {
              icon: "",
              label: "cor do texto",
              type: "color"
            },
            text: {
              icon: "",
              label: "Texto da Célula",
              type: "textarea",
            },
            informacaoExterna: {
              icon: "🛢️",
              label: "Campo do Banco",
              type: "select",
              values: this.listFieldsPDF
            },
            bcolor: {
              icon: "",
              label: "cor de fundo",
              type: "color"
            },
            border: {
              icon: "",
              label: "borda",
              type: "text",
              tt: tttBordasOpcoesPDF
            },
            borderwidth: {
              icon: "",
              label: "tamanho da borda",
              type: "number",
              step: "0.02"
            },
            bordercolor: {
              icon: "",
              label: "cor da borda",
              type: "color"
            },
            link: {
              icon: "",
              label: "link",
              type: "text"
            },
          }
        },
        {
          id: 3,
          nome: "Imagem",
          icon: " &#9633",
          class: ImageBuild,
          className: 'ImageBuild',
          configuracoes: {
            x: {
              icon: "",
              label: "eixo X",
              type: "number",
              step: "0.1"
            },
            y: {
              icon: "",
              label: "eixo Y",
              type: "number",
              step: "0.1"
            },
            imageOriginal: {
              icon: "",
              label: "Tamanho original da Imagem",
              type: "checkbox"
            },
            width: {
              icon: "",
              label: "largura",
              type: "number",
              step: "0.5"
            },
            height: {
              icon: "",
              label: "altura",
              type: "number",
              step: "0.5"
            },
            sizeLink: {
              icon: "",
              label: "LINK LARGURA-ALTURA (proporcional)",
              type: "checkbox"
            },
            text: {
              icon: "",
              label: "URL da imagem",
              type: "text",
            },
            informacaoExterna: {
              icon: "",
              label: "Imagens do Banco",
              type: "imageSelect",
              values: this.listImagesPDF
            }
          }
        }
      ]

        this.elementos.forEach((el) => {
          let component = document.createElement('div');
          component.setAttribute('class', 'el');
          component.setAttribute('rel', el.id);

          let icon = document.createElement('div');
          icon.setAttribute('class', 'icon');
          icon.setAttribute('rel', el.id);

          icon.append(el.icon);
          component.append(icon);
          component.append(el.nome);

          component.addEventListener('click', this.selectedAddElement(component));
          elementsdropdown.append(component)
        })

        this.createAccordeonComumComponents();

        this.getJson().then((r) => {
          //console.log(r);

          this.loadPDFJSON(r).then(() => {

            zoomActions.querySelector('.zoomValue').innerHTML = (Number(this.defaultConfigurations.zoomPctg) * 100).toFixed(2) + '%';

            if (this.sheets.length == 0) {
              viewManager.insertAdjacentHTML('beforeend', '<div class="nosheetsExist" rel="temporary"><p>Sem páginas.</p><p><b>Para Iniciar, clique em: </b></p><p><div onclick="criarpaginafe(this)" class="btnMenu">&#43; Página</div></p></div>');
            }
    
            //clique em qualquer ONCLICK ou ADDEVENTLISTENER "CLICK"
            Array.from(document.querySelectorAll('[onclick], [data-click-event]')).forEach(function (elemento) {
              elemento.addEventListener('click', function () {
                try {
                  let e = elemento.closest('[rel="temporary"]');
                  if (e) e.parentElement.removeChild(e);
                } catch (error) {}
              });
            });
    
          document.getElementById('overlay').style.display = 'none';
          });
        
        });
    });
  }

  save(){
    let compsToPDF = {};
    this.sheets.forEach(s => {
      if (compsToPDF[s.id]) {
        if (Array.isArray(compsToPDF[s.id])) {
          compsToPDF[s.id].push(this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s));
        } else {
          compsToPDF[s.id] = [compsToPDF[s.id], this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
        }
      } else {
        compsToPDF[s.id] = [this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
      }
    });
    const replacer = (key, value) => {
      if (key === 'components'|| key === 'selfReference' || key === 'connections' || key === 'lastStatusOk') {
        return undefined;
      }
      if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      }
      return value;
    };
    let alljs = "{\"ACAO\":1, \"FILE\":\""+fileName+"\", \"defaultConfigurations\":"+JSON.stringify(this.defaultConfigurations)+",\"incrementPageId\":"+this.incrementPageId+",\"datas\": \"213\",\"sheets\": "+JSON.stringify(this.sheets, replacer)+" , \"componentes\": "+JSON.stringify(compsToPDF, replacer)+", \"comuns\": "+JSON.stringify(this.comumComponents, replacer)+"}";
    this.onSave(alljs);
  }

  preview(){
    let compsToPDF = {};
    this.sheets.forEach(s => {

      if (compsToPDF[s.id]) {
        // Se existe e é um array, adiciona o valor ao array existente
        if (Array.isArray(compsToPDF[s.id])) {
          compsToPDF[s.id].push(this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s));
        } else {
          // Se não for um array, cria um novo array com o valor
          compsToPDF[s.id] = [compsToPDF[s.id], this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
        }
      } else {
        // Se não existe, cria um novo array com o valor
        compsToPDF[s.id] = [this.mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
      }
    });
    const replacer = (key, value) => {
      if (key === 'components'|| key === 'selfReference' || key === 'connections' || key === 'lastStatusOk') {
        return undefined;
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      return value;
    };
    let alljs = "{\"datas\": \"213\",\"sheets\": "+JSON.stringify(this.sheets, replacer)+" , \"componentes\": "+JSON.stringify(compsToPDF, replacer)+", \"comuns\": "+JSON.stringify(this.comumComponents, replacer)+"}";

    // Cria um formulário dinamicamente
    var form = document.createElement('form');
    form.method = 'post';
    form.action = './../generatorPDFfromJSON.php'; // Substitua pela URL desejada
    form.target = '_blank'; // Abre a resposta em uma nova aba/janela

    // Cria um campo de entrada para o JSON
    var jsonInput = document.createElement('input');
    jsonInput.type = 'hidden';
    jsonInput.name = 'jsonPdfScaffold';
    jsonInput.value = alljs;
    form.appendChild(jsonInput);

    // Adiciona o formulário à página e o envia
    document.body.appendChild(form);
    form.submit();
  }

  async loadPDFJSON(json) {
    if (json == '') return false;
    
    const jsonParsed = JSON.parse(json);
    this.incrementPageId = jsonParsed.incrementPageId;
    this.defaultConfigurations = jsonParsed.defaultConfigurations;
    
    jsonParsed.sheets.forEach(s => {
      new SHEET(s.id, {top: s.margem.top / s.hcm,
        bottom: s.margem.bottom / s.hcm,
        left: s.margem.left / s.wcm,
        right: s.margem.right / s.wcm
      }, []).createSheet();
      let sRef = this.sheets.find(function(objeto) {return objeto.id === s.id;});
      jsonParsed.componentes[s.id][0].forEach(c => {
        let elementInstance = this.elementos[this.elementos.findIndex(item => item.className === c.elementType)];
  
        c.sheet = sRef;
        delete c.lastStatusOk;
        Object.keys(c).forEach((a) => {
          if(c[a] == null || c[a] == 'null'){
            c[a] = '';
          }
          if(c[a] === 'false'){
            c[a] = false;
          }
          if(c[a] === 'true'){
            c[a] = true;
          }
        });
  
        let componentToCreate = new elementInstance.class(c);
        sRef.addElementoToSheetHtml(componentToCreate);
      });
    });
  
    //COMUNS
    jsonParsed.comuns.forEach(com => {
      let elementInstance = this.elementos[this.elementos.findIndex(item => item.className === com.elementType)];
      com.comum = false;
      com.sheet = this.sheets[0];
      delete com.lastStatusOk;
      Object.keys(com).forEach((a) => {
        if(com[a] == null || com[a] == 'null'){
          com[a] = '';
        }
        if(com[a] === 'false'){
          com[a] = false;
        }
        if(com[a] === 'true'){
          com[a] = true;
        }
      });
      
      //console.log(com);
  
      let componentToCreate = new elementInstance.class(com);
      this.sheets[0].addElementoToSheetHtml(componentToCreate);
      componentToCreate.changeComumComponent();
    });
  
    return false;
  }
}

//SYSTEM INSTANTE - PRINCIPAL COMMAND
const editor = new PdfEditor();

//CLASSES SYSTEM

class ElementBase {
  lastStatusOk = null;
  elementType = null;
  selfReference = [];
  freeSheet = false;
  comum = false;
  id = null
  x = 0; //
  y = 0; //
  sheet = null;
  width = 10; //
  height = 0.4; //
  connections = [];
  text = "DIRECTA TEXT!"; //
  informacaoExterna = null; // É UM TEXTO ESSA INFORMAÇÃO!

  constructor({sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = null}) {
    if (sheet == null || sheet == undefined || id == null || id == undefined) throw Error('SEM SHEET DEFINIDA PARA A CÉLULA!');
    this.informacaoExterna = informacaoExterna;
    this.comum = comum;
    this.freeSheet = freeSheet;
    this.text = text;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.sheet = sheet;
    this.id = id;

    //this.lastStatusOk = { ...this };
  }

  draw(sheet = this.sheet) {

    let pStats = sheet.intoContentRect([{
      x: (sheet.wcm * this.x),
      y: (sheet.hcm * this.y)
    }, {
      x: (this.width + this.x) * sheet.wcm,
      y: (this.height + this.y) * sheet.hcm
    }], this.freeSheet, this.id, this.comum);

    let celula = document.createElement("div");

    let h = this.height;
    let w = this.width;

    //POSITION
    celula.style.left = (sheet.wcm * this.x) + 'px';
    celula.style.top = (sheet.hcm * this.y) + 'px';

    //HEIGHT - WIDTH
    celula.style.width = (sheet.wcm * w) + 'px';
    celula.style.height = (sheet.hcm * h) + 'px';

    celula = this.especificacoesEstilo(celula, sheet);
    celula = this.drawObrigatorio(celula, sheet);
    
    this.selfReference.push(celula);

    if (pStats.retInto && pStats.touchComponent) {
      return celula;
    } else {
      return null;
    }

  }

  especificacoesEstilo(celula, sheet){
    let celulaStyle = celula;
    return celulaStyle;
  }

  drawObrigatorio(celula, sheet){
    let celulaInfo = celula;
    celula.setAttribute('class', 'componentPDF');
    celula.setAttribute("rel", this.id);
    if(sheet.inClick && editor.currentAction == 'HANDLE' && editor.selectedComponent.el == this){
      celulaInfo.classList.add('highlightMoving');
    } else {
      celulaInfo.classList.remove('highlightMoving');
      celulaInfo.classList.add('NOhighlight');
    }
    return celulaInfo;
  }

  copyPaste(typePaste = 1){
    alert('copy não implementado em todos os componentes!');

  /*   let indexEl = editor.elementos.findIndex(item => item.className === this.elementType);
    let copy = Object.assign({}, this);
    if (this.sheet.components.length > 0) {
      let elId = Number(this.sheet.components.at(-1).id.split('_').at(-1))+1;
      copy.id = Number(this.sheet.id)+'_'+elId;
    }

    if(this.last == 1){
      //CALCULO PARA INSERIR EM BAIXO
      copy.y = this.y + this.height;
    } else {
      //CALCULO PARA INSERIR AO LADO
      copy.x = this.x + this.width;
    }

    copy.selfReference = [];
    copy.lastStatusOk = null;
    copy.connections = [];

    let componentToCopy = new editor.elementos[indexEl].class(copy);
    this.sheet.addElementoToSheetHtml(componentToCopy); */
  }

  //SET PARAMETERS CALL
  setParameterComponent(value, parametro) {
    //sheet
    let oldValues = [];
    [parametro].forEach((pi, k) => {
      oldValues.push(this[pi]);
    })

    if(value == ''){
      this.setParameters([parametro], [value]);
    } else if (!isNaN(value)) {
      this.setParameters([parametro], [parseFloat(value.toFixed(2))]);
    } else if(value == null || value == undefined){
      this.setParameters([parametro], oldValues);
    } else {
      this.setParameters([parametro], [value]);
    }
    
    this.selfReference.splice(0, this.selfReference.length);

    if(this.comum){
      editor.sheets.forEach(s => {
        let d = this.draw(s);

        if (d == null) {
          this.setParameters([parametro], oldValues);
        } else {
          this.reDraw(d, s);
        }

      });
    } else {
      let d = this.draw();
      if (d == null) {
        this.setParameters([parametro], oldValues);
      } else {
        this.reDraw(d);
      }
    }
  }

  reDraw(d, s = this.sheet) {
    let pai = s.getSR().querySelector('.componentPDF[rel="' + this.id + '"]').parentElement;
    let subs = s.getSR().querySelector('.componentPDF[rel="' + this.id + '"]');
    pai.replaceChild(d, subs);
  }

  addConnection(type, rels, comp) {
    this.connections.push({
      type: type,
      rels: rels,
      comp: comp
    });
  };


  updateConnectionsINF() {
    this.connections.forEach(c => {
      c.rels.forEach(rel => {
        if (c.type == 'text') {
          c.comp.querySelector('[rel="' + rel + '"]').innerHTML = this[rel];
        } else if (c.type == 'input' || c.type == 'select' || c.type == 'textarea') {
          c.comp.value = this[rel];
        }
      })
    });
  }

  //SET PARAMETERS OBJECT
  setParameters(p = [], v = []) {
    p.forEach((pi, k) => {
      this[pi] = v[k]
    })
    this.lastStatusOk = { ...this };
    this.updateConnectionsINF();
  }

  getSR(ra = false) {
    if(ra){
      return this.selfReference;
    } else {
      return this.selfReference[0];
    }
  }

  rollback(){
    //console.log('CRIAR CÓDIGO - ROLLBACK: '+this.id);
    if(this.lastStatusOk != null){
      Object.assign(this, this.lastStatusOk);
      let elementInstance = editor.elementos[editor.elementos.findIndex(item => item.className === this.elementType)];
      Object.keys(elementInstance?.configuracoes).forEach(cnfops => {
        if(this[cnfops] != this.lastStatusOk[cnfops] && this.lastStatusOk[cnfops] != undefined){
          this.setParameterComponent(this.lastStatusOk[cnfops], cnfops);
        }
      });
    }
  }

  changeOrder(c) {
    if(this.comum) return false;
    let selfIndex = this.sheet.components.findIndex(i => i.id == this.id);

    if (c == 'up') {
      try {
        let nxt = this.sheet.components[selfIndex + 1];
        if (nxt == null) return false;

        let tonxt = this.getSR().parentElement.querySelector('div.componentPDF[rel="' + nxt.id + '"]');
        let tis = this.getSR().parentElement.querySelector('div.componentPDF[rel="' + this.id + '"]');
        tis.parentElement.insertBefore(tonxt, tis);

        this.sheet.components[selfIndex + 1] = this.sheet.components[selfIndex];
        this.sheet.components[selfIndex] = nxt;
      } catch (error) {
        console.log(error);
      }

    }
    if (c == 'down') {
      try {
        let nxt = this.sheet.components[selfIndex - 1];
        if (nxt == null) return false;

        let tonxt = this.getSR().parentElement.querySelector('div.componentPDF[rel="' + nxt.id + '"]');
        let tis = this.getSR().parentElement.querySelector('div.componentPDF[rel="' + this.id + '"]');
        tonxt.parentElement.insertBefore(tis, tonxt);

        this.sheet.components[selfIndex - 1] = this.sheet.components[selfIndex];
        this.sheet.components[selfIndex] = nxt;
      } catch (error) {
        console.log(error);
      }

    }
  }

  deleteMe() {
    try {
      console.log('deletando');
      if(this.comum) {
        editor.comumComponents.splice(editor.comumComponents.findIndex(c => c.id == this.id), 1);
        this.getSR(true).forEach(c => {
          c.parentElement.removeChild(c);
        });
      } else {
        this.sheet.components.splice(this.sheet.components.findIndex(c => c.id == this.id), 1);
        this.getSR().parentElement.removeChild(this.getSR());
      }
      return true;
    } catch (error) {
      return false
    }
  }

  changeComumComponent(){
    if(this.comum) return false;
    let lastId = 1;
    if(editor.comumComponents.length > 0){
      lastId = Number(editor.comumComponents[editor.comumComponents.length - 1].id.split('_').at(-1)) + 1;
    }
    let celulaComum = new this.constructor({
      sheet: this.sheet, id: 'comumComponent_'+lastId, text: this.text, x: this.x, y: this.y, width: this.width,
      height: this.height, freeSheet: this.freeSheet, comum: true, informacaoExterna: this.informacaoExterna,
      tcolor: this.tcolor, talign: this.talign, tfont: this.tfont, tsize: this.tsize, tweight: this.tweight,
      bcolor: this.bcolor , border: this.border, borderwidth: this.borderwidth, bordercolor: this.bordercolor,
      last: this.last, link: this.link
    });
    editor.comumComponents.push(celulaComum);
    editor.addToMyElements(celulaComum, 'comumComponents');
    this.deleteMe();
    editor.sheets.forEach(s => {
      let celula = celulaComum.draw();
      let currentSheet = s.getSR().querySelector('.content');
      console.log(celula);
      currentSheet.appendChild(celula);
    });
    let repEl = listElementsArea.querySelector('.contentAUX').querySelector('.pageAccordeon[rel="' + this.sheet.id + '"]').querySelector('.pagePanelAcordeon div[rel="'+this.id+'"]');
    repEl.parentNode.removeChild(repEl);
    configSheetArea.querySelector('.currentElement').textContent = 'Sem Elemento...';
    configSheetArea.querySelector('.contentAUX').innerHTML = '';
  }
}

class CelulaBase extends ElementBase {
  talign = "C"; //
  tfont = "Arial"; //
  tsize = 7; //
  tweight = ""; //
  tcolor = "#000000"; //
  bcolor = "#ffffff"; //
  border = "";
  borderwidth = 0.04;
  bordercolor = "#ffffff";
  last = 0; //
  link = ""; //
  constructor({sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = '', tcolor = "#000000", talign = "C", tfont = "Arial", tsize = 7, tweight = "", bcolor = "#ffffff", border = "T", borderwidth = 0.04, bordercolor = "#FF0000", last = 0, link = ""}) {
    super({sheet, id, text, x, y, width, height, freeSheet, comum, informacaoExterna});
    this.last = last;
    this.link = link;
    this.bcolor = bcolor;
    this.tcolor = tcolor;
    this.talign = talign;
    this.tfont = tfont;
    this.tsize = tsize;
    this.tweight = tweight;
    this.border = border;
    this.borderwidth = borderwidth;
    this.bordercolor = bordercolor;

    this.lastStatusOk = { ...this };
  }

  draw(sheet = this.sheet) {
    let pStats = sheet.intoContentRect([{
      x: (sheet.wcm * this.x),
      y: (sheet.hcm * this.y)
    }, {
      x: (this.width + this.x) * sheet.wcm,
      y: (this.height + this.y) * sheet.hcm
    }], this.freeSheet, this.id, this.comum);

    let celula = document.createElement("div");

    //BACKGROUND COLOR
    celula.style.backgroundColor = this.bcolor;

    //TEXT
    var text = document.createTextNode((this.informacaoExterna == '' || this.informacaoExterna == null || this.informacaoExterna == undefined) ? this.text/* +' '+this.id */ : this.informacaoExterna);
    celula.style.fontFamily = this.tfont;

    let fs = sheet.hcm * (parseFloat(this.tsize) / (72 / 2.56));
    celula.style.fontSize = fs + 'px';

    celula.style.textAlign = alignText[this.talign];
    celula.style.color = this.tcolor;

    let fontstyleSplit = this.tweight.split('');
    fontstyleSplit.forEach((e) => {
      let s = e.toUpperCase();
      if (s == 'B') {
        celula.style.fontWeight = weightText[this.tweight];
      }
      if (s == 'I') {
        celula.style.fontStyle = weightText[this.tweight];
      }
      if (s == 'U') {
        celula.style.textDecoration = weightText[this.tweight];
      }
    })

    let h = this.height;
    let w = this.width;

    //BORDER
    let sidesSplit = this.border.split('');
    sidesSplit.forEach((e) => {
      let sd = sideChars[e];
      let wb = sheet.hcm * this.borderwidth;
      celula.style[sd] = wb + "px solid " + this.bordercolor;
      if(e == "B"){
        h += this.borderwidth;
      }
      if(e == "R"){
        w += this.borderwidth;
      }
      if(e == "L"){
        w += this.borderwidth;
      }
      if(e == "T"){
        h += this.borderwidth;
      }
    })

    //POSITION
    celula.style.left = (sheet.wcm * this.x) + 'px';
    celula.style.top = (sheet.hcm * this.y) + 'px';

    //HEIGHT - WIDTH
    celula.style.width = (sheet.wcm * w) + 'px';
    celula.style.height = (sheet.hcm * h) + 'px';

    celula = this.especificacoesEstilo(celula, sheet);
    celula = this.drawObrigatorio(celula, sheet);
    

    celula.appendChild(text);

    this.selfReference.push(celula);

    if (pStats.retInto && pStats.touchComponent) {

      return celula;
    } else {
      return null;
    }

  }

  especificacoesEstilo(celula, sheet){
    let celulaStyle = celula;
    celulaStyle.style.lineHeight = (sheet.hcm * this.height) + 'px';
    return celulaStyle;
  }

  copyPaste(typePaste = 1, x = null, y = null){

    let indexEl = editor.elementos.findIndex(item => item.className === this.elementType);
    let copy = Object.assign({}, this);
    if (this.sheet.components.length > 0) {
      let mid = 0;
      this.sheet.components.forEach((e) => {
          let t = Number(e.id.split('_')[1]);
          if(t > mid){
            mid = t;
          }
        });
      let elId = Number(mid) + 1;
      copy.id = Number(this.sheet.id)+'_'+elId;
    }

    if(typePaste == 1){
      //COLAR NO LUGAR DO MOUSE
      if(this.width >= ((this.sheet.width - ((this.sheet.margem.left + this.sheet.margem.right)  / this.sheet.wcm))*0.75)){
        copy.x = (this.sheet.margem.left / this.sheet.wcm);
        copy.y = (editor.mousePositionPage.y - this.height/2);
      } else {
        copy.x = (editor.mousePositionPage.x - this.width/2);
        copy.y = (editor.mousePositionPage.y - this.height/2);
      }
    } else if(typePaste == 2){
      let down = editor.mousePositionPage.y - (this.y+this.height);
      let up = (editor.mousePositionPage.y - this.y)*-1;
      let left = (editor.mousePositionPage.x - this.x)*-1;
      let right = editor.mousePositionPage.x - (this.x+this.width);

      if(up > 0){
        copy.y = (this.y - this.height) - 0.01;
      } else if(left > 0){
        copy.x = this.x - this.width;
      } else if(down >= right){
        console.log('down');
        copy.y = (this.y + this.height) + 0.01;
        console.log(copy.y);
      } else if(right > down) {
        copy.x = this.x + this.width;
      }else {
        alert('ERROR ON PASTE ACTION!');
      }
    } else if(typePaste == 3){
      copy.x = x;
      copy.y = y;
    }

    copy.selfReference = [];
    copy.lastStatusOk = null;
    copy.connections = [];

    let componentToCopy = new editor.elementos[indexEl].class(copy);
    this.sheet.addElementoToSheetHtml(componentToCopy);
  }
}

class Celula extends CelulaBase{
  
  constructor({sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = null, tcolor = "#000000", talign = "L", tfont = "Arial", tsize = 7, tweight = "", bcolor = "#ffffff", border = "T", borderwidth = 0.04, bordercolor = "#FF0000", last = 0, link = ""}) {
    super({sheet, id, text, x, y, width , height , freeSheet, comum, informacaoExterna, tcolor , talign , tfont, tsize , tweight , bcolor , border, borderwidth, bordercolor, last, link});
    this.elementType = 'Celula';
    this.lastStatusOk = { ...this };
  }

  especificacoesEstilo(celula, sheet){
    let celulaStyle = celula;
    celulaStyle.style.lineHeight = (sheet.hcm * this.height) + 'px';
    celulaStyle.style.whiteSpace = 'nowrap';
    var offsetTexto = celulaStyle.getBoundingClientRect().left - celulaStyle.offsetLeft;
    if (this.talign == "L") {
      celulaStyle.style.marginLeft = "-" + (celulaStyle.offsetWidth / 2) + "px";
    } else if (this.talign == "R") {
      celulaStyle.style.marginRight = "-" + (celulaStyle.offsetWidth / 2) + "px";
    }
    return celulaStyle;
  }
}

class MultiCelula extends CelulaBase{
  constructor({sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = null, tcolor = "#000000", talign = "L", tfont = "Arial", tsize = 7, tweight = "", bcolor = "#ffffff", border = "T", borderwidth = 0.04, bordercolor = "#FF0000", last = 1, link = ""}) {
    super({sheet, id, text, x, y, width , height , freeSheet, comum, informacaoExterna, tcolor , talign , tfont, tsize , tweight , bcolor , border, borderwidth, bordercolor, last, link});
    this.elementType = 'MultiCelula';
    this.height = (parseFloat(this.tsize+2) / (72 / 2.56));
    this.lastStatusOk = { ...this };
  }

  especificacoesEstilo(celula, sheet){
    let celulaStyle = celula;
    celulaStyle.style.textAlign = 'justify';
    celulaStyle.style.lineHeight = (this.height*sheet.hcm) + 'px';
    celulaStyle.style.height = 'auto';
    celulaStyle.style.overflow = 'hidden';
    return celulaStyle;
  }
}

class ImageBuild extends ElementBase{
  //'./PocDragAndDropMakeForm/img/NoImage.jpg'
  imagePath = '';
  extensionImage = '';
  imageOriginal = false;
  proporcionalSize = 0;
  sizeLink = true;
  constructor({sheet, id, text = "DIRECTA Image!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = true, informacaoExterna = null, imageOriginal = false, sizeLink = true }) {
    super({sheet, id, text, x, y, width , height , freeSheet, comum, informacaoExterna});
    this.elementType = 'ImageBuild';
    this.imageOriginal = imageOriginal;
    this.sizeLink = sizeLink;
    this.lastStatusOk = { ...this };
  }

  draw(sheet = this.sheet) {

    let celula = document.createElement("img");

    let imageOnUse = '';
    if(this.informacaoExterna == '' || this.informacaoExterna == null){
      if(this.text.includes('http') && this.text.includes('://')){
        celula.src = this.text;
        imageOnUse = this.text;
      } else {
        celula.src = './img/NoImage.jpg'; 
      }
    } else {
      this.imagePath = this.informacaoExterna;
      celula.src = this.imagePath.src;
      imageOnUse = this.imagePath.src;
    }

    if(this.imageOriginal){
      let t = this;
      let img = new Image();
      img.onload = function () {
        if(t.width != (this.width / t.sheet.wcm) || t.height != (this.height / t.sheet.hcm)){
        t.setParameters(['width', 'height', 'sizeLink'], [(this.width / t.sheet.wcm), (this.height / t.sheet.hcm), true]);
        setTimeout(() => {
          t.reDraw(t.draw());
        }, 85);
        }
      }
      img.src = imageOnUse;
      img.remove();
    }

    if(this.sizeLink){
      if(this.lastStatusOk.height != this.height && this.lastStatusOk.width == this.width){
        this.proporcionalSize = this.height/this.lastStatusOk.height;
        this.width = this.width*this.proporcionalSize;
      } else if(this.lastStatusOk.width != this.width && this.lastStatusOk.height == this.height){
        this.proporcionalSize = this.width/this.lastStatusOk.width;
        this.height = this.height*this.proporcionalSize;
      }
    } else {
      this.proporcionalSize = 0;
    }

    let pStats = sheet.intoContentRect([{
      x: (sheet.wcm * this.x),
      y: (sheet.hcm * this.y)
    }, {
      x: (this.width + this.x) * sheet.wcm,
      y: (this.height + this.y) * sheet.hcm
    }], this.freeSheet, this.id, this.comum);

    if(pStats.retInto == false && this.sizeLink){
      this.height = this.lastStatusOk.height;
      this.width = this.lastStatusOk.width;

    }

    //HEIGHT - WIDTH
    celula.style.width = (sheet.wcm * this.width) + 'px';
    celula.style.height = (sheet.hcm * this.height) + 'px';
    //POSITION
    celula.style.left = (sheet.wcm * this.x) + 'px';
    celula.style.top = (sheet.hcm * this.y) + 'px';

    celula = this.especificacoesEstilo(celula, sheet);
    celula = this.drawObrigatorio(celula, sheet);
    
    this.selfReference.push(celula);

    if (pStats.retInto && pStats.touchComponent) {
      return celula;
    } else {
      return null;
    }

  }
}

class SHEET {
  selfReference = null;
  id = null;
  hcm = 0;
  wcm = 0;
  width = 21.0;
  height = 29.7;
  margem = {
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
  };
  components = [];
  rectConstruct = [];
  inClick = false;
  unionPreviousPage = false;
  constructor(id, margem = {
    "top": 1,
    "bottom": 1,
    "left": 1,
    "right": 1
  }, components = []) {
    this.id = id;
    this.components = components;
    this.margem = margem;
    this.wcm = 2.65 * editor.defaultConfigurations.zoom.x / this.width;
    this.hcm = 2.65 * editor.defaultConfigurations.zoom.y / this.height;
    this.rectConstruct = [];
    this.inClick = false;
  }


  //CREATE SHEET
  createSheet() {
    let newSheet = document.createElement("div");
    newSheet.setAttribute('class', 'sheet');
    newSheet.setAttribute('rel', this.id);
    if(editor.currentAction == 'HANDLE'){
      newSheet.classList.add('gragItems');
    }
    newSheet.insertAdjacentHTML('beforeend', '<div class="addelementTip"><div><b>X (CM):</b><div class="coordXSheet"></div></div> &nbsp;&nbsp;|&nbsp;&nbsp; <div><b>Y (CM):</b><div class="coordYSheet"></div></div></div><div class="classificacaoSheet"><input type="checkbox" name="classificacaoSheet'+this.id+'" id="classificacaoSheet'+this.id+'" rel="'+this.id+'">&nbsp<label for="classificacaoSheet'+this.id+'"><b>Unir com a página anterior</b></label></div><div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div class="content"></div>');
    document.getElementById('classificacaoSheet'+this.id).addEventListener('change', function (e) {
      editor.unirPaginaAnterior(e);
    });
    
    viewManager.append(newSheet);

    this.selfReference = newSheet;
    editor.sheets.push(this);

    this.clickDropElementsSheet();
    this.createMiniSheet();
    editor.setCurrentPage(this.id, true);
    editor.applyMargins(this.id, this.margem);
    this.createAccordeonSheet();

    if (document.querySelector('.nosheetsExist')) {
      document.querySelector('.nosheetsExist').parentElement.removeChild(document.querySelector('.nosheetsExist'));
    }

    //CREATE COMUNS COMPONENTS -> EXTERNAL AFTER!
    editor.comumComponents.forEach(c => {
      let celula = c.draw();
      let currentSheet = this.getSR().querySelector('.content');
      currentSheet.appendChild(celula);
    })

    this.setSizeSheet(editor.defaultConfigurations.zoomPctg);
    this.setBackgroundImageTemplate();
  }



  //CREATE MINISHEET
  createMiniSheet() {
    let paiRef = this;
    listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet" onclick="setCurrentPage(' + this.id + ', true, true)" rel="' + this.id + '"><div class="contentMiniSheet"><p>ID ' + this.id + '</p></div><div class="excluirPagina">Excluir</div></div>');
    let qs = document.querySelector('.minisheet[rel="'+this.id+'"] .excluirPagina');
    qs.addEventListener('click', function (e) {
      let depend = editor.sheets[editor.sheets.findIndex(s => s.unionPreviousPage == paiRef.id)];
      if(depend != undefined) {
        alert('Outra(s) página(s) dependem dessa. Delete elas para prosseguir.');
        return false;
      }
      e.stopPropagation();
      let acdon = listElementsArea.querySelector('.contentAUX .pageAccordeon[rel="'+paiRef.id+'"]');
      acdon.parentElement.removeChild(acdon);

      let mnst = listSheetsArea.querySelector('.minisheet[rel="'+paiRef.id+'"]');
      mnst.parentElement.removeChild(mnst);
      
      editor.sheets.splice(editor.sheets.findIndex(s => s.id == paiRef.id), 1);
      
      paiRef.getSR().parentElement.removeChild(paiRef.getSR());

    })
  }

  setSizeSheet(pctg) {
    let x = (editor.defaultConfigurations.zoom.x * editor.defaultConfigurations.zoomPctg);
    let y = (editor.defaultConfigurations.zoom.y * editor.defaultConfigurations.zoomPctg);

    // Get the element
    var element = this.getSR();

    // Update the width and height values in the inline style
    element.style.width = 'calc(2.65 * ' + x + 'px)';
    element.style.height = 'calc(2.65 * ' + y + 'px)';

    let m = {
      t: (this.margem.top) / this.hcm,
      b: (this.margem.bottom) / this.hcm,
      l: (this.margem.left) / this.wcm,
      r: (this.margem.right) / this.wcm
    }

    this.wcm = 2.65 * x / this.width;
    this.hcm = 2.65 * y / this.height;


    this.setMargem(m.t, m.b, m.l, m.r);

    this.reDrawElements();
  }

  reDrawElements() {
    this.components.forEach(c => {
      c.reDraw(c.draw());
    });

    editor.comumComponents.forEach(c => {
      c.reDraw(c.draw(), this);
    });
  }

  //CREATE PAGE ACCORDION
  //paginaSeparatorAcordeon
  createAccordeonSheet() {
    let paiRef = this;

    let pageAccordeon = document.createElement('div');
    pageAccordeon.setAttribute('class', 'pageAccordeon');
    pageAccordeon.setAttribute('rel', this.id);

    let pageButtonAccordeon = document.createElement('div');
    pageButtonAccordeon.setAttribute('class', 'pageButtonAccordeon');
    pageButtonAccordeon.innerHTML = 'Página - ID ' + this.id;

    let pagePanelAcordeon = document.createElement('div');
    pagePanelAcordeon.setAttribute('class', 'pagePanelAcordeon active');

    pageAccordeon.append(pageButtonAccordeon);
    pageAccordeon.append(pagePanelAcordeon);

    pageButtonAccordeon.addEventListener('click', function (e) {
      document.querySelectorAll('.pageAccordeon').forEach(ac => {
        if (ac.getAttribute('rel') != paiRef.id) {
          ac.querySelector('.pageButtonAccordeon').classList.remove("active");
          ac.querySelector('.pagePanelAcordeon').classList.remove("active");
        }
      })

      pageButtonAccordeon.classList.toggle("active");
      pagePanelAcordeon.classList.toggle("active");
    })

    listElementsArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', pageAccordeon);
  }


  //CLICK AND DROP ELEMENTS TO SHEET
  clickDropElementsSheet() {
    let paiRef = this;
    let content = this.selfReference.querySelector('.content');
    let selectAreaMouse = document.createElement('div');
    selectAreaMouse.setAttribute('class', 'selectAreaMouse');
    let point = document.createElement('div');
    point.setAttribute('class', 'flutpoint');

    let dndraw = true;

    content.addEventListener('mousedown', function (e) {
      paiRef.inClick = true;
      if (editor.currentAction == 'HANDLE') {
        if(editor.shiftPressed){
          editor.selectedGroupComponents = [];
          editor.cntrCGroupComponent = {np: null,el: []};
          editor.cntrCComponent = {np: null,el: {id: null}};
          var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
          var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
          content.append(selectAreaMouse);
          selectAreaMouse.style.top = mouseY + 'px';
          selectAreaMouse.style.left = mouseX + 'px';
          selectAreaMouse.style.width = '0px';
          selectAreaMouse.style.height = '0px';
          paiRef.rectConstruct.push({
            x: mouseX,
            y: mouseY
          });
        } else {
          const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
          if (isFilho) {
            let el = paiRef.components[paiRef.components.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
            if(el == undefined) {
              el = editor.comumComponents[editor.comumComponents.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
            }
            if(content.querySelector('.flutpoint') != null){
              content.removeChild(content.querySelector('.flutpoint'));
            }
            if(editor.selectedGroupComponents.findIndex(f => f.id == el.id) == -1){
              editor.selectedGroupComponents = [];
              editor.cntrCGroupComponent = {np: null,el: []};
              editor.cntrCComponent = {np: null,el: {id: null}};
              Array.from(document.querySelectorAll('.componentPDF')).forEach(c => {
                c.classList.remove('highlight');
                c.classList.add('NOhighlight');
              });
              e.target.classList.remove('NOhighlight');
              e.target.classList.add('highlight');
              editor.selectComponent(paiRef.id, el);
              const rect = el.getSR().getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const mouseY = e.clientY - rect.top;
  
              editor.selectedComponentAnchorMove = {
                x: mouseX,
                y: mouseY
              };
            }
          } else {
            if(content.querySelector('.flutpoint') != null){
              
              if(!e.target.classList.contains("flutpoint")) {
                console.log('123');
                content.removeChild(content.querySelector('.flutpoint'));
                Array.from(document.querySelectorAll('.componentPDF')).forEach(c => {
                  c.classList.remove('highlight');
                  c.classList.add('NOhighlight');
                });
                editor.selectedGroupComponents = [];
              }
            }
          }
        }
      } else {
        if (editor.currentElement == null && editor.currentAction == null) {
          alert('nenhum elemento selecionado!');
        } else {
          switch (e.button) {
            case 0:
              var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
              var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
              content.append(selectAreaMouse);
              selectAreaMouse.style.top = mouseY + 'px';
              selectAreaMouse.style.left = mouseX + 'px';
              selectAreaMouse.style.width = '0px';
              selectAreaMouse.style.height = '0px';
              paiRef.rectConstruct.push({
                x: mouseX,
                y: mouseY
              });
              break;

            case 2:
              var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
              var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
              content.append(selectAreaMouse);
              selectAreaMouse.style.top = mouseY + 'px';
              selectAreaMouse.style.left = mouseX + 'px';
              selectAreaMouse.style.width = '0px';
              selectAreaMouse.style.height = '0px';
              paiRef.rectConstruct.push({
                x: mouseX,
                y: mouseY
              });
              break;
          }
        }
      }
    });

    content.addEventListener('mouseup', function (e) {
      if (paiRef.inClick && editor.currentAction == 'HANDLE') {
        //if(editor.shiftPressed){}
        if(content.querySelector('.selectAreaMouse') != null){
          content.removeChild(selectAreaMouse);
        }

        if(editor.shiftPressed != true && e.target.classList.contains("flutpoint")){
          editor.selectedGroupComponentsProvSquare.moving = false;
          if(dndraw){
            editor.selectedGroupComponents.forEach((rdg) => {
              rdg.setParameters(['x', 'y'], [(rdg.x + (editor.selectedGroupComponentsProvSquare.draw.x - editor.selectedGroupComponentsProvSquare.x)), (rdg.y + (editor.selectedGroupComponentsProvSquare.draw.y - editor.selectedGroupComponentsProvSquare.y))]);
              rdg.setParameterComponent('y', (rdg.y + (editor.selectedGroupComponentsProvSquare.draw.y - editor.selectedGroupComponentsProvSquare.y)));
            });
          }
          editor.selectedGroupComponentsProvSquare={x: 21,y: 29,w: 0,h: 0,moving: false,draw: {x: 0,y: 0}};
          editor.selectedGroupComponents = [];
          paiRef.rectConstruct = [];
          Array.from(document.querySelectorAll('.componentPDF')).forEach(c => {
            c.classList.remove('highlight');
            c.classList.add('NOhighlight');
            if(content.querySelector('.flutpoint') != null){
              content.removeChild(content.querySelector('.flutpoint'));
            }
          });
        }

        paiRef.inClick = false;
        editor.selectedComponentAnchorMove = null;
        paiRef.rectConstruct = [];
        e.target.classList.remove('highlightMoving');
        e.target.classList.add('highlight');
      }
      if (paiRef.inClick && editor.currentAction == 'CREATE') {
        paiRef.inClick = false;
        content.removeChild(selectAreaMouse);
        var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
        var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
        paiRef.rectConstruct.push({
          x: mouseX,
          y: mouseY
        });

        let insertID = 1;
        if (paiRef.components.length > 0) {
          let mid = 0;
          paiRef.components.forEach((e) => {
            let t = Number(e.id.split('_')[1]);
            if(t > mid){
              mid = t;
            }
          });
          insertID = Number(mid) + 1;
        }

        let w = (paiRef.rectConstruct[1].x - paiRef.rectConstruct[0].x) / paiRef.wcm;
        let h = (paiRef.rectConstruct[1].y - paiRef.rectConstruct[0].y) / paiRef.hcm;
        let x = paiRef.rectConstruct[0].x / paiRef.wcm;
        let y = paiRef.rectConstruct[0].y / paiRef.hcm;

        let indexEl = editor.elementos.findIndex(item => item.id === Number(editor.currentElement));
        let free = false;
        if(e.button == 0) free = false;
        if(e.button == 2) free = true;
        let componentToCreate = new editor.elementos[indexEl].class({sheet: paiRef, id: paiRef.id+'_'+insertID, x: x, y: y, width: w, height: h, freeSheet: free, comum: false, informacaoExterna: null});
        paiRef.addElementoToSheetHtml(componentToCreate);

        paiRef.rectConstruct = [];
      }
    });

    content.addEventListener('mousemove', function (e) {
      let tip = paiRef.selfReference.querySelector('.addelementTip');
      var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
      var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
      if (paiRef.inClick && editor.currentAction == 'CREATE' && paiRef.rectConstruct != []) {
        selectAreaMouse.style.width = mouseX - paiRef.rectConstruct[0].x + 'px';
        selectAreaMouse.style.height = mouseY - paiRef.rectConstruct[0].y + 'px';
      }

      editor.mousePositionPage.x = ((mouseX) / paiRef.wcm).toFixed(1);
      editor.mousePositionPage.y = ((mouseY) / paiRef.hcm).toFixed(1);
      tip.querySelector('.coordXSheet').innerHTML = ((mouseX) / paiRef.wcm).toFixed(1);
      tip.querySelector('.coordYSheet').innerHTML = ((mouseY) / paiRef.hcm).toFixed(1);

      if (paiRef.inClick && editor.currentAction == 'HANDLE' && editor.selectedComponent.el?.id != 0 && editor.selectedComponentAnchorMove != null) {
        editor.selectedGroupComponentsProvSquare.moving = false;
        let nx = (((mouseX) / paiRef.wcm) - ((editor.selectedComponentAnchorMove.x / paiRef.wcm)));
        let ny = (((mouseY) / paiRef.hcm) - ((editor.selectedComponentAnchorMove.y / paiRef.hcm)));
        editor.selectedComponent.el.setParameterComponent(parseFloat(nx), 'x');
        editor.selectedComponent.el.setParameterComponent(parseFloat(ny), 'y');
      }

      if(paiRef.inClick && editor.currentAction == 'HANDLE' && editor.shiftPressed == true){
        editor.selectedGroupComponentsProvSquare.moving = false;
        selectAreaMouse.style.width = mouseX - paiRef.rectConstruct[0].x + 'px';
        selectAreaMouse.style.height = mouseY - paiRef.rectConstruct[0].y + 'px';

        for (const elemento of paiRef.components) {
          const { x: elementoX, y: elementoY, width: elementoWidth, height: elementoHeight } = elemento;

          // Verifica se os retângulos estão se sobrepondo
          if (
              paiRef.rectConstruct[0].x / paiRef.wcm < elementoX + elementoWidth &&
              (paiRef.rectConstruct[0].x + (mouseX - paiRef.rectConstruct[0].x)) / paiRef.wcm > elementoX &&
              paiRef.rectConstruct[0].y / paiRef.hcm < elementoY + elementoHeight &&
              (paiRef.rectConstruct[0].y + (mouseY - paiRef.rectConstruct[0].y)) / paiRef.hcm > elementoY
          ) {
             if(!editor.selectedGroupComponents.includes(elemento)) {
              editor.selectedGroupComponents.push(elemento);
              elemento.selfReference[0].classList.remove('NOhighlight');
              elemento.selfReference[0].classList.add('highlight');
             }
          } else {
            elemento.selfReference[0].classList.remove('highlight');
            elemento.selfReference[0].classList.add('NOhighlight')
          }
        }

        editor.selectedGroupComponentsProvSquare.x = 21;
        editor.selectedGroupComponentsProvSquare.y = 29;
        editor.selectedGroupComponentsProvSquare.w = 0;
        editor.selectedGroupComponentsProvSquare.h = 0;
        editor.selectedGroupComponents.forEach(sgc => {
          if(sgc.x < editor.selectedGroupComponentsProvSquare.x){
            editor.selectedGroupComponentsProvSquare.x = sgc.x;
          }
          if(sgc.y < editor.selectedGroupComponentsProvSquare.y){
            editor.selectedGroupComponentsProvSquare.y = sgc.y;
          }
          if((sgc.x + sgc.width) > editor.selectedGroupComponentsProvSquare.w){
            editor.selectedGroupComponentsProvSquare.w = (sgc.x + sgc.width);
          }
          if((sgc.y + sgc.height) > editor.selectedGroupComponentsProvSquare.h){
            editor.selectedGroupComponentsProvSquare.h = (sgc.y + sgc.height);
          }
        });

        
        point.style.top = (editor.selectedGroupComponentsProvSquare.y * paiRef.hcm)+'px';
        point.style.left = (editor.selectedGroupComponentsProvSquare.x* paiRef.wcm)+'px';
        point.style.width = ((editor.selectedGroupComponentsProvSquare.w-editor.selectedGroupComponentsProvSquare.x)* paiRef.wcm) + 'px';
        point.style.height = ((editor.selectedGroupComponentsProvSquare.h - editor.selectedGroupComponentsProvSquare.y)* paiRef.hcm) + 'px';
        if(content.querySelector('.flutpoint') != null){
          content.removeChild(content.querySelector('.flutpoint'));
        }
        content.append(point);
      }

      if(paiRef.inClick && editor.currentAction == 'HANDLE' && editor.shiftPressed != true && (e.target.classList.contains("flutpoint") || editor.selectedGroupComponentsProvSquare.moving == true)){
        editor.selectedGroupComponentsProvSquare.moving = true;

        if((parseFloat(point.style.width) / paiRef.wcm) >= ((paiRef.width - ((paiRef.margem.left + paiRef.margem.right)  / paiRef.wcm))*0.85)){
          point.style.top = Number(mouseY - (parseFloat(point.style.height) / 2))+'px';
        } else {
          point.style.left = Number(mouseX - (parseFloat(point.style.width) / 2))+'px';
          point.style.top = Number(mouseY - (parseFloat(point.style.height) / 2))+'px';
        }
        
        let locdndraw = true;
        for (const elemento of paiRef.components.filter(pec => !editor.selectedGroupComponents.includes(pec))) {
          const { x: elementoX, y: elementoY, width: elementoWidth, height: elementoHeight } = elemento; 
          
          console.log((parseFloat(point.style.width) / paiRef.wcm)+', '+(parseFloat(point.style.height) / paiRef.hcm));

            if (
              parseFloat(point.style.left) / paiRef.wcm <= elementoX + elementoWidth &&
              (parseFloat(point.style.left) / paiRef.wcm) + (parseFloat(point.style.width) / paiRef.wcm) >= elementoX &&
              parseFloat(point.style.top) / paiRef.hcm <= elementoY + elementoHeight &&
              (parseFloat(point.style.top) / paiRef.hcm) + (parseFloat(point.style.height) / paiRef.hcm) >= elementoY
            ) {
              point.style.backgroundColor = 'rgba(255,0,0,0.15)';
              locdndraw = false;
              break;
            }
        }
        dndraw = locdndraw;
        if(locdndraw){
          editor.selectedGroupComponentsProvSquare.draw.x = parseFloat(point.style.left) / paiRef.wcm;
          editor.selectedGroupComponentsProvSquare.draw.y = parseFloat(point.style.top) / paiRef.hcm;
          point.style.backgroundColor = '';
        }
      }
    });

    content.addEventListener('mouseover', function (e) {
      if(paiRef.inClick) return false;
      if (editor.currentAction == 'HANDLE') {
        if(editor.selectedGroupComponents.findIndex(f => f.id == e.target.getAttribute('rel')) != -1) return false;
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          e.target.classList.add('highlight');
          e.target.classList.remove('NOhighlight');
          e.target.classList.remove('highlightMoving');
        }
      }
    });

    content.addEventListener('mouseout', (e) => {
      if(paiRef.inClick) return false;
      if (editor.currentAction == 'HANDLE') {
        if(editor.selectedGroupComponents.findIndex(f => f.id == e.target.getAttribute('rel')) != -1) return false;
        // Verifica se o alvo do evento é um filho do paiElemento
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          if (editor.selectedComponent.el?.id != e.target.getAttribute('rel')) {
            e.target.classList.add('NOhighlight');
            e.target.classList.remove('highlight');
            e.target.classList.remove('highlightMoving');
          }
        }
      }
    });
  }

  //POSITION COMPONENTS DATA
  intoContentRect(mxy, free, elID, comum) {

    let l;
    let t;
    let r;
    let b;

    if(free){
      l = 0;
      t = 0;
      r = this.getSR().getBoundingClientRect().width;
      b = this.getSR().getBoundingClientRect().height;
    } else {

      // - 1 : Feito para ignorar as linhas de 1px das margens!

      l = this.margem.left - 0.1;
      t = this.margem.top - 0.1;
      r = this.getSR().getBoundingClientRect().width - (this.margem.right - 0.1);
      b = this.getSR().getBoundingClientRect().height - (this.margem.bottom - 0.1);

    }
    let retInto = true;
    let touchComponent = true;
    let retClick = false;
    
    mxy.forEach((p) => {
      let mx = p.x;
      let my = p.y;
      if ((mx < l || mx > r || my < t || my > b) && retInto == true) {
        retInto = false;
       /*  console.log(mx);
        console.log(my);
        console.log(l);
        console.log(r);
        console.log(t);
        console.log(b); */
      }
    });

    for (let i = -10; i <= 10; i++) {
      for (let ii = -10; ii <= 10; ii++) {
        if ((mxy[0].y + ii === mxy[1].y) && (mxy[0].x + i === mxy[1].x)) {
          retClick = true;
        }
      }
    }


    //Verificando componentes ao redor
    if(!comum){
      touchComponent = editor.verificarSobreposicao(this.components.filter((numero) => numero.id != elID), mxy[0].x/this.wcm, mxy[0].y/this.hcm, ((mxy[1].x/this.wcm)-(mxy[0].x/this.wcm)), ((mxy[1].y/this.hcm) - (mxy[0].y/this.hcm)));
    }

    //retorno
    return {
      retInto: retInto,
      touchComponent: touchComponent,
      retClick: retClick,
    };
  }


  //ADD ELEMENT TO SHEET - HTML
  addElementoToSheetHtml(ne) {
    let celula = ne.draw();
    if (celula != null) {
      let currentSheet = this.getSR().querySelector('.content');
      currentSheet.appendChild(celula);
      this.components.push(ne);
      editor.addToMyElements(ne, this.id);
    } else {
      alert('Elemento sobreposto ou fora de sua regra de criação!');
    }
  }


  //setMargin
  setMargem(top, bottom, left, right) {
    this.margem = {
      "top": (this.hcm * top),
      "bottom": (this.hcm * bottom),
      "left": (this.wcm * left),
      "right": (this.wcm * right)
    };
    var marginsh = this.getSR().getElementsByClassName("mh");
    var marginsv = this.getSR().getElementsByClassName("mv");

    Array.from(marginsh).forEach(element => {
      if (element.classList.contains("mleft")) {
        element.style.left = this.margem.left + 'px';
      }
      if (element.classList.contains("mright")) {
        element.style.right = this.margem.right + 'px';
      }
    });

    Array.from(marginsv).forEach(element => {
      if (element.classList.contains("mbottom")) {
        element.style.bottom = this.margem.bottom + 'px';

      }
      if (element.classList.contains("mtop")) {
        element.style.top = this.margem.top + 'px';
      }
    });

    let content = this.getSR().querySelector('.content');
    content.style.padding = this.margem.top + "px " + this.margem.right + "px " + this.margem.bottom + "px " + this.margem.left + "px;";

    this.margem = {
      "top": (this.hcm * top),
      "bottom": (this.hcm * bottom),
      "left": (this.wcm * left),
      "right": (this.wcm * right)
    };

  }

  getSR() {
    return this.selfReference;
  }

  setBackgroundImageTemplate(){
    let url = editor.templateModelBackground;
    let content = this.getSR().querySelector('.content');
    if(url == null){
      content.classList.remove('backgroundSheetTemplate');
      content.style.backgroundImage = 'none';
    } else {
      content.classList.add('backgroundSheetTemplate');
      content.style.backgroundImage = url;
    }
  }
}