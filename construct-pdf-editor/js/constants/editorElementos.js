import { CelulaElement } from "../implementations/celulaElement.js";
import { MultiCelulaElement } from "../implementations/multiCelulaElement.js";
import { ImageElement } from "../implementations/ImageElement.js";
import { fontes, opcoesDeBorda, opcoesAlinhamentoTexto, opcoesEstiloTexto } from "./editorOptions.js";

let editorElementos = function (listFieldsPDF, listImagesPDF) {
    return [{
      id: 1,
      nome: "Célula",
      icon: "⬜",
      class: CelulaElement,
      className: 'CelulaElement',
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
          values: opcoesAlinhamentoTexto
        },
        tfont: {
          icon: "🔬",
          label: "fonte",
          type: "select",
          values: fontes
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
          tt: opcoesEstiloTexto
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
          tt: opcoesDeBorda
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
      icon: "📃",
      class: MultiCelulaElement,
      className: 'MultiCelulaElement',
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
          values: opcoesAlinhamentoTexto
        },
        tfont: {
          icon: "🔬",
          label: "fonte",
          type: "select",
          values: fontes
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
          tt: opcoesEstiloTexto
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
          tt: opcoesDeBorda
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
      icon: "🖼️",
      class: ImageElement,
      className: 'ImageElement',
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
          values: listImagesPDF
        }
      }
    }];
  }

export { editorElementos };