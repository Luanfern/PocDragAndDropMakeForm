export class SHEET {
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
    editor = null;
    constructor(editor, id, margem = {
      "top": 1,
      "bottom": 1,
      "left": 1,
      "right": 1
    }, components = []) {
      this.editor = editor;
      if(this.editor == null) throw Error('editorInstance não foi indicada');
      this.id = id;
      this.components = components;
      this.margem = margem;
      this.wcm = 2.65 * this.editor.defaultConfigurations.zoom.x / this.width;
      this.hcm = 2.65 * this.editor.defaultConfigurations.zoom.y / this.height;
      this.rectConstruct = [];
      this.inClick = false;
    }
  
  
    //CREATE SHEET
    createSheet() {
      let newSheet = document.createElement("div");
      newSheet.setAttribute('class', 'sheet');
      newSheet.setAttribute('rel', this.id);
      if(this.editor.currentAction == 'HANDLE'){
        newSheet.classList.add('gragItems');
      }
      newSheet.insertAdjacentHTML('beforeend', '<div class="addelementTip"><div><b>X (CM):</b><div class="coordXSheet"></div></div> &nbsp;&nbsp;|&nbsp;&nbsp; <div><b>Y (CM):</b><div class="coordYSheet"></div></div></div><div class="classificacaoSheet"><input type="checkbox" name="classificacaoSheet'+this.id+'" id="classificacaoSheet'+this.id+'" rel="'+this.id+'">&nbsp<label for="classificacaoSheet'+this.id+'"><b>Unir com a página anterior</b></label></div><div class="mv mtop"></div><div class="mv mbottom"></div><div class="mh mleft"></div><div class="mh mright"></div> <div class="content"></div>');
      this.editor.viewManager.append(newSheet);
      this.selfReference = newSheet;
      this.editor.sheets.push(this);
  
      let t = this;
      document.getElementById('classificacaoSheet'+this.id).addEventListener('change', function (e) {
        t.editor.unirPaginaAnterior(e.target);
      });
  
      this.clickDropElementsSheet();
      this.createMiniSheet();
      this.editor.setCurrentPage(this.id, true);
      this.editor.applyMargins(this.id, this.margem);
      this.createAccordeonSheet();
  
      if (document.querySelector('.nosheetsExist')) {
        document.querySelector('.nosheetsExist').parentElement.removeChild(document.querySelector('.nosheetsExist'));
      }
  
      //CREATE COMUNS COMPONENTS -> EXTERNAL AFTER!
      this.editor.comumComponents.forEach(c => {
        let celula = c.draw();
        let currentSheet = this.getSR().querySelector('.content');
        currentSheet.appendChild(celula);
      })
  
      this.setSizeSheet(this.editor.defaultConfigurations.zoomPctg);
      this.setBackgroundImageTemplate();
    }
  
  
  
    //CREATE MINISHEET
    createMiniSheet() {
      let paiRef = this;
      this.editor.listSheetsArea.insertAdjacentHTML('beforeend', '<div class="minisheet" onclick="setCurrentPage(' + this.id + ', true, true)" rel="' + this.id + '"><div class="contentMiniSheet"><p>ID ' + this.id + '</p></div><div class="excluirPagina">Excluir</div></div>');
      let qs = document.querySelector('.minisheet[rel="'+this.id+'"] .excluirPagina');
      qs.addEventListener('click', function (e) {
        let depend = paiRef.editor.sheets[paiRef.editor.sheets.findIndex(s => s.unionPreviousPage == paiRef.id)];
        if(depend != undefined) {
          alert('Outra(s) página(s) dependem dessa. Delete elas para prosseguir.');
          return false;
        }
        e.stopPropagation();
        let acdon = this.editor.listElementsArea.querySelector('.contentAUX .pageAccordeon[rel="'+paiRef.id+'"]');
        acdon.parentElement.removeChild(acdon);
  
        let mnst = this.editor.listSheetsArea.querySelector('.minisheet[rel="'+paiRef.id+'"]');
        mnst.parentElement.removeChild(mnst);
        
        paiRef.editor.sheets.splice(paiRef.editor.sheets.findIndex(s => s.id == paiRef.id), 1);
        
        paiRef.getSR().parentElement.removeChild(paiRef.getSR());
  
      })
    }
  
    setSizeSheet(pctg) {
      let x = (this.editor.defaultConfigurations.zoom.x * this.editor.defaultConfigurations.zoomPctg);
      let y = (this.editor.defaultConfigurations.zoom.y * this.editor.defaultConfigurations.zoomPctg);
  
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
  
      this.editor.comumComponents.forEach(c => {
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
  
      this.editor.listElementsArea.querySelector('.contentAUX').insertAdjacentElement('beforeend', pageAccordeon);
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
        if (paiRef.editor.currentAction == 'HANDLE') {
          if(paiRef.editor.shiftPressed){
            paiRef.editor.selectedGroupComponents = [];
            paiRef.editor.cntrCGroupComponent = {np: null,el: []};
            paiRef.editor.cntrCComponent = {np: null,el: {id: null}};
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
                el = paiRef.editor.comumComponents[paiRef.editor.comumComponents.findIndex(cm => cm.id == e.target.getAttribute('rel'))];
              }
              if(content.querySelector('.flutpoint') != null){
                content.removeChild(content.querySelector('.flutpoint'));
              }
              if(paiRef.editor.selectedGroupComponents.findIndex(f => f.id == el.id) == -1){
                paiRef.editor.selectedGroupComponents = [];
                paiRef.editor.cntrCGroupComponent = {np: null,el: []};
                paiRef.editor.cntrCComponent = {np: null,el: {id: null}};
                Array.from(document.querySelectorAll('.componentPDF')).forEach(c => {
                  c.classList.remove('highlight');
                  c.classList.add('NOhighlight');
                });
                e.target.classList.remove('NOhighlight');
                e.target.classList.add('highlight');
                paiRef.editor.selectComponent(paiRef.id, el);
                const rect = el.getSR().getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
    
                paiRef.editor.selectedComponentAnchorMove = {
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
                  paiRef.editor.selectedGroupComponents = [];
                }
              }
            }
          }
        } else {
          if (paiRef.editor.currentElement == null && paiRef.editor.currentAction == null) {
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
        if (paiRef.inClick && paiRef.editor.currentAction == 'HANDLE') {
          //if(paiRef.editor.shiftPressed){}
          if(content.querySelector('.selectAreaMouse') != null){
            content.removeChild(selectAreaMouse);
          }
  
          if(paiRef.editor.shiftPressed != true && e.target.classList.contains("flutpoint")){
            paiRef.editor.selectedGroupComponentsProvSquare.moving = false;
            if(dndraw){
              paiRef.editor.selectedGroupComponents.forEach((rdg) => {
                rdg.setParameters(['x', 'y'], [(rdg.x + (paiRef.editor.selectedGroupComponentsProvSquare.draw.x - paiRef.editor.selectedGroupComponentsProvSquare.x)), (rdg.y + (paiRef.editor.selectedGroupComponentsProvSquare.draw.y - paiRef.editor.selectedGroupComponentsProvSquare.y))]);
                rdg.setParameterComponent('y', (rdg.y + (paiRef.editor.selectedGroupComponentsProvSquare.draw.y - paiRef.editor.selectedGroupComponentsProvSquare.y)));
              });
            }
            paiRef.editor.selectedGroupComponentsProvSquare={x: 21,y: 29,w: 0,h: 0,moving: false,draw: {x: 0,y: 0}};
            paiRef.editor.selectedGroupComponents = [];
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
          paiRef.editor.selectedComponentAnchorMove = null;
          paiRef.rectConstruct = [];
          e.target.classList.remove('highlightMoving');
          e.target.classList.add('highlight');
        }
        if (paiRef.inClick && paiRef.editor.currentAction == 'CREATE') {
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
  
          let indexEl = paiRef.editor.elementos.findIndex(item => item.id === Number(paiRef.editor.currentElement));
          let free = false;
          if(e.button == 0) free = false;
          if(e.button == 2) free = true;
          let componentToCreate = new paiRef.editor.elementos[indexEl].class({editor: paiRef.editor, sheet: paiRef, id: paiRef.id+'_'+insertID, x: x, y: y, width: w, height: h, freeSheet: free, comum: false, informacaoExterna: null});
          paiRef.addElementoToSheetHtml(componentToCreate);
  
          paiRef.rectConstruct = [];
        }
      });
  
      content.addEventListener('mousemove', function (e) {
        let tip = paiRef.selfReference.querySelector('.addelementTip');
        var mouseX = e.clientX - paiRef.selfReference.getBoundingClientRect().x;
        var mouseY = e.clientY - paiRef.selfReference.getBoundingClientRect().y;
        if (paiRef.inClick && paiRef.editor.currentAction == 'CREATE' && paiRef.rectConstruct != []) {
          selectAreaMouse.style.width = mouseX - paiRef.rectConstruct[0].x + 'px';
          selectAreaMouse.style.height = mouseY - paiRef.rectConstruct[0].y + 'px';
        }
  
        paiRef.editor.mousePositionPage.x = ((mouseX) / paiRef.wcm).toFixed(1);
        paiRef.editor.mousePositionPage.y = ((mouseY) / paiRef.hcm).toFixed(1);
        tip.querySelector('.coordXSheet').innerHTML = ((mouseX) / paiRef.wcm).toFixed(1);
        tip.querySelector('.coordYSheet').innerHTML = ((mouseY) / paiRef.hcm).toFixed(1);
  
        if (paiRef.inClick && paiRef.editor.currentAction == 'HANDLE' && paiRef.editor.selectedComponent.el?.id != 0 && paiRef.editor.selectedComponentAnchorMove != null) {
          paiRef.editor.selectedGroupComponentsProvSquare.moving = false;
          let nx = (((mouseX) / paiRef.wcm) - ((paiRef.editor.selectedComponentAnchorMove.x / paiRef.wcm)));
          let ny = (((mouseY) / paiRef.hcm) - ((paiRef.editor.selectedComponentAnchorMove.y / paiRef.hcm)));
          paiRef.editor.selectedComponent.el.setParameterComponent(parseFloat(nx), 'x');
          paiRef.editor.selectedComponent.el.setParameterComponent(parseFloat(ny), 'y');
        }
  
        if(paiRef.inClick && paiRef.editor.currentAction == 'HANDLE' && paiRef.editor.shiftPressed == true){
          paiRef.editor.selectedGroupComponentsProvSquare.moving = false;
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
               if(!paiRef.editor.selectedGroupComponents.includes(elemento)) {
                paiRef.editor.selectedGroupComponents.push(elemento);
                elemento.selfReference[0].classList.remove('NOhighlight');
                elemento.selfReference[0].classList.add('highlight');
               }
            } else {
              elemento.selfReference[0].classList.remove('highlight');
              elemento.selfReference[0].classList.add('NOhighlight')
            }
          }
  
          paiRef.editor.selectedGroupComponentsProvSquare.x = 21;
          paiRef.editor.selectedGroupComponentsProvSquare.y = 29;
          paiRef.editor.selectedGroupComponentsProvSquare.w = 0;
          paiRef.editor.selectedGroupComponentsProvSquare.h = 0;
          paiRef.editor.selectedGroupComponents.forEach(sgc => {
            if(sgc.x < paiRef.editor.selectedGroupComponentsProvSquare.x){
              paiRef.editor.selectedGroupComponentsProvSquare.x = sgc.x;
            }
            if(sgc.y < paiRef.editor.selectedGroupComponentsProvSquare.y){
              paiRef.editor.selectedGroupComponentsProvSquare.y = sgc.y;
            }
            if((sgc.x + sgc.width) > paiRef.editor.selectedGroupComponentsProvSquare.w){
              paiRef.editor.selectedGroupComponentsProvSquare.w = (sgc.x + sgc.width);
            }
            if((sgc.y + sgc.height) > paiRef.editor.selectedGroupComponentsProvSquare.h){
              paiRef.editor.selectedGroupComponentsProvSquare.h = (sgc.y + sgc.height);
            }
          });
  
          
          point.style.top = (paiRef.editor.selectedGroupComponentsProvSquare.y * paiRef.hcm)+'px';
          point.style.left = (paiRef.editor.selectedGroupComponentsProvSquare.x* paiRef.wcm)+'px';
          point.style.width = ((paiRef.editor.selectedGroupComponentsProvSquare.w-paiRef.editor.selectedGroupComponentsProvSquare.x)* paiRef.wcm) + 'px';
          point.style.height = ((paiRef.editor.selectedGroupComponentsProvSquare.h - paiRef.editor.selectedGroupComponentsProvSquare.y)* paiRef.hcm) + 'px';
          if(content.querySelector('.flutpoint') != null){
            content.removeChild(content.querySelector('.flutpoint'));
          }
          content.append(point);
        }
  
        if(paiRef.inClick && paiRef.editor.currentAction == 'HANDLE' && paiRef.editor.shiftPressed != true && (e.target.classList.contains("flutpoint") || paiRef.editor.selectedGroupComponentsProvSquare.moving == true)){
          paiRef.editor.selectedGroupComponentsProvSquare.moving = true;
  
          if((parseFloat(point.style.width) / paiRef.wcm) >= ((paiRef.width - ((paiRef.margem.left + paiRef.margem.right)  / paiRef.wcm))*0.85)){
            point.style.top = Number(mouseY - (parseFloat(point.style.height) / 2))+'px';
          } else {
            point.style.left = Number(mouseX - (parseFloat(point.style.width) / 2))+'px';
            point.style.top = Number(mouseY - (parseFloat(point.style.height) / 2))+'px';
          }
          
          let locdndraw = true;
          for (const elemento of paiRef.components.filter(pec => !paiRef.editor.selectedGroupComponents.includes(pec))) {
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
            paiRef.editor.selectedGroupComponentsProvSquare.draw.x = parseFloat(point.style.left) / paiRef.wcm;
            paiRef.editor.selectedGroupComponentsProvSquare.draw.y = parseFloat(point.style.top) / paiRef.hcm;
            point.style.backgroundColor = '';
          }
        }
      });
  
      content.addEventListener('mouseover', function (e) {
        if(paiRef.inClick) return false;
        if (paiRef.editor.currentAction == 'HANDLE') {
          if(paiRef.editor.selectedGroupComponents.findIndex(f => f.id == e.target.getAttribute('rel')) != -1) return false;
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
        if (paiRef.editor.currentAction == 'HANDLE') {
          if(paiRef.editor.selectedGroupComponents.findIndex(f => f.id == e.target.getAttribute('rel')) != -1) return false;
          // Verifica se o alvo do evento é um filho do paiElemento
          const isFilho = Array.from(document.querySelectorAll('.componentPDF')).some((filho) => filho.contains(e.target));
          if (isFilho) {
            if (paiRef.editor.selectedComponent.el?.id != e.target.getAttribute('rel')) {
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
        touchComponent = this.editor.verificarSobreposicao(this.components.filter((numero) => numero.id != elID), mxy[0].x/this.wcm, mxy[0].y/this.hcm, ((mxy[1].x/this.wcm)-(mxy[0].x/this.wcm)), ((mxy[1].y/this.hcm) - (mxy[0].y/this.hcm)));
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
        this.editor.addToMyElements(ne, this.id);
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
      let url = this.editor.templateModelBackground;
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