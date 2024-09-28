import { BaseElement, ElementBase} from "../interfaces/baseElement.js";
import { fontes, opcoesDeBorda, opcoesAlinhamentoTexto, opcoesEstiloTexto, sideChars, alignText, weightText } from "../constants/editorOptions.js";
/* export class ImageElement extends BaseElement{
    constructor({id, x, y, height, width}){
        super({id, x, y, height, width});
    }

    //desenhar elemento
    draw() {
        return document.createElement('div');
    }
} */

export class ImageElement extends ElementBase{
    //'./PocDragAndDropMakeForm/img/NoImage.jpg'
    originalSizeSettedCNF = {w:0,h:0};
    imagePath = '';
    extensionImage = '';
    imageOriginal = false;
    proporcionalSize = 1;
    sizeLink = false;
    constructor({editor, sheet, id, text = "DIRECTA Image!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = true, informacaoExterna = null, imageOriginal = false, sizeLink = false }) {
      super({editor, sheet, id, text, x, y, width , height , freeSheet, comum, informacaoExterna});
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
  
      if(this.imageOriginal && (this.originalSizeSettedCNF.w == 0 || this.originalSizeSettedCNF.h == 0)){
        let t = this;
        let img = new Image();
        img.onload = function () {
  
          let pStats = sheet.intoContentRect([{
            x: (sheet.wcm * t.x),
            y: (sheet.hcm * t.y)
          }, {
            x: ((this.width / t.sheet.wcm) + t.x) * sheet.wcm,
            y: ((this.height / t.sheet.hcm) + t.y) * sheet.hcm
          }], t.freeSheet, t.id, t.comum);
      
          if(pStats.retInto){
            t.setParameters(['width', 'height', 'originalSizeSettedCNF'], [(this.width / t.sheet.wcm), (this.height / t.sheet.hcm), {w:(this.width / t.sheet.wcm), h: (this.height / t.sheet.hcm)}]);
          } else {
            alert('BIG IMAGE! CANNOT RESIZE TO ORIGINAL SIZE.');
            t.setParameters(['imageOriginal', 'originalSizeSettedCNF'], [false, {w:0, h:0}]);
          }
          t.reDraw(t.draw());
        }
        img.src = imageOnUse;
        img.remove();
        return null;
      }
  
      if(!this.imageOriginal){
        this.setParameters(['originalSizeSettedCNF'], [{w:0, h:0}]);
  
      }
  
      if(this.sizeLink){
        if(this.lastStatusOk.height != this.height && this.lastStatusOk.width == this.width){
          this.proporcionalSize = this.height/this.lastStatusOk.height;
          this.setParameters(['width'], [this.width * this.proporcionalSize]);
          console.log(this.proporcionalSize);
        } else if(this.lastStatusOk.width != this.width && this.lastStatusOk.height == this.height){
          this.proporcionalSize = this.width/this.lastStatusOk.width;
          this.setParameters(['height'], [this.height * this.proporcionalSize]);
          console.log(this.proporcionalSize);
        }
      } else {
          this.proporcionalSize = 1;
      }
  
      let pStats = sheet.intoContentRect([{
        x: (sheet.wcm * this.x),
        y: (sheet.hcm * this.y)
      }, {
        x: (this.width + this.x) * sheet.wcm,
        y: (this.height + this.y) * sheet.hcm
      }], this.freeSheet, this.id, this.comum);
  
      if(pStats.retInto == false){
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
        this.lastStatusOk = { ...this };
        return celula;
      } else {
        return null;
      }
  
    }
  }