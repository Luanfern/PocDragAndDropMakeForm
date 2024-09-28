import { cssFiles } from "./constants/filesImport.js";
import { interfaceGraficaEditor } from "./constants/interfaceGRI.js";
import { editorElementos } from "./constants/editorElementos.js";
import { SHEET } from "./implementations/sheetPdf.js";

//MAIN SYSTEM EDITOR PDF

export class PdfEditor{

  // -- control variables
  upgalertInfo = false;

  // -- html elements VARIABLES
  viewManager = null;
  newPageButton = null;
  saveNameButton = null;
  pagesListButton = null;
  elementsButton = null;
  listSheetsArea = null;
  listElementsArea = null;
  configSheetArea = null;
  closeAreas = null;
  openAreas = null;
  elementsdropdown = null;
  zoomActions = null;

  // -- modal
  modal = null;
  configbtn = null;
  span = null;
  btnapply = null; 

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
  fileName = 'DIRECTA-FILE';
  
  constructor(config, fileName, onSave, getJson, getImages, getFields, getRelativePath) {
    if (typeof onSave !== 'function') throw new Error('Ação onSave não especificada!');
    if (typeof getJson !== 'function') throw new Error('Ação getJson não especificada!');
    if (typeof getImages !== 'function') throw new Error('Ação getImages não especificada!');
    if (typeof getFields !== 'function') throw new Error('Ação getFields não especificada!');
    this.config = config;
    this.fileName = fileName;
    this.onSave = onSave;
    this.getJson = getJson;
    this.getImages = getImages;
    this.getFields = getFields;
    this.relativePath = getRelativePath;
  }

  getHtmlElements(){
    this.viewManager = document.querySelector('#viewManager');
    this.newPageButton = document.querySelector("#newPage");
    this.saveNameButton = document.querySelector("#salvarNome");
    this.pagesListButton = document.querySelector("#pagesList");
    this.elementsButton = document.querySelector("#elements");
    this.listSheetsArea = document.querySelector("#listSheets");
    this.listElementsArea = document.querySelector("#listElements");
    this.configSheetArea = document.querySelector("#configSheet");
    this.closeAreas = document.querySelectorAll('.closeArea');
    this.openAreas = document.querySelectorAll('.openArea');
    this.elementsdropdown = document.querySelector('#myDropDownElements');
    this.zoomActions = document.querySelector('#zoomActions');
    this.modal = document.getElementById("myModal");
    this.configbtn = document.getElementById("config");
    this.span = document.getElementsByClassName("close")[0];
    this.btnapply = document.getElementsByClassName("btnapply")[0];
  }

  controlsEditor(){
    let t = this;
    //MODAL CONTROLLS
    this.configbtn.addEventListener('click', function (e) {
      document.getElementById('verticalMT').value = t.defaultConfigurations.margens.top;
      document.getElementById('verticalMR').value = t.defaultConfigurations.margens.bottom;
      document.getElementById('horizontalME').value = t.defaultConfigurations.margens.left;
      document.getElementById('horizontalMD').value = t.defaultConfigurations.margens.right;
      this.modal.style.display = "block";
    });
    
    this.span.onclick = function () {
      this.modal.style.display = "none";
      document.getElementById('verticalMT').value = t.defaultConfigurations.margens.top;
      document.getElementById('verticalMR').value = t.defaultConfigurations.margens.bottom;
      document.getElementById('horizontalME').value = t.defaultConfigurations.margens.left;
      document.getElementById('horizontalMD').value = t.defaultConfigurations.margens.right;
    }
    this.btnapply.onclick = function () {
      this.modal.style.display = "none";
      t.defaultConfigurations.margens.top = document.getElementById('verticalMT').value;
      t.defaultConfigurations.margens.bottom = document.getElementById('verticalMR').value;
      t.defaultConfigurations.margens.left = document.getElementById('horizontalME').value;
      t.defaultConfigurations.margens.right = document.getElementById('horizontalMD').value;
    
      if(document.querySelector("#templatemodelbackgroundBTN").files[0] != undefined){
        
        const reader = new FileReader();
        reader.onload = function(e) {
          const url = e.target.result;
          t.templateModelBackground = `url('${url}')`;
          t.sheets.forEach(s => s.setBackgroundImageTemplate());
        };
        reader.readAsDataURL(document.querySelector("#templatemodelbackgroundBTN").files[0]);
    
      } else if(document.querySelector("#templatemodelbackgroundTEXT").value != ''||document.querySelector("#templatemodelbackgroundTEXT").value != null || document.querySelector("#templatemodelbackgroundTEXT").value != undefined) {
        const url = document.querySelector("#templatemodelbackgroundTEXT").value;
        t.templateModelBackground = `url('${url}')`;
        t.sheets.forEach(s => s.setBackgroundImageTemplate());
      } else {
        t.templateModelBackground = null;
        t.sheets.forEach(s => s.setBackgroundImageTemplate());
      }
    
    }
    window.onclick = function (event) {
      if (event.target == this.modal) {
        this.modal.style.display = "none";
      }
    }

    //SCROLL ACTIONS
    this.viewManager.addEventListener('wheel', function (p) {
      t.sheetpredominante();
    });


    //KEYBOARD ACTIONS
    window.addEventListener('keydown', function(event) {  
      if ((event.key === 'Z' || event.key === 'z') && (event.ctrlKey || event.metaKey)) {
          if(t.selectedComponent.el != null){
            t.selectedComponent.el.rollback();
          }
      }

      if ((event.key === 'C' || event.key === 'c') && (event.ctrlKey || event.metaKey)) {
        if(t.selectedGroupComponents.length > 0){
          t.cntrCGroupComponent.el = t.selectedGroupComponents;
          t.cntrCGroupComponent.np = t.currentPage ?? t.selectedGroupComponents[0].sheet.id;
        } else {
          if(t.selectedComponent.el != null){
            t.cntrCComponent.el = t.selectedComponent.el;
            t.cntrCComponent.np = t.selectedComponent.np;
          }
        }
      }

      if ((event.key === 'V' || event.key === 'v') && (event.ctrlKey || event.metaKey)) {
        if(t.cntrCGroupComponent.el.length > 0){
          let content = t.cntrCGroupComponent.np.selfReference.querySelector('.content');
          let fp = content.querySelector('.flutpoint');
          if(fp != null){
            if((parseFloat(fp.style.width) / t.cntrCGroupComponent.np.wcm) >= ((t.cntrCGroupComponent.np.width - ((t.cntrCGroupComponent.np.margem.left + t.cntrCGroupComponent.np.margem.right)  / t.cntrCGroupComponent.np.wcm))*0.75)){
              fp.style.top = Number((t.mousePositionPage.y * t.cntrCGroupComponent.np.hcm) - (parseFloat(fp.style.height) / 2))+'px';
            } else {
              fp.style.left = Number((t.mousePositionPage.x * t.cntrCGroupComponent.np.wcm) - (parseFloat(fp.style.width) / 2))+'px';
              fp.style.top = Number((t.mousePositionPage.y * t.cntrCGroupComponent.np.hcm) - (parseFloat(fp.style.height) / 2))+'px';
            }

            let cabdrawPaste = t.verificarSobreposicao(t.cntrCGroupComponent.np.components.filter(pec => !t.cntrCGroupComponent.el.includes(pec)),
            (parseFloat(fp.style.left)/t.cntrCGroupComponent.np.wcm), (parseFloat(fp.style.top)/t.cntrCGroupComponent.np.hcm),
            (parseFloat(fp.style.width)/t.cntrCGroupComponent.np.wcm), (parseFloat(fp.style.height)/t.cntrCGroupComponent.np.hcm));

            t.selectedGroupComponentsProvSquare.draw.x = (parseFloat(fp.style.left)/t.cntrCGroupComponent.np.wcm);
            t.selectedGroupComponentsProvSquare.draw.y = (parseFloat(fp.style.top)/t.cntrCGroupComponent.np.hcm);

            if(cabdrawPaste){
              t.cntrCGroupComponent.el.forEach((rdg) => {
                rdg.copyPaste(3, (rdg.x + (t.selectedGroupComponentsProvSquare.draw.x - t.selectedGroupComponentsProvSquare.x)), (rdg.y + (t.selectedGroupComponentsProvSquare.draw.y - t.selectedGroupComponentsProvSquare.y)));
              });
            }
        }
        t.selectedGroupComponentsProvSquare={x: 21,y: 29,w: 0,h: 0,moving: false,draw: {x: 0,y: 0}};
        t.selectedGroupComponents = [];
        t.cntrCGroupComponent = {np: null,el: []};

        } else {
          if(t.cntrCComponent.el.id != null){
            t.cntrCComponent.el.copyPaste(1);
            t.cntrCComponent.el = {id: null};
            t.cntrCComponent.np = null;
          }
        }
      }
      if ((event.key === 'B' || event.key === 'b') && (event.ctrlKey || event.metaKey)) {
        if(t.cntrCComponent.el.id != null){
          t.cntrCComponent.el.copyPaste(2);
        }
      }
      if (event.key === 'DELETE' || event.key === 'Delete') {
        if(t.selectedComponent.el != null){
          
        }
      }
      if (event.key === 'Shift') {
        t.shiftPressed = true;
      }
      if (event.key === 'Control') {
        t.ctrlPressed = true;
      }
    });

    window.addEventListener('keyup', function(event) { 
      if (event.key === 'Shift') {
        t.shiftPressed = false;
      }
      if (event.key === 'Control') {
        t.ctrlPressed = false;
      }  
    });
   
    //BTN ACTIONS 
    /* document.querySelector('#publish.gen').addEventListener('click', function (e) {
      t.preview()
    }); */

    document.querySelector('#publish.save').addEventListener('click', function (e) {
      t.save();
    });

    this.zoomActions.querySelector('.moreZoom').addEventListener('click', function (e) {
      let z = parseFloat((t.defaultConfigurations.zoomPctg + 0.1));
      t.defaultConfigurations.zoomPctg = z;
      this.zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
      t.sheets.forEach(s => {
        s.setSizeSheet(z);
      });
    });
    
    this.zoomActions.querySelector('.lessZoom').addEventListener('click', function (e) {
      let z = (t.defaultConfigurations.zoomPctg - 0.1);
      t.defaultConfigurations.zoomPctg = z;
      this.zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
      t.sheets.forEach(s => {
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
      t.currentAction = 'HANDLE';
      //t.currentElement = null;
    });

    this.pagesListButton.addEventListener('click', function (e) {
      this.listSheetsArea.classList.toggle("show");
    });

    this.elementsButton.addEventListener('click', function (p) {
      t.elementsDropDown();
    });

    document.querySelector('#currentElement').addEventListener('click', function () {
      t.selectedAddElement(t.currentElement, false);
    });

    this.closeAreas.forEach(ca => {
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
    
    this.openAreas.forEach(ca => {
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
    this.newPageButton.addEventListener("click", function () {
      t.criarpaginafe();
    });
  }

  async start(data, json) {
    cssFiles.forEach(element => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.relativePath+'/css/'+element;
      console.log(link.href);
      document.head.appendChild(link);
    });

    let container = document.getElementById('editor-pdf-container');
    container.innerHTML = interfaceGraficaEditor;

    this.getHtmlElements();
    this.systemStartEvents();
    this.controlsEditor();

    this.currentAction = 'CREATE';
  }

  criarpaginafe(e) {
    new SHEET(this ,this.incrementPageId, this.defaultConfigurations.margens).createSheet();
    this.incrementPageId = this.incrementPageId + 1;
  }

  systemStartEvents(){
    let t = this;
    t.initial();
    /* window.addEventListener('load', function () {
      t.initial();
    });     */
  }

  initialRequests() {
    return new Promise((resolve, reject) => {
      this.getImages().then((r) => {
        this.listImagesPDF = r;
        this.getFields().then((t) => {
          this.listFieldsPDF = t;
          resolve();
        })
      })
  });
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
    this.listSheetsArea.querySelectorAll('.minisheet').forEach((m) => {
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
      this.listSheetsArea.classList.toggle("show");
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
  
    this.listElementsArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', pageAccordeon);
  }


  //STOPPED HERE
  addToMyElements(el, np) {
    let t = this;
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
  
    let p = this.listElementsArea.querySelector('.contentAUX').querySelector('.pageAccordeon[rel="' + np + '"]').querySelector('.pagePanelAcordeon');
    p.insertAdjacentElement('afterbegin', me);
  
    el.addConnection('text', ['text'], me);
  
    deleteComp.addEventListener('click', function (e) {
      e.stopPropagation();
      if (confirm("Deseja excluir o componente " + el.text + " ?") == true) {
        if (el.deleteMe()) {
          me.parentNode.removeChild(me);
          if (this.configSheetArea.querySelectorAll('.contentAUX .inpConfig')[0].getAttribute('rel') == el.id) {
            this.configSheetArea.querySelector('.currentElement').textContent = 'Sem Elemento...';
            this.configSheetArea.querySelector('.contentAUX').innerHTML = '';
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
      t.selectComponent(np, el);
    })
  
    me.addEventListener('mouseover', function (e) {
      if (t.currentAction == 'HANDLE') {
        el.getSR().classList.add('highlight');
        el.getSR().classList.remove('NOhighlight');
      }
    });
  
    me.addEventListener('mouseout', (e) => {
      if (t.currentAction == 'HANDLE') {
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
    this.configSheetArea.querySelector('.currentElement').textContent = el.text;
    Array.from(this.listElementsArea.querySelectorAll('.pagePanelAcordeon .myElement')).forEach(accds => {
      if (accds.getAttribute('rel') == el.id) {
        accds.classList.add('active');
      } else {
        accds.classList.remove('active');
      }
    })
    this.createFormFromElement(el)
  }
  
  createFormFromElement(e) { //CREATE FORM OF COMPONENT PROPERTIES
    this.configSheetArea.querySelector('.contentAUX').innerHTML = '';
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
      this.configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);
    }
  
    if(e.freeSheet){ //TORNAR COMUM ENTRE PAGINAS
      let inpArea = document.createElement('div');
      inpArea.setAttribute('class', 'inpConfig');
      inpArea.setAttribute('rel', e.id);
      let btnComum = document.createElement('button');
      btnComum.innerHTML = "Tornar Comum";
      btnComum.setAttribute("type", "button");
      inpArea.append(btnComum);
      this.configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);
      btnComum.addEventListener("click", function() {
        var result = window.confirm("Tornar o elemento "+e.text+" comum ? (irreversível)");
        if (result) {
          e.changeComumComponent();
        }
      });
    }
  }
  
  unirPaginaAnterior(checkbox) {
    if(this.upgalertInfo == false){
      alert('Ao realizar essa alteração, o conteúdo desta página será continuado a partir da página anterior. Esse método é particularmente útil em situações envolvendo multicélulas ou componentes que expandem dinamicamente.\nSe a página anterior não estiver completamente preenchida, os elementos desta página a complementarão. Se, por acaso, esses elementos forem suficientes para preencher toda a página atual, ela não será carregada.');
      this.upgalertInfo = true;
    }
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
    this.elementsButton.parentElement.parentElement.querySelector('#myDropDownElements').classList.toggle("show");
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

      //Utilizar Descrição do Elemento
        this.elementos = editorElementos(this.listFieldsPDF, this.listImagesPDF);

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

          let t = this;
          component.addEventListener('click', function (p) {
            t.selectedAddElement(component);
          });
          this.elementsdropdown.append(component)
        })

        console.log(this.elementos);

        this.createAccordeonComumComponents();

        this.getJson().then((r) => {
          //console.log(r);

          this.loadPDFJSON(r).then(() => {

            this.zoomActions.querySelector('.zoomValue').innerHTML = (Number(this.defaultConfigurations.zoomPctg) * 100).toFixed(2) + '%';

            if (this.sheets.length == 0) {
              let t = this;
              this.viewManager.insertAdjacentHTML('beforeend', '<div class="nosheetsExist" rel="temporary"><p>Sem páginas.</p><p><b>Para Iniciar, clique em: </b></p><p><div id="SPparaIniciarCliqueEmAddPag" class="btnMenu">&#43; Página</div></p></div>');
              document.getElementById('SPparaIniciarCliqueEmAddPag').addEventListener('click', function (p) {
                t.criarpaginafe(p);
              });
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
      if (key === 'components'|| key === 'selfReference' || key === 'connections' || key === 'lastStatusOk'|| key === 'editor') {
        return undefined;
      }
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      return value;
    };
    let alljs = "{\"ACAO\":1, \"FILE\":\""+this.fileName+"\", \"defaultConfigurations\":"+JSON.stringify(this.defaultConfigurations)+",\"incrementPageId\":"+this.incrementPageId+",\"datas\": \"213\",\"sheets\": "+JSON.stringify(this.sheets, replacer)+" , \"componentes\": "+JSON.stringify(compsToPDF, replacer)+", \"comuns\": "+JSON.stringify(this.comumComponents, replacer)+"}";
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
      if (key === 'components'|| key === 'selfReference' || key === 'connections' || key === 'lastStatusOk' || key === 'editor') {
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
    this.upgalertInfo = true;
    
    const jsonParsed = JSON.parse(json);
    this.incrementPageId = jsonParsed.incrementPageId;
    this.defaultConfigurations = jsonParsed.defaultConfigurations;
    
    jsonParsed.sheets.forEach(s => {
      new SHEET(this ,s.id, {top: s.margem.top / s.hcm,
        bottom: s.margem.bottom / s.hcm,
        left: s.margem.left / s.wcm,
        right: s.margem.right / s.wcm
      }, []).createSheet();
      let sRef = this.sheets.find(function(objeto) {return objeto.id === s.id;});
      jsonParsed.componentes[s.id][0].forEach(c => {
        let elementInstance = this.elementos[this.elementos.findIndex(item => item.className === c.elementType)];
  
        c.editor = this;
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
      c.editor = this;
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