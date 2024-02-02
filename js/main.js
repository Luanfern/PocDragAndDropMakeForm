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

listFieldsPDF = [];

listImagesPDF = [];

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
 /*  {
    "key": "Tahoma",
    "value": "Tahoma"
  }, */
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
 /*  {
    "key": "Tahoma",
    "value": "Tahoma"
  },
  {
    "key": "Candara",
    "value": "Candara"
  }, */
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

let defaultConfigurations = {
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

modalConfId = null;

let elementos = []

let incrementPageId = 1;

let currentElement = null;

let selectedComponent = {
  np: null,
  el: {
    id: null
  }
};

let mousePositionPage = {
  x: 0,
  y: 0
}

let cntrCComponent = {
  np: null,
  el: {
    id: null
  }
};

let selectedComponentAnchorMove = null;

let currentAction = null;

let currentPage = null;

let sheets = [];
let comumComponents = [];

async function loadPDFJSON(json) {
  if (json == '') return false;
  
  const jsonParsed = JSON.parse(json);
  incrementPageId = jsonParsed.incrementPageId;
  defaultConfigurations = jsonParsed.defaultConfigurations;
  
  jsonParsed.sheets.forEach(s => {
    new SHEET(s.id, {top: s.margem.top / s.hcm,
      bottom: s.margem.bottom / s.hcm,
      left: s.margem.left / s.wcm,
      right: s.margem.right / s.wcm
    }, []).createSheet();
    let sRef = sheets.find(function(objeto) {return objeto.id === s.id;});
    jsonParsed.componentes[s.id][0].forEach(c => {
      let elementInstance = elementos[elementos.findIndex(item => item.className === c.elementType)];

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
    let elementInstance = elementos[elementos.findIndex(item => item.className === com.elementType)];
    com.comum = false;
    com.sheet = sheets[0];
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
    sheets[0].addElementoToSheetHtml(componentToCreate);
    componentToCreate.changeComumComponent();
  });

  return false;
}

async function initialRequests() {
  listImagesPDF = await getImages();
  listFieldsPDF = await getColumns();
}

window.addEventListener('load', function () {
  document.getElementById('overlay').style.display = 'flex';
  //INICIAL
  initialRequests().then(() => {
      elementos = [{
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
            type: "number"
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
            values: listFieldsPDF
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
            type: "number"
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
            label: "altura das linhas",
            type: "number"
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
            type: "number"
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
            values: listFieldsPDF
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
            type: "number"
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
            type: "number"
          },
          y: {
            icon: "",
            label: "eixo Y",
            type: "number"
          },
          imageOriginal: {
            icon: "",
            label: "Tamanho original da Imagem",
            type: "checkbox"
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
          proporcionalSize: {
            icon: "",
            label: "tamanho (proporcional)",
            type: "number"
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
            values: listImagesPDF
          }
        }
      }
    ]

      elementos.forEach((el) => {
        let component = '<div class="el" rel="' + el.id + '" onclick="selectedAddElement(this)" ><div class="icon">' + el.icon + '</div>' + el.nome + '</div>';
        elementsdropdown.insertAdjacentHTML('beforeend', component)
      })

      createAccordeonComumComponents();

      gt("{\"ACAO\":2, \"FILE\":\""+fileName+"\"}").then((r) => {
        //console.log(r);

        loadPDFJSON(r).then(() => {

          zoomActions.querySelector('.zoomValue').innerHTML = (Number(defaultConfigurations.zoomPctg) * 100).toFixed(2) + '%';
          //openModal();

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
  
        document.getElementById('overlay').style.display = 'none';
      });
       
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
    if(sheet.inClick && currentAction == 'HANDLE' && selectedComponent.el == this){
      celulaInfo.classList.add('highlightMoving');
    } else {
      celulaInfo.classList.remove('highlightMoving');
      celulaInfo.classList.add('NOhighlight');
    }
    return celulaInfo;
  }

  copyPaste(typePaste = 1){
    alert('copy não implementado em todos os componentes!');

  /*   let indexEl = elementos.findIndex(item => item.className === this.elementType);
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

    let componentToCopy = new elementos[indexEl].class(copy);
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
      sheets.forEach(s => {
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
      let elementInstance = elementos[elementos.findIndex(item => item.className === this.elementType)];
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
        comumComponents.splice(comumComponents.findIndex(c => c.id == this.id), 1);
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
    if(comumComponents.length > 0){
      lastId = Number(comumComponents[comumComponents.length - 1].id.split('_').at(-1)) + 1;
    }
    let celulaComum = new this.constructor({
      sheet: this.sheet, id: 'comumComponent_'+lastId, text: this.text, x: this.x, y: this.y, width: this.width,
      height: this.height, freeSheet: this.freeSheet, comum: true, informacaoExterna: this.informacaoExterna,
      tcolor: this.tcolor, talign: this.talign, tfont: this.tfont, tsize: this.tsize, tweight: this.tweight,
      bcolor: this.bcolor , border: this.border, borderwidth: this.borderwidth, bordercolor: this.bordercolor,
      last: this.last, link: this.link
    });
    comumComponents.push(celulaComum);
    addToMyElements(celulaComum, 'comumComponents');
    this.deleteMe();
    sheets.forEach(s => {
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

  copyPaste(typePaste = 1){

    let indexEl = elementos.findIndex(item => item.className === this.elementType);
    let copy = Object.assign({}, this);
    if (this.sheet.components.length > 0) {
      let elId = Number(this.sheet.components.at(-1).id.split('_').at(-1))+1;
      copy.id = Number(this.sheet.id)+'_'+elId;
    }

    if(typePaste == 1){
      //COLAR NO LUGAR DO MOUSE
      console.log(mousePositionPage);
      copy.x = mousePositionPage.x;
      copy.y = mousePositionPage.y;
    } else if(typePaste == 2){
      let down = mousePositionPage.y - this.y+this.height;
      let up = (mousePositionPage.y - this.y)*-1;
      let left = (mousePositionPage.x - this.x)*-1;
      let right = mousePositionPage.x - this.x+this.height;

      if(up > 0){
        copy.y = this.y - this.height;
      } else if(left > 0){
        copy.x = this.x - this.width;
      } else if(down >= right){
        copy.y = this.y + this.height;
      } else if(right > down) {
        copy.x = this.x + this.width;
      }else {
        alert('ERROR ON PASTE ACTION!');
      }
    }

    copy.selfReference = [];
    copy.lastStatusOk = null;
    copy.connections = [];

    let componentToCopy = new elementos[indexEl].class(copy);
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
  proporcionalSize = 1;
  constructor({sheet, id, text = "DIRECTA Image!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = true, informacaoExterna = null, imageOriginal = false, proporcionalSize = 1 }) {
    super({sheet, id, text, x, y, width , height , freeSheet, comum, informacaoExterna});
    this.elementType = 'ImageBuild';
    this.imageOriginal = imageOriginal;
    this.proporcionalSize = proporcionalSize;
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
        t.setParameters(['width', 'height', 'proporcionalSize'], [(this.width / t.sheet.wcm), (this.height / t.sheet.hcm), 1]);
        setTimeout(() => {
          t.reDraw(t.draw());
        }, 50);
        }
      }
      img.src = imageOnUse;
      img.remove();
    }

    let propHeight = this.height * this.proporcionalSize;
    let propWidth = this.width * this.proporcionalSize;

    //HEIGHT - WIDTH
    celula.style.width = (sheet.wcm * propWidth) + 'px';
    celula.style.height = (sheet.hcm * propHeight) + 'px';
    //POSITION
    celula.style.left = (sheet.wcm * this.x) + 'px';
    celula.style.top = (sheet.hcm * this.y) + 'px';

    let pStats = sheet.intoContentRect([{
      x: (sheet.wcm * this.x),
      y: (sheet.hcm * this.y)
    }, {
      x: (propWidth + this.x) * sheet.wcm,
      y: (propHeight + this.y) * sheet.hcm
    }], this.freeSheet, this.id, this.comum);

    console.log(pStats);

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
    if(currentAction == 'HANDLE'){
      newSheet.classList.add('gragItems');
    }
    newSheet.insertAdjacentHTML('beforeend', '<div class="addelementTip"><div><b>X (CM):</b><div class="coordXSheet"></div></div> &nbsp;&nbsp;|&nbsp;&nbsp; <div><b>Y (CM):</b><div class="coordYSheet"></div></div></div><div class="classificacaoSheet"><input type="checkbox" name="classificacaoSheet'+this.id+'" id="classificacaoSheet'+this.id+'" rel="'+this.id+'" onchange="unirPaginaAnterior(this)">&nbsp<label for="classificacaoSheet'+this.id+'"><b>Unir com a página anterior</b></label></div><div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div class="content"></div>');
    
    viewManager.append(newSheet);

    this.selfReference = newSheet;
    sheets.push(this);

    this.clickDropElementsSheet();
    this.createMiniSheet();
    setCurrentPage(this.id, true);
    applyMargins(this.id, this.margem);
    this.createAccordeonSheet();

    if (document.querySelector('.nosheetsExist')) {
      document.querySelector('.nosheetsExist').parentElement.removeChild(document.querySelector('.nosheetsExist'));
    }

    //CREATE COMUNS COMPONENTS -> EXTERNAL AFTER!
    comumComponents.forEach(c => {
      let celula = c.draw();
      let currentSheet = this.getSR().querySelector('.content');
      currentSheet.appendChild(celula);
    })

    this.setSizeSheet(defaultConfigurations.zoomPctg);
  }



  //CREATE MINISHEET
  createMiniSheet() {
    let paiRef = this;
    listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet" onclick="setCurrentPage(' + this.id + ', true, true)" rel="' + this.id + '"><div class="contentMiniSheet"><p>ID ' + this.id + '</p></div><div class="excluirPagina">Excluir</div></div>');
    let qs = document.querySelector('.minisheet[rel="'+this.id+'"] .excluirPagina');
    qs.addEventListener('click', function (e) {
      let depend = sheets[sheets.findIndex(s => s.unionPreviousPage == paiRef.id)];
      if(depend != undefined) {
        alert('Outra(s) página(s) dependem dessa. Delete elas para prosseguir.');
        return false;
      }
      e.stopPropagation();
      let acdon = listElementsArea.querySelector('.contentAUX .pageAccordeon[rel="'+paiRef.id+'"]');
      acdon.parentElement.removeChild(acdon);

      let mnst = listSheetsArea.querySelector('.minisheet[rel="'+paiRef.id+'"]');
      mnst.parentElement.removeChild(mnst);
      
      sheets.splice(sheets.findIndex(s => s.id == paiRef.id), 1);
      
      paiRef.getSR().parentElement.removeChild(paiRef.getSR());

    })
  }

  setSizeSheet(pctg) {
    let x = (defaultConfigurations.zoom.x * defaultConfigurations.zoomPctg);
    let y = (defaultConfigurations.zoom.y * defaultConfigurations.zoomPctg);

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

    comumComponents.forEach(c => {
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

    content.addEventListener('mousedown', function (e) {
      paiRef.inClick = true;
      if (currentAction == 'HANDLE') {
        Array.from(document.querySelectorAll('.componentPDF')).forEach(c => {
          c.classList.remove('highlight');
          c.classList.add('NOhighlight');
        });
        e.target.classList.remove('NOhighlight');
        e.target.classList.add('highlight');
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          let el = paiRef.components[paiRef.components.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
          if(el == undefined) {
            el = comumComponents[comumComponents.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
          }
          selectComponent(paiRef.id, el);
          const rect = el.getSR().getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          selectedComponentAnchorMove = {
            x: mouseX,
            y: mouseY
          };
        }
      } else {
        if (currentElement == null && currentAction == null) {
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
      if (paiRef.inClick && currentAction == 'HANDLE') {
        paiRef.inClick = false;
        selectedComponentAnchorMove = null;
        paiRef.rectConstruct = [];
        e.target.classList.remove('highlightMoving');
        e.target.classList.add('highlight');
      }
      if (paiRef.inClick && currentAction == 'CREATE') {
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
          insertID = Number(paiRef.components.at(-1).id.split('_').at(-1)) + 1;
        }

        let w = (paiRef.rectConstruct[1].x - paiRef.rectConstruct[0].x) / paiRef.wcm;
        let h = (paiRef.rectConstruct[1].y - paiRef.rectConstruct[0].y) / paiRef.hcm;
        let x = paiRef.rectConstruct[0].x / paiRef.wcm;
        let y = paiRef.rectConstruct[0].y / paiRef.hcm;

        let indexEl = elementos.findIndex(item => item.id === Number(currentElement));
        let free = false;
        if(e.button == 0) free = false;
        if(e.button == 2) free = true;
        let componentToCreate = new elementos[indexEl].class({sheet: paiRef, id: paiRef.id+'_'+insertID, x: x, y: y, width: w, height: h, freeSheet: free, comum: false, informacaoExterna: null});
        paiRef.addElementoToSheetHtml(componentToCreate);

        paiRef.rectConstruct = [];
      }
    });

    content.addEventListener('mousemove', function (e) {
      let tip = paiRef.selfReference.querySelector('.addelementTip');
      var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
      var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
      if (paiRef.inClick && currentAction == 'CREATE' && paiRef.rectConstruct != []) {
        selectAreaMouse.style.width = mouseX - paiRef.rectConstruct[0].x + 'px';
        selectAreaMouse.style.height = mouseY - paiRef.rectConstruct[0].y + 'px';
      }

      mousePositionPage.x = ((mouseX) / paiRef.wcm).toFixed(1);
      mousePositionPage.y = ((mouseY) / paiRef.hcm).toFixed(1);
      tip.querySelector('.coordXSheet').innerHTML = ((mouseX) / paiRef.wcm).toFixed(1);
      tip.querySelector('.coordYSheet').innerHTML = ((mouseY) / paiRef.hcm).toFixed(1);

      if (paiRef.inClick && currentAction == 'HANDLE' && selectedComponent.el?.id != 0 && selectedComponentAnchorMove != null) {
        let nx = (((mouseX) / paiRef.wcm) - ((selectedComponentAnchorMove.x / paiRef.wcm)));
        let ny = (((mouseY) / paiRef.hcm) - ((selectedComponentAnchorMove.y / paiRef.hcm)));
        selectedComponent.el.setParameterComponent(parseFloat(nx), 'x');
        selectedComponent.el.setParameterComponent(parseFloat(ny), 'y');
      }
    });

    content.addEventListener('mouseover', function (e) {
      if(paiRef.inClick) return false;
      if (currentAction == 'HANDLE') {
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
      if (currentAction == 'HANDLE') {
        // Verifica se o alvo do evento é um filho do paiElemento
        const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
        if (isFilho) {
          if (selectedComponent.el?.id != e.target.getAttribute('rel')) {
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
      touchComponent = verificarSobreposicao(this.components.filter((numero) => numero.id != elID), mxy[0].x/this.wcm, mxy[0].y/this.hcm, ((mxy[1].x/this.wcm)-(mxy[0].x/this.wcm)), ((mxy[1].y/this.hcm) - (mxy[0].y/this.hcm)));
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
      addToMyElements(ne, this.id);
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

}



//SYSTEM FUNCTIONS
//SOBREPOSIÇÃO DE COMPONENTES
function verificarSobreposicao(components, x, y, width, height) {
  for (const elemento of components) {
      const { x: elementoX, y: elementoY, width: elementoWidth, height: elementoHeight } = elemento;

      // Verifica se os retângulos estão se sobrepondo
      if (
          x < elementoX + elementoWidth &&
          x + width > elementoX &&
          y < elementoY + elementoHeight &&
          y + height > elementoY
      ) {
          return false;
      }
  }

  return true;
}



//SET CURRENT PAGE
function setCurrentPage(sheetClassId, doScroll, clickMiniPage = false) {

  currentPage = sheets[sheets.findIndex(s => s.id == sheetClassId)];
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


//MODAL 
var modal = document.getElementById("myModal");
var configbtn = document.getElementById("config");
var span = document.getElementsByClassName("close")[0];
var btnapply = document.getElementsByClassName("btnapply")[0];
configbtn.addEventListener('click', function (e) {
  openModal();
});

function openModal() {
  document.getElementById('verticalMT').value = defaultConfigurations.margens.top;
  document.getElementById('verticalMR').value = defaultConfigurations.margens.bottom;
  document.getElementById('horizontalME').value = defaultConfigurations.margens.left;
  document.getElementById('horizontalMD').value = defaultConfigurations.margens.right;
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
  document.getElementById('verticalMT').value = defaultConfigurations.margens.top;
  document.getElementById('verticalMR').value = defaultConfigurations.margens.bottom;
  document.getElementById('horizontalME').value = defaultConfigurations.margens.left;
  document.getElementById('horizontalMD').value = defaultConfigurations.margens.right;
}
btnapply.onclick = function () {
  modal.style.display = "none";
  defaultConfigurations.margens.top = document.getElementById('verticalMT').value;
  defaultConfigurations.margens.bottom = document.getElementById('verticalMR').value;
  defaultConfigurations.margens.left = document.getElementById('horizontalME').value;
  defaultConfigurations.margens.right = document.getElementById('horizontalMD').value;

}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//MARGINS
function applyMargins(sheetClassId, margins = null) {
    let sheet = sheets[sheets.findIndex((sheet) => sheet.id === sheetClassId)];
    if(margins != null) sheet.setMargem(margins.top, margins.bottom, margins.left , margins.right);
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
    selectComponent(np, el);
  })

  me.addEventListener('mouseover', function (e) {
    if (currentAction == 'HANDLE') {
      el.getSR().classList.add('highlight');
      el.getSR().classList.remove('NOhighlight');
    }
  });

  me.addEventListener('mouseout', (e) => {
    if (currentAction == 'HANDLE') {
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
  Array.from(listElementsArea.querySelectorAll('.pagePanelAcordeon .myElement')).forEach(accds => {
    if (accds.getAttribute('rel') == el.id) {
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
  for (let [key, value] of Object.entries(configs)) {
   let opts = [];
   let tt = [];
   if(value.values?.length > 0){
    opts = value.values;
   }
   if(value.tt?.length > 0){
    tt = value.tt;
   }
    let inpArea = inputEscolhido(type = value.type, property = key, e, label = value.label, options = opts, iconSelect = value.icon, tutorialPass = tt);
    configSheetArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', inpArea);
  }

  //TORNAR COMUM ENTRE PAGINAS
  if(e.freeSheet){
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

function unirPaginaAnterior(checkbox) {
  alert('Ao realizar essa alteração, o conteúdo desta página será continuado a partir da página anterior. Esse método é particularmente útil em situações envolvendo multicélulas ou componentes que expandem dinamicamente.\nSe a página anterior não estiver completamente preenchida, os elementos desta página a complementarão. Se, por acaso, esses elementos forem suficientes para preencher toda a página atual, ela não será carregada.');
  var id = checkbox.getAttribute('rel');
  var pos = sheets.findIndex(s => s.id == id);
  if (checkbox.checked && pos > 0) {
    sheets[pos].unionPreviousPage = true;
  }
  if (!checkbox.checked) {
    sheets[pos].unionPreviousPage = false;
    checkbox.checked = false;
  }
  if (pos <= 0 || sheets[pos-1] == undefined) {
    alert('Primeira página.\nSem paginas anteiores para Unir!');
    sheets[pos].unionPreviousPage = false;
    checkbox.checked = false;
  }
}

//INPUTS FORM SWITCH
function inputEscolhido(type, property, el, label, options = [], iconSelect = null, tutorialPass = []) {

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
    inpAreaInput.setAttribute('step', '0.02');
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



//SCROLL ACTIONS

viewManager.addEventListener('wheel', sheetpredominante);


//KEYBOARD ACTIONS
window.addEventListener('keydown', function(event) {  
  if ((event.key === 'Z' || event.key === 'z') && (event.ctrlKey || event.metaKey)) {
      if(selectedComponent.el != null){
        selectedComponent.el.rollback();
      }
  }
});

window.addEventListener('keydown', function(event) {  
  if ((event.key === 'C' || event.key === 'c') && (event.ctrlKey || event.metaKey)) {
      if(selectedComponent.el != null){
        cntrCComponent.el = selectedComponent.el;
        cntrCComponent.np = selectedComponent.np;
      }
  }
});

window.addEventListener('keydown', function(event) {  
  if ((event.key === 'V' || event.key === 'v') && (event.ctrlKey || event.metaKey)) {
      if(cntrCComponent.el != null){
        cntrCComponent.el.copyPaste(1);
        cntrCComponent.el = null;
        cntrCComponent.np = null;
      }
  }
});

window.addEventListener('keydown', function(event) {  
  if ((event.key === 'B' || event.key === 'b') && (event.ctrlKey || event.metaKey)) {
      if(cntrCComponent.el != null){
        cntrCComponent.el.copyPaste(2);
      }
  }
});


window.addEventListener('keydown', function(event) {  
  if (event.key === 'DELETE' || event.key === 'Delete') {
    if(selectedComponent.el != null){
      
    }
  }
});


//BTN ACTIONS 
document.querySelector('#publish.gen').addEventListener('click', function (e) {
   /* let compsToPDF = [];
  sheets.forEach(s => {
    compsToPDF = [...compsToPDF, ...mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
  }); */

  let compsToPDF = {};
  sheets.forEach(s => {

    if (compsToPDF[s.id]) {
      // Se existe e é um array, adiciona o valor ao array existente
      if (Array.isArray(compsToPDF[s.id])) {
        compsToPDF[s.id].push(mapeareOrdenarElementos(s.getSR().querySelector('.content'), s));
      } else {
        // Se não for um array, cria um novo array com o valor
        compsToPDF[s.id] = [compsToPDF[s.id], mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
      }
    } else {
      // Se não existe, cria um novo array com o valor
      compsToPDF[s.id] = [mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
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
  let alljs = "{\"datas\": \"213\",\"sheets\": "+JSON.stringify(sheets, replacer)+" , \"componentes\": "+JSON.stringify(compsToPDF, replacer)+", \"comuns\": "+JSON.stringify(comumComponents, replacer)+"}";
  generatePDFCodePHP(alljs);
});

document.querySelector('#publish.save').addEventListener('click', function (e) {
 let compsToPDF = {};
 sheets.forEach(s => {
   if (compsToPDF[s.id]) {
     if (Array.isArray(compsToPDF[s.id])) {
       compsToPDF[s.id].push(mapeareOrdenarElementos(s.getSR().querySelector('.content'), s));
     } else {
       compsToPDF[s.id] = [compsToPDF[s.id], mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
     }
   } else {
     compsToPDF[s.id] = [mapeareOrdenarElementos(s.getSR().querySelector('.content'), s)];
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
 let alljs = "{\"ACAO\":1, \"FILE\":\""+fileName+"\", \"defaultConfigurations\":"+JSON.stringify(defaultConfigurations)+",\"incrementPageId\":"+incrementPageId+",\"datas\": \"213\",\"sheets\": "+JSON.stringify(sheets, replacer)+" , \"componentes\": "+JSON.stringify(compsToPDF, replacer)+", \"comuns\": "+JSON.stringify(comumComponents, replacer)+"}";

 sv(alljs).then((r) => {
  console.log(r);
  alert(r);
 });
});

async function sv(alljs) {
  return await savePDFJSON(alljs)
};

async function gt(rq) {
  return await getPDFJSON(rq)
};


zoomActions.querySelector('.moreZoom').addEventListener('click', function (e) {
  let z = parseFloat((defaultConfigurations.zoomPctg + 0.1));
  defaultConfigurations.zoomPctg = z;
  zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
  sheets.forEach(s => {
    s.setSizeSheet(z);
  });
});

zoomActions.querySelector('.lessZoom').addEventListener('click', function (e) {
  let z = (defaultConfigurations.zoomPctg - 0.1);
  defaultConfigurations.zoomPctg = z;
  zoomActions.querySelector('.zoomValue').innerHTML = (z * 100) + '%';
  sheets.forEach(s => {
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
  currentAction = 'HANDLE';
  //currentElement = null;
});

function mapeareOrdenarElementos(contentElement, sheet) {
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


pagesListButton.addEventListener('click', function (e) {
  listSheetsArea.classList.toggle("show");
});

function elementsDropDown() {
  elementsButton.parentElement.parentElement.querySelector('#myDropDownElements').classList.toggle("show");
};

function selectedAddElement(e, fromHTML = true) {
  document.querySelectorAll('.sheet').forEach(s => {
    s.classList.remove('gragItems');
  })

  let indexEl;

  if(fromHTML){
    let id = e.getAttribute('rel');
    indexEl = elementos.findIndex(item => item.id === Number(id));
  } else {
    indexEl = elementos.findIndex(item => item.id === Number(e));
  }

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

document.querySelector('#currentElement').addEventListener('click', function () {
  selectedAddElement(currentElement, false);
})

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

function createAccordeonComumComponents() {
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

//CRIAR PAGINA
function criarpaginafe(e) {
  new SHEET(incrementPageId, defaultConfigurations.margens).createSheet();
  incrementPageId = incrementPageId + 1;
}
newPageButton.addEventListener("click", criarpaginafe);
