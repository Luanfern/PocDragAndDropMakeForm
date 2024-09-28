import { BaseElement, ElementBase} from "../interfaces/baseElement.js";
import { fontes, opcoesDeBorda, opcoesAlinhamentoTexto, opcoesEstiloTexto, sideChars, alignText, weightText } from "../constants/editorOptions.js";

/* export class CelulaElement extends BaseElement{
    constructor({id, x, y, height, width}){
        super({id, x, y, height, width});
    }

    //desenhar elemento
    draw() {
        return document.createElement('div');
    }
}
 */

export class CelulaElement extends ElementBase {
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
    constructor({editor, sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = '', tcolor = "#000000", talign = "C", tfont = "Arial", tsize = 7, tweight = "", bcolor = "#ffffff", border = "T", borderwidth = 0.04, bordercolor = "#FF0000", last = 0, link = ""}) {
      super({editor, sheet, id, text, x, y, width, height, freeSheet, comum, informacaoExterna});
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
      this.elementType = 'Celula';
  
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
        this.lastStatusOk = { ...this };
        return celula;
      } else {
        return null;
      }
  
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
  
    copyPaste(typePaste = 1, x = null, y = null){
  
      let indexEl = this.editor.elementos.findIndex(item => item.className === this.elementType);
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
          copy.y = (this.editor.mousePositionPage.y - this.height/2);
        } else {
          copy.x = (this.editor.mousePositionPage.x - this.width/2);
          copy.y = (this.editor.mousePositionPage.y - this.height/2);
        }
      } else if(typePaste == 2){
        let down = this.editor.mousePositionPage.y - (this.y+this.height);
        let up = (this.editor.mousePositionPage.y - this.y)*-1;
        let left = (this.editor.mousePositionPage.x - this.x)*-1;
        let right = this.editor.mousePositionPage.x - (this.x+this.width);
  
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
  
      let componentToCopy = new this.editor.elementos[indexEl].class(copy);
      this.sheet.addElementoToSheetHtml(componentToCopy);
    }
  }