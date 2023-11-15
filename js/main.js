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

let defaultConfigurations = {
  zoom: {x: 210, y:297},
  zoomPctg: 1.0
}

let elementos = []

let incrementPageId = 1;

let currentElement = null;

let selectedComponent = {
  np: 0,
  el: {id: 0}
};

let selectedComponentAnchorMove = null;

let currentAction = null;

let sheets = [];

window.addEventListener('load', function () {
  //INICIAL

  elementos = [{
    id: 1,
    nome: "Célula",
    icon: " &#9633",
    class: Celula,
    className: 'Celula',
    configuracoes: {
      x: {
        icon: "",
        label: "eixo X",
        type: "number"
      },
      y: {
        icon: "",
        label: "eixo Y",
        type: "number"
      },
      width: {
        icon: "",
        label: "largura",
        type: "number"
      },
      height: {
        icon: "",
        label: "altura",
        type: "number"
      },
      talign: {
        icon: "",
        label: "alinhamento",
        type: "text"
      },
      tfont: {
        icon: "",
        label: "fonte - texto",
        type: "text"
      },
      tsize: {
        icon: "",
        label: "tamanho - texto",
        type: "number"
      },
      tweight: {
        icon: "",
        label: "grossura - texto",
        type: "text"
      },
      tcolor: {
        icon: "",
        label: "cor - texto",
        type: "color"
      },
      text: {
        icon: "",
        label: "texto",
        type: "text"
      },
      bcolor: {
        icon: "",
        label: "cor de fundo",
        type: "color"
      },
      border: {
        icon: "",
        label: "borda",
        type: "text"
      },
      borderwidth: {
        icon: "",
        label: "tamanho - borda",
        type: "number"
      },
      bordercolor: {
        icon: "",
        label: "cor - borda",
        type: "color"
      },
      last: {
        icon: "",
        label: "Último elemento ? (1 = S ,0 = N)",
        type: "number"
      },
      link: {
        icon: "",
        label: "link",
        type: "text"
      },
    }
  }]

  elementos.forEach((el) => {
    let component = '<div class="el" rel="' + el.id + '" onclick="selectedAddElement(this)" ><div class="icon">' + el.icon + '</div>' + el.nome + '</div>';
    elementsdropdown.insertAdjacentHTML('beforeend', component)
  })

  if (sheets.length == 0) {
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
});



//CLASSES
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

class Celula {
  selfReference = null;
  id = null
  x = 0; //
  y = 0; //
  sheet = null;
  width = 10; //
  height = 0.4; //
  talign = "C"; //
  tfont = "Arial"; //
  tsize = 7; //
  tweight = ""; //
  tcolor = "#000000"; //
  text = "DIRECTA TEXT!"; //
  bcolor = "#ffffff"; //
  border = "";
  borderwidth = 0.04;
  bordercolor = "#ffffff";
  last = 0; //
  link = ""; //
  connections = [];
  constructor(sheet, id, text = "DIRECTA TEXT!",x=0, y=0, width = 10, height = 0.4, tcolor = "#000000", talign = "L", tfont = "Arial", tsize = 7, tweight = "", bcolor = "#ffffff", bordersides = "", borderwidth = "", bordercolor = "#ffffff", last = 0, link = "", ) {
    if(sheet == null || sheet == undefined || id == null || id == undefined) throw Error('SEM SHEET DEFINIDA PARA A CÉLULA!');
    this.text = text;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.last = last;
    this.link = link;
    this.bcolor = bcolor;
    this.tcolor = tcolor;
    this.talign = talign;
    this.tfont = tfont;
    this.tsize = tsize;
    this.tweight = tweight;
    this.border = bordersides;
    this.borderwidth = borderwidth;
    this.bordercolor = bordercolor;
    this.sheet = sheet;
    this.id = id;
  }

  draw() {

    let pStats =  this.sheet.intoContentRect([{x: (this.sheet.wcm * this.x), y: (this.sheet.hcm * this.y)}, {x: (this.width+this.x)*this.sheet.wcm, y: (this.height+this.y)*this.sheet.hcm}]);

    let celula = document.createElement("div");
    celula.setAttribute("rel", this.id);

    //BACKGROUND COLOR
    celula.style.backgroundColor = this.bcolor;

    //POSITION
    celula.style.left = (this.sheet.wcm * this.x) + 'px';
    celula.style.top = (this.sheet.hcm * this.y) + 'px';

    //HEIGHT - WIDTH
    celula.style.width = (this.sheet.wcm * this.width) + 'px';
    celula.style.height = (this.sheet.hcm * this.height) + 'px';

    //TEXT
    var text = document.createTextNode(this.text);
    celula.style.fontFamily = this.tfont;

    let fs = this.sheet.hcm * (parseFloat(this.tsize) / (72 / 2.56));
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

    //BORDER
    let sidesSplit = this.border.split('');
    sidesSplit.forEach((e) => {
      let sd = sideChars[e];
      let w = this.sheet.hcm * this.borderwidth;
      celula.style[sd] = w + "px solid " + this.bordercolor;
    })

    celula.setAttribute('class', 'componentPDF');

    celula.appendChild(text);

    this.selfReference = celula;

    if (pStats.retInto) {
      return celula;
    } else {
      return null;
    }

  }


  //SET PARAMETERS CALL
  setParameterComponent(value, parametro) {
    //sheet
    let oldValues = [];
    [parametro].forEach((pi, k) => {
      oldValues.push(this[pi]);
    })

    if(!isNaN(value)){
    this.setParameters([parametro], [parseFloat(value.toFixed(2))]);
    } else {
      this.setParameters([parametro], [value]);
    }

    let d = this.draw();
    if (d == null) {
      this.setParameters([parametro], oldValues);
    } else {
      this.reDraw(d);
    }
  }

  reDraw(d){
    let pai = this.sheet.getSR().querySelector('.componentPDF[rel="' + this.id + '"]').parentElement;
      let subs = this.sheet.getSR().querySelector('.componentPDF[rel="' + this.id + '"]');
      pai.replaceChild(d, subs);
  }

  addConnection(type, rels, comp){
    this.connections.push({type: type, rels: rels, comp: comp});
  };


  updateConnectionsINF(){
    this.connections.forEach(c => {
      c.rels.forEach(rel => {
        if (c.type == 'text') {
          c.comp.querySelector('[rel="'+rel+'"]').innerHTML = this[rel];
        } else if(c.type == 'input'){
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

    this.updateConnectionsINF();
  }

  getSR() {
    return this.selfReference;
  }

  changeOrder(c){
    let selfIndex = this.sheet.components.findIndex(i => i.id == this.id);

    if(c == 'up'){
      try {
        let nxt = this.sheet.components[selfIndex+1];
        if(nxt == null) return false;

        let tonxt = this.getSR().parentElement.querySelector('div.componentPDF[rel="'+nxt.id+'"]');
        let tis = this.getSR().parentElement.querySelector('div.componentPDF[rel="'+this.id+'"]');
        tis.parentElement.insertBefore(tonxt, tis);

        this.sheet.components[selfIndex+1] = this.sheet.components[selfIndex];
        this.sheet.components[selfIndex] = nxt;
      } catch (error) {
        console.log(error);
      }

    }
    if(c == 'down'){
      try {
        let nxt = this.sheet.components[selfIndex-1];
        if(nxt == null) return false;

        let tonxt = this.getSR().parentElement.querySelector('div.componentPDF[rel="'+nxt.id+'"]');
        let tis = this.getSR().parentElement.querySelector('div.componentPDF[rel="'+this.id+'"]');
        tonxt.parentElement.insertBefore(tis, tonxt);

        this.sheet.components[selfIndex-1] = this.sheet.components[selfIndex];
        this.sheet.components[selfIndex] = nxt;
      } catch (error) {
        console.log(error);
      }

    }
  }

  deleteMe(){
    try {
      this.sheet.components.splice(this.id, 1);
      this.getSR().parentElement.removeChild(this.getSR());
      return true;
    } catch (error) {
      return false
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
  constructor(id, margem = {
    "top": 1,
    "bottom": 1,
    "left": 1,
    "right": 1
  }, components = []) {
    this.id = id;
    this.components = components;
    this.margem = margem;
    this.wcm = 2.65 * defaultConfigurations.zoom.x / this.width;
    this.hcm = 2.65 * defaultConfigurations.zoom.y / this.height;
    this.rectConstruct = [];
    this.inClick = false;
  }


  //CREATE SHEET
  createSheet() {
    let newSheet = document.createElement("div");
    newSheet.setAttribute('class', 'sheet');
    newSheet.setAttribute('rel', this.id);
    newSheet.addEventListener("click", function () {})
    newSheet.insertAdjacentHTML('beforeend', '<div class="addelementTip"><div><b>X (CM):</b><div class="coordXSheet"></div></div> &nbsp;&nbsp;|&nbsp;&nbsp; <div><b>Y (CM):</b><div class="coordYSheet"></div></div></div><div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div class="content"></div>');
    viewManager.append(newSheet);

    this.selfReference = newSheet;
    sheets.push(this);

    this.clickDropElementsSheet();
    this.createMiniSheet();
    setCurrentPage(this.id, true);
    applyMargins(this.id, false);
    this.createAccordeonSheet();

    console.log('ADICIONANDO PÁGINA: ' + this.id)
  }



  //CREATE MINISHEET
  createMiniSheet() {
    listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet" onclick="setCurrentPage(' + this.id + ', true, true)" rel="' + this.id + '"><p>' + this.id + '</p></div>');
  }

  setSizeSheet(pctg){
    let x = (defaultConfigurations.zoom.x * pctg);
    let y = (defaultConfigurations.zoom.y * pctg);

        // Get the element
    var element = this.getSR();

    // Update the width and height values in the inline style
    element.style.width = 'calc(2.65 * ' + x + 'px)';
    element.style.height = 'calc(2.65 * ' + y + 'px)';

    let m = {
      t: (this.margem.top+0.1)/this.hcm,
      b: (this.margem.bottom+0.1)/this.hcm,
      l: (this.margem.left+0.1)/this.wcm,
      r: (this.margem.right+0.1)/this.wcm
    }

    this.wcm = 2.65 * x / this.width;
    this.hcm = 2.65 * y / this.height;


    this.setMargem(m.t, m.b, m.l, m.r);

    this.reDrawElements();
  }

  reDrawElements(){
    this.components.forEach(c => {
      c.reDraw(c.draw());
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
    pageButtonAccordeon.innerHTML = 'Página ' + this.id;

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

    content.addEventListener('mousedown', function (e) {
      paiRef.inClick = true;
      if(currentAction == 'HANDLE'){
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          let el = paiRef.components[paiRef.components.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
         selectComponent(paiRef.id, el);
         const rect = el.getSR().getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

         selectedComponentAnchorMove = {x: mouseX, y: mouseY};
        }
      }else {
        if (currentElement == null && currentAction == null) {
          alert('nenhum elemento selecionado!');
        } else {
          switch (e.button) {
            case 0:
              var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
              var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
              content.append(selectAreaMouse);
              selectAreaMouse.style.top = mouseY+'px';
              selectAreaMouse.style.left = mouseX+'px';
              selectAreaMouse.style.width ='0px';
              selectAreaMouse.style.height ='0px';
              paiRef.rectConstruct.push({x: mouseX, y: mouseY});
              break;
          }
        }
      }
    });

    content.addEventListener('mouseup', function (e) {
      if(paiRef.inClick && currentAction == 'HANDLE'){
        selectedComponentAnchorMove = null;
        paiRef.inClick = false;
      }
      if(paiRef.inClick && currentAction == 'CREATE'){
        content.removeChild(selectAreaMouse);
        paiRef.inClick = false;
        var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
        var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
        paiRef.rectConstruct.push({x: mouseX, y: mouseY});

        let insertID = 1;
        if(paiRef.components.length > 0){
          insertID = paiRef.components.at(-1).id+1;
        }

        let w = (paiRef.rectConstruct[1].x - paiRef.rectConstruct[0].x) / paiRef.wcm;
        let h = (paiRef.rectConstruct[1].y - paiRef.rectConstruct[0].y) / paiRef.hcm;
        let x = paiRef.rectConstruct[0].x / paiRef.wcm;
        let y = paiRef.rectConstruct[0].y / paiRef.hcm;
        
        let indexEl = elementos.findIndex(item => item.id === Number(currentElement));
        let componentToCreate = new elementos[indexEl].class(paiRef, insertID, undefined, x, y, w, h, undefined, "C", undefined, undefined, "B", undefined, "B", 0.04, '#FF0000', 1, undefined);
        paiRef.addElementoToSheetHtml(componentToCreate);

        paiRef.rectConstruct = [];
      }
    });

    content.addEventListener('mousemove', function (e) {
      let tip = paiRef.selfReference.querySelector('.addelementTip');
      var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
      var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
      if(paiRef.inClick && currentAction == 'CREATE' && paiRef.rectConstruct != []){
        selectAreaMouse.style.width = mouseX - paiRef.rectConstruct[0].x + 'px';
        selectAreaMouse.style.height = mouseY - paiRef.rectConstruct[0].y + 'px';
      }
      tip.querySelector('.coordXSheet').innerHTML = ((mouseX) / paiRef.wcm).toFixed(1);
      tip.querySelector('.coordYSheet').innerHTML = ((mouseY) / paiRef.hcm).toFixed(1);

      if(paiRef.inClick && currentAction == 'HANDLE' && selectedComponent.el.id != 0 && selectedComponentAnchorMove != null){
        let nx = (((mouseX) / paiRef.wcm) - ((selectedComponentAnchorMove.x / paiRef.wcm)));
        let ny = (((mouseY) / paiRef.hcm) - ((selectedComponentAnchorMove.y / paiRef.hcm)));
        selectedComponent.el.setParameterComponent(parseFloat(nx), 'x');
        selectedComponent.el.setParameterComponent(parseFloat(ny), 'y');
      }
    });

    content.addEventListener('mouseover', function(e) {
      if(currentAction == 'HANDLE'){
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          e.target.classList.add('highlight');
          e.target.classList.remove('NOhighlight');
        }
      }
    });

    content.addEventListener('mouseout', (e) => {
      if(currentAction == 'HANDLE'){
        // Verifica se o alvo do evento é um filho do paiElemento
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          if(selectedComponent.el.id != e.target.getAttribute('rel')){
            e.target.classList.add('NOhighlight');
            e.target.classList.remove('highlight');
          } 
        }
      }
    });
  }

  //POSITION COMPONENTS DATA
  intoContentRect(mxy){
    let l = this.margem.left;
    let t = this.margem.top;
    let r = this.getSR().getBoundingClientRect().width - this.margem.right;
    let b = this.getSR().getBoundingClientRect().height - this.margem.bottom;

    let retInto = true;
    let retClick = false;

    mxy.forEach((p) => {
      let mx = p.x;
      let my = p.y;
      if((mx < l || mx > r || my < t || my > b) && retInto == true){
        retInto = false;
      }
    });

    for (let i = -10; i <= 10; i++) {
      for (let ii = -10; ii <= 10; ii++) {
        if ((mxy[0].y + ii === mxy[1].y) && (mxy[0].x + i === mxy[1].x)) {
          retClick = true;
        }
      }
    }

    return {retInto: retInto, retClick, retClick};
  }


  //ADD ELEMENT TO SHEET - HTML
  addElementoToSheetHtml(ne) {
    let celula = ne.draw();
    if(celula != null) {
      let currentSheet = this.getSR().querySelector('.content');
      currentSheet.appendChild(celula);
      this.components.push(ne);
      addToMyElements(ne, this.id);
    }
  }


  //setMargin
  setMargem(top, bottom, left, right) {
    this.margem = {
      "top": this.hcm * top,
      "bottom": this.hcm * bottom,
      "left": this.wcm * left,
      "right": this.wcm * right
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
      "top": (this.hcm * top)-0.1,
      "bottom": (this.hcm * bottom)-0.1,
      "left": (this.wcm * left)-0.1,
      "right": (this.wcm * right)-0.1
    };
  
  }


  getSR() {
    return this.selfReference;
  }

}



//SYSTEM FUNCTIONS
//SET CURRENT PAGE
function setCurrentPage(sheetClassId, doScroll, clickMiniPage = false) {
  listSheetsArea.querySelectorAll('.minisheet').forEach((m) => {
    let r = m.getAttribute('rel');

    if (r == sheetClassId) {
      m.classList.add('miniSheetActive');
      m.innerHTML = 'AQUI <p>' + r + '</p>';
    } else {
      m.classList.remove('miniSheetActive');
      m.innerHTML = '<p>' + r + '</p>';
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

//MODAL 
var modal = document.getElementById("myModal");
var configbtn = document.getElementById("config");
var span = document.getElementsByClassName("close")[0];
var btnapply = document.getElementsByClassName("btnapply")[0];
configbtn.onclick = function () {
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
}
btnapply.onclick = function () {
  modal.style.display = "none";

  applyMargins(0, true);

}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//MARGINS
function applyMargins(sheetClassId, all = false) {
  const iverticalMT = document.getElementById('verticalMT').value;
  const iverticalMR = document.getElementById('verticalMR').value;
  const ihorizontalME = document.getElementById('horizontalME').value;
  const ihorizontalMD = document.getElementById('horizontalMD').value;

  if (all) {
    sheets.forEach((s) => {
      s.setMargem(iverticalMT, iverticalMR, ihorizontalME, ihorizontalMD);
    })
  } else {

    let sheet = sheets[sheets.findIndex((sheet) => sheet.id === sheetClassId)];
    sheet.setMargem(iverticalMT, iverticalMR, ihorizontalME, ihorizontalMD);
  }

}

//CHANGE PAGE WHEN SCROLL
function sheetpredominante() {
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
    setCurrentPage(elementoPredominante.getAttribute('rel'), false);
  }
}


//ADD COMPONENT TO MY ELEMENT AREA
function addToMyElements(el, np) {
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

  confShow.insertAdjacentHTML('beforeend', '&#9881;');
  confShow.insertAdjacentElement('beforeend', cnfCompContent);
  cnfCompContent.insertAdjacentElement('beforeend', deleteComp);

  lc.append(clcu);
  lc.append(clcd);

  me.insertAdjacentHTML('beforeend', content);
  me.insertAdjacentElement('beforeend', lc);
  me.insertAdjacentElement('beforeend', confShow);

  let p = listElementsArea.querySelector('.contentAUX').querySelector('.pageAccordeon[rel="' + np + '"]').querySelector('.pagePanelAcordeon');
  p.insertAdjacentElement('afterbegin', me);

  el.addConnection('text', ['text'], me);

  deleteComp.addEventListener('click', function(e) {
    event.stopPropagation();
    if (confirm("Deseja excluir o componente "+el.text+" ?") == true) {
      if(el.deleteMe()){
        me.parentNode.removeChild(me);
        if(configSheetArea.querySelectorAll('.contentAUX .inpConfig')[0].getAttribute('rel') == el.id){
          console.log(configSheetArea.querySelector('.contentAUX').innerHTML);
          configSheetArea.querySelector('.currentElement').textContent = 'Sem Elemento...';
          configSheetArea.querySelector('.contentAUX').innerHTML = '';
        }
      }
      
    }
  })

  confShow.addEventListener('click', function(e) {
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
    selectComponent(np, el);
  })

  me.addEventListener('mouseover', function(e) {
    if(currentAction == 'HANDLE'){
      el.getSR().classList.add('highlight');
      el.getSR().classList.remove('NOhighlight');    
    }
  });

  me.addEventListener('mouseout', (e) => {
    if(currentAction == 'HANDLE'){
      el.getSR().classList.remove('highlight');
      el.getSR().classList.add('NOhighlight');       
    }
  });
}


//SELECT COMPONENT TO CHANGE PROPERTIES
function selectComponent(np, el) {
  selectedComponent = {
    np: np,
    el: el
  }
  configSheetArea.querySelector('.currentElement').textContent = el.text;
  Array.from(listElementsArea.querySelectorAll('.contentAUX .pageAccordeon[rel="' + np + '"] .pagePanelAcordeon .myElement')).forEach(accds => {
    if(accds.getAttribute('rel') == el.id){
      accds.classList.add('active');
    } else {
      accds.classList.remove('active');
    }
  })
  createFormFromElement(el)
}


//CREATE FORM OF COMPONENT PROPERTIES
function createFormFromElement(e) {
  configSheetArea.querySelector('.contentAUX').innerHTML = '';
  let indexEl = elementos.findIndex(item => item.className == e.constructor.name);

  let configs = elementos[indexEl].configuracoes;
  //let content = '';
  for (let [key, value] of Object.entries(configs)) {
    
    let inpArea = document.createElement('div');
    inpArea.setAttribute('class', 'inpConfig');
    inpArea.setAttribute('rel', e.id);

    let inpAreaSpan = document.createElement('span');
    inpAreaSpan.innerHTML = value.label;

    let inpAreaInput = document.createElement('input');
    inpAreaInput.setAttribute('type', value.type);
    if (value.type == 'number') {
      inpAreaInput.setAttribute('step', '0.05');
    }
    inpAreaInput.setAttribute('value', e[key]);
    inpAreaInput.setAttribute('rel', key);
    
    inpAreaInput.addEventListener('change', function(ri){
      let vr = inpAreaInput.value;
      if (value.type == 'number') {
        vr = parseFloat(inpAreaInput.value);
      }
      e.setParameterComponent(vr, key);
    })

    e.addConnection('input', [key], inpAreaInput);

    inpArea.append(inpAreaSpan);
    inpArea.append(inpAreaInput);
    configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);

    //content += '<div class="inpConfig" rel="' + e.id + '"><span>' + value.label + '</span><input type="' + value.type + '" value="' + e.c[key] + '"  onchange="setParameterComponent(this.value, \'' + key + '\', ' + e.id + ')"></div>';
  }

  //LISTENNER OF AUX CONFIG CHANGES - delete inputs
/* 
  //no pai do que pretende escutar as alterações
  const targetNode = configSheetArea.querySelector('.contentAUX'); 
  const config = { childList: true, subtree: true};
  const observer = new MutationObserver(function(mutationsList) {
    for (let mutation of mutationsList) { //para cada uma das alterações no DOM
      if (mutation.type == 'childList') { //se afeta os filhos
        if(mutation.removedNodes.length > 0)
        mutation.removedNodes
        const removedIds = [...mutation.removedNodes].map(x => x.id); //apanhar os id's
        if (removedIds.includes("teste")){ //se o id existe é porque foi removido
          console.log("teste removido");
        }
      }
    }
  }); 
  
  observer.observe(targetNode, config); */
}




//SCROLL ACTIONS

viewManager.addEventListener('wheel', sheetpredominante);




//BTN ACTIONS 

zoomActions.querySelector('.moreZoom').addEventListener('click', function(e) {
  let z = parseFloat((defaultConfigurations.zoomPctg+0.1));
  defaultConfigurations.zoomPctg = z;
  zoomActions.querySelector('.zoomValue').innerHTML = (z*100)+'%';
  sheets.forEach(s => {
    s.setSizeSheet(z);
  });
});

zoomActions.querySelector('.lessZoom').addEventListener('click', function(e) {
  let z = (defaultConfigurations.zoomPctg-0.1);
  defaultConfigurations.zoomPctg = z;
  zoomActions.querySelector('.zoomValue').innerHTML = (z*100)+'%';
  sheets.forEach(s => {
    s.setSizeSheet(z);
  });
});

handleElements.addEventListener('click', function(e) {
  let esis = document.querySelectorAll('.sheet');
  esis.forEach((s) => {
    s.classList.add('gragItems');
    s.querySelectorAll('.componentPDF').forEach(c => {
      c.classList.add('NOhighlight');
    })
  })
  currentAction = 'HANDLE';
  currentElement = null;
});

pagesListButton.addEventListener('click', function (e) {
  listSheetsArea.classList.toggle("show");
});

function elementsDropDown() {
  elementsButton.parentElement.parentElement.querySelector('#myDropDownElements').classList.toggle("show");
};

function selectedAddElement(e) {
  document.querySelectorAll('.sheet').forEach(s => {
    s.classList.remove('gragItems');
  })
  let id = e.getAttribute('rel');
  let indexEl = elementos.findIndex(item => item.id === Number(id));

  document.querySelector('#currentElement').innerHTML = elementos[indexEl].nome;
  currentElement = elementos[indexEl].id;
  currentAction = 'CREATE';
  let esis = document.querySelectorAll('.sheet');
  esis.forEach((s) => {
    s.classList.remove('gragItems');
    s.querySelectorAll('.componentPDF').forEach(c => {
      c.classList.remove('NOhighlight');
      c.classList.remove('highlight');
    })
  })
  elementsDropDown();
}

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

})

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

})


//CRIAR PAGINA
function criarpaginafe(e) {
  new SHEET(incrementPageId).createSheet();
  incrementPageId = incrementPageId + 1;
}
newPageButton.addEventListener("click", criarpaginafe);
