const viewManager = document.querySelector('#viewManager');
const newPageButton = document.querySelector("#newPage");
const newElementButton = document.querySelector("#newElement");
const listSheetsArea = document.querySelector("#listSheets");
const configSheetArea = document.querySelector("#configSheet");


//INICIAL
//somente capturar dimensões iniciais!
const sheetcontent = document.querySelector('.sheet').querySelector('.content');

let wcm = (sheetcontent.offsetWidth) / 21.0;
let hcm = (sheetcontent.offsetHeight) / 29.7;
let currentPage = 1;
let lastNP = 1;
let file = [
  {"NP": 1,
  sheetmargins: {
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
  },
  components: {}
  }
];

file.forEach((e) => {
  if (e.NP == currentPage) {
    createMiniSheet(e.NP, true);
  } else {
    createMiniSheet(e.NP, false);
  }
})

configSheetArea.querySelector('.currentPage').insertAdjacentHTML('beforeend', currentPage);

applyMargins(1);




//SET CURRENT PAGE
function setCurrentPage(np){
  currentPage = np;
  listSheetsArea.querySelectorAll('.minisheet').forEach((m) => {
    console.log(m);
    let r = m.getAttribute('rel');

    if(r == np){
      m.classList.add('miniSheetActive');
      m.innerHTML = 'AQUI <p>'+r+'</p>';
    } else {
      m.classList.remove('miniSheetActive');
      m.innerHTML = '<p>'+r+'</p>';
    }
  });
  configSheetArea.querySelector('.currentPage').textContent = 'Página atual: '+currentPage;
  let esheet = document.querySelector('.sheet[rel="'+np+'"]');
  esheet.scrollIntoView({ behavior: 'smooth' });
}



//BTN ACTIONS 
newPageButton.addEventListener("click", createPage);

newElementButton.addEventListener("click", function (e) {
  let c = new Celula('RELATÓRIO PRELIMINAR - VIA akad', 19, 0.6, undefined, "C", undefined, 8, "B", undefined, "", '0.04', '#FF0000', 1, undefined).draw();
  sheetcontent.appendChild(c);

  let c2 = new Celula('1-REGULADORA', 19, 0.40, undefined, "C", undefined, undefined, "B", undefined, "B", '0.04', '#FF0000', 1, undefined).draw();
  sheetcontent.appendChild(c2);

  let c3 = new Celula('NOME', 19, 0.35, undefined, "L", undefined, undefined, undefined, undefined, "", '0.04', '#FF0000', 1, undefined).draw();
  sheetcontent.appendChild(c3);

  let c4 = new Celula('Directa Reguladora Ltda.', 19, 0.35, undefined, "L", undefined, undefined, undefined, undefined, "B", '0.04', '#FF0000', 1, undefined).draw();
  sheetcontent.appendChild(c4);

  
  let c5 = new Celula('E-MAIL', 7, 0.35, undefined, "L", undefined, undefined, undefined, undefined, "R", '0.04', '#FF0000', 0, undefined).draw();
  sheetcontent.appendChild(c5);

  
  let c6 = new Celula('CONTATO', 5, 0.35, undefined, "L", undefined, undefined, undefined, undefined, "R", '0.04', '#FF0000', 0, undefined).draw();
  sheetcontent.appendChild(c6);

  
  let c7 = new Celula('TELEFONE', 7, 0.35, undefined, "L", undefined, undefined, undefined, undefined, "", '0.04', '#FF0000', 1, undefined).draw();
  sheetcontent.appendChild(c7);
})





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

  applyMargins(1);

}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



//MARGINS
function applyMargins(np) {
  const iverticalMT = document.getElementById('verticalMT').value;
  const iverticalMR = document.getElementById('verticalMR').value;
  const ihorizontalME = document.getElementById('horizontalME').value;
  const ihorizontalMD = document.getElementById('horizontalMD').value;

  var marginsh = document.getElementsByClassName("mh");
  var marginsv = document.getElementsByClassName("mv");

  Array.from(marginsh).forEach(element => {
    if (element.classList.contains("mleft")) {
      element.style.left = (wcm * ihorizontalME) + 'px';
    }
    if (element.classList.contains("mright")) {
      element.style.right = (wcm * ihorizontalMD) + 'px';
    }
  });

  Array.from(marginsv).forEach(element => {
    if (element.classList.contains("mbottom")) {
      element.style.bottom = (hcm * iverticalMR) + 'px';

    }
    if (element.classList.contains("mtop")) {
      element.style.top = (hcm * iverticalMT) + 'px';
    }
  });

  let indexNP = file.findIndex(item => item.NP === np);
  file[indexNP].sheetmargins = {
    top: (hcm * iverticalMT),
    bottom: (hcm * iverticalMR),
    left: (wcm * ihorizontalME),
    right: (wcm * ihorizontalMD)
  }

  sheetcontent.style.padding = (hcm * iverticalMT)+"px "+(wcm * ihorizontalMD) +"px "+(hcm * iverticalMR)+"px "+(wcm * ihorizontalME)+"px";
  
}





//CREATE PAGE
function createPage(e) {

  file.push({"NP": ++lastNP,
  sheetmargins: {
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0
  },
  components: {}
  })

  let newSheet = document.createElement("div");
  newSheet.setAttribute('class', 'sheet');
  newSheet.setAttribute('rel', lastNP);
  newSheet.addEventListener("click", function(){})
  newSheet.insertAdjacentHTML('beforeend', '<div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div id="content"></div>');
  viewManager.append(newSheet);
  applyMargins(lastNP);

  createMiniSheet(lastNP, false);

setCurrentPage(lastNP);
}





//CREATE MINISHEET
function createMiniSheet(np, active){
  if (active) {
    listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet miniSheetActive" onclick="setCurrentPage('+np+')" rel="'+np+'">AQUI <p>'+np+'</p></div>');
  } else {
    listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet" onclick="setCurrentPage('+np+')" rel="'+np+'"><p>'+np+'</p></div>');
  }
}






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
  width = '19'; //
  height = "0.5"; //
  talign = ""; //
  tfont = ""; //
  tsize = ""; //
  tweight = ""; //
  tcolor = "#000"; //
  text = "DIRECTA TEXT!"; //
  bcolor = "none"; //
  border = "";
  borderwidth = "";
  bordercolor = "";
  last = 0; //
  link = ""; //
  constructor(text, width, height, tcolor = "#000", talign = "L", tfont = "Arial", tsize = 7, tweight = "", bcolor = "none", bordersides = "", borderwidth = "", bordercolor = "", last = 0, link = "", ) {
    this.text = text;
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
  }

  draw() {
    let celula = document.createElement("div");
    celula.setAttribute("id", "1");

    //BACKGROUND COLOR
    celula.style.backgroundColor = this.bcolor;

    //HEIGHT - WIDTH
    celula.style.width = (wcm * this.width) + 'px';
    celula.style.height = (hcm * this.height) + 'px';

    //TEXT
    var text = document.createTextNode(this.text);
    celula.style.fontFamily = this.tfont;

    let fs = hcm*(parseFloat(this.tsize)/(72/2.56));
    //console.log(fs+'px');
    celula.style.fontSize = fs+'px';

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
      let w = hcm*this.borderwidth;
      celula.style[sd]=w+"px solid "+this.bordercolor;
    })

    celula.setAttribute('class', 'lines');

    celula.appendChild(text);

    if (this.last == 0) {
      let linegroup = document.createElement('div');
      linegroup.setAttribute('class', 'linegroup'+1);
      linegroup.appendChild(celula);

      return linegroup;
    }
     else {
      return celula;
     }
  }

  setBorder(sides, width, color) {
    this.border = sides;
    this.borderwidth = width;
    this.bordercolor = color;
    this.draw();
  }
}
