import { AbstractException, AbstractMethodException } from '../Exceptions/abstractExceptions.js'

class BaseElement {
    lastStatusProperties = {};
    drawsRepresentations = [];
    id = null
    x = 0;
    y = 0;
    width = 10;
    height = 0.4;
    constructor({id, x, y, height, width}) {
        if (new.target === BaseElement) {
            throw new AbstractException(this);
        }
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.id = id;
    }

    //desenhar elemento
    draw() {
        throw new AbstractMethodException(this);
    }

    //desenhar representação do elemento na lista de elementos
    drawItemRepresentation(){
        throw new AbstractMethodException(this);
    }

    changeConnectionPropertyItemRepresentation(){
        throw new AbstractMethodException(this);
    }

    //atualizar representação do elemento na lista de elementos
    updateItemRepresentation(){
        throw new AbstractMethodException(this);
    }

    //modificar parametros do elemento
    setParameters(p = [], v = []) {
        Object.assign(this.lastStatusProperties, this);
        p.forEach((pi, k) => {
          this[pi] = v[k]
        })
    }
    
    //voltar elemento para estado anterior
    rollback(){
        if(this.lastStatusProperties != null){
            Object.assign(this, this.lastStatusProperties);
        }
    }
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
    editor = null;
  
    constructor({editor, sheet, id, text = "DIRECTA TEXT!", x = 0, y = 0, width = 10, height = 0.4, freeSheet = false, comum = false, informacaoExterna = null}) {
      this.editor = editor;
      if(this.editor == null) throw Error('editorInstance não foi indicada');
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
        this.lastStatusOk = { ...this };
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
      if(sheet.inClick && this.editor.currentAction == 'HANDLE' && this.editor.selectedComponent.el == this){
        celulaInfo.classList.add('highlightMoving');
      } else {
        celulaInfo.classList.remove('highlightMoving');
        celulaInfo.classList.add('NOhighlight');
      }
      return celulaInfo;
    }
  
    copyPaste(typePaste = 1){
      alert('copy não implementado em todos os componentes!');
  
    /*   let indexEl = this.editor.elementos.findIndex(item => item.className === this.elementType);
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
  
      let componentToCopy = new this.editor.elementos[indexEl].class(copy);
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
        this.editor.sheets.forEach(s => {
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
      //this.lastStatusOk = { ...this };
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
        let elementInstance = this.editor.elementos[this.editor.elementos.findIndex(item => item.className === this.elementType)];
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
          this.editor.comumComponents.splice(this.editor.comumComponents.findIndex(c => c.id == this.id), 1);
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
      if(this.editor.comumComponents.length > 0){
        lastId = Number(this.editor.comumComponents[this.editor.comumComponents.length - 1].id.split('_').at(-1)) + 1;
      }
      let celulaComum = new this.constructor({
        editor: this.editor, sheet: this.sheet, id: 'comumComponent_'+lastId, text: this.text, x: this.x, y: this.y, width: this.width,
        height: this.height, freeSheet: this.freeSheet, comum: true, informacaoExterna: this.informacaoExterna,
        tcolor: this.tcolor, talign: this.talign, tfont: this.tfont, tsize: this.tsize, tweight: this.tweight,
        bcolor: this.bcolor , border: this.border, borderwidth: this.borderwidth, bordercolor: this.bordercolor,
        last: this.last, link: this.link
      });
      this.editor.comumComponents.push(celulaComum);
      this.editor.addToMyElements(celulaComum, 'comumComponents');
      this.deleteMe();
      this.editor.sheets.forEach(s => {
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

export {BaseElement, ElementBase};