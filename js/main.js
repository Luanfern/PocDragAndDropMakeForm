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

let defaultConfigurations = []
let elementos = []

let incrementPageId = 1;

let currentElement = null;
let selectedComponent = null;
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

  draw(r=false) {
    let celula = document.createElement("div");
    celula.setAttribute("rel", this.id);

    //BACKGROUND COLOR
    celula.style.backgroundColor = this.bcolor;

    //HEIGHT - WIDTH
    celula.style.width = (this.sheet.wcm * this.width) + 'px';
    celula.style.height = (this.sheet.hcm * this.height) + 'px';

    //TEXT
    var text = document.createTextNode(this.text);
    celula.style.fontFamily = this.tfont;

    let fs = this.sheet.hcm * (parseFloat(this.tsize) / (72 / 2.56));
    //console.log(fs+'px');
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

    celula.setAttribute('class', 'lines componentPDF');

    celula.appendChild(text);

    if(r){
      return celula;
    }

    let currentSheet = this.sheet.getSR().querySelector('.content');
    currentSheet.appendChild(celula);

  }


  //SET PARAMETERS CALL
  setParameterComponent(value, parametro) {
    //sheet
    this.setParameters([parametro], [value]);

    let d = this.draw(true);
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
  constructor(id, margem = {
    "top": 1,
    "bottom": 1,
    "left": 1,
    "right": 1
  }, components = []) {
    this.id = id;
    this.components = components;
    this.margem = margem;
    this.wcm = 2.65 * 210 / this.width;
    this.hcm = 2.65 * 297 / this.height;
  }


  //CREATE SHEET
  createSheet() {
    let newSheet = document.createElement("div");
    newSheet.setAttribute('class', 'sheet');
    newSheet.setAttribute('rel', this.id);
    newSheet.addEventListener("click", function () {})
    newSheet.insertAdjacentHTML('beforeend', '<div class="addelementTip"><div><b>X (CM):</b><div class="coordXSheet"></div></div><div><b>Y (CM):</b><div class="coordYSheet"></div></div></div><div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div class="content"></div>');
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

    content.addEventListener('mousedown', function (e) {
      let indexEl = elementos.findIndex(item => item.id === Number(currentElement));
      if (currentElement == null) {
        alert('nenhum elemento selecionado!');
      } else {
        let componentToCreate;
        let insertID = 1;
        if(paiRef.components.length > 0){
          insertID = paiRef.components.at(-1).id+1;
        }
        switch (e.button) {
          case 2:
            let maxLarge = width - (paiRef.margem.left / paiRef.wcm) - (paiRef.margem.right / paiRef.wcm);
            componentToCreate = new elementos[indexEl].class(paiRef, insertID, undefined, 0, 0, maxLarge, 0.40, undefined, "C", undefined, undefined, "B", undefined, "B", 0.04, '#FF0000', 1, undefined);
            paiRef.addElementoToSheetHtml(componentToCreate);
            break;
          case 0:
            componentToCreate = new elementos[indexEl].class(paiRef, insertID, undefined, 0, 0, 2, 0.40, undefined, "C", undefined, undefined, "B", undefined, "B", 0.04, '#FF0000', 1, undefined);
            paiRef.addElementoToSheetHtml(componentToCreate);
            break;
        }
      }
    });

    content.addEventListener('mousemove', function (e) {
      let tip = paiRef.selfReference.querySelector('.addelementTip');
      var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
      var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
      tip.querySelector('.coordXSheet').innerHTML = ((mouseX) / paiRef.wcm).toFixed(1);
      tip.querySelector('.coordYSheet').innerHTML = ((mouseY) / paiRef.hcm).toFixed(1);
    });
  }


  //ADD ELEMENT TO SHEET - HTML
  addElementoToSheetHtml(ne) {
    ne.draw();
    this.components.push(ne);
    addToMyElements(ne, this.id);
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
    Array.from(content.querySelectorAll('.linegroup')).forEach(lg => {
      lg.setAttribute('totalW', this.width - this.margem.left - this.margem.right);

    })
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
  me.insertAdjacentHTML('beforeend', content);

  let p = listElementsArea.querySelector('.contentAUX').querySelector('.pageAccordeon[rel="' + np + '"]').querySelector('.pagePanelAcordeon');
  p.insertAdjacentElement('beforeend', me);

  el.addConnection('text', ['text'], me);

  me.addEventListener('click', function (e) {
    selectComponent(np, el);
  })
}


//SELECT COMPONENT TO CHANGE PROPERTIES
function selectComponent(np, el) {
  selectedComponent = {
    np: np,
    id: el.id
  }
  configSheetArea.querySelector('.currentElement').textContent = el.text;
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
    inpAreaInput.setAttribute('value', e[key]);
    inpArea.setAttribute('rel', key);
    
    inpAreaInput.addEventListener('change', function(ri){
      e.setParameterComponent(inpAreaInput.value, key);
    })

    e.addConnection('input', [key], inpAreaInput);

    inpArea.append(inpAreaSpan);
    inpArea.append(inpAreaInput);
    configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);

    //content += '<div class="inpConfig" rel="' + e.id + '"><span>' + value.label + '</span><input type="' + value.type + '" value="' + e.c[key] + '"  onchange="setParameterComponent(this.value, \'' + key + '\', ' + e.id + ')"></div>';
  }
}




//SCROLL ACTIONS

viewManager.addEventListener('wheel', sheetpredominante);




//BTN ACTIONS 
pagesListButton.addEventListener('click', function (e) {
  listSheetsArea.classList.toggle("show");
});

function elementsDropDown() {
  elementsButton.parentElement.parentElement.querySelector('#myDropDownElements').classList.toggle("show");
};

function selectedAddElement(e) {
  let id = e.getAttribute('rel');
  let indexEl = elementos.findIndex(item => item.id === Number(id));

  document.querySelector('#currentElement').innerHTML = elementos[indexEl].nome;
  currentElement = elementos[indexEl].id;
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
