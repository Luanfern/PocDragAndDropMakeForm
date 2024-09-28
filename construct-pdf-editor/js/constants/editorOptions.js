const fontes = [{
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
  {
    "key": "Franklin Gothic Medium",
    "value": "Franklin Gothic Medium"
  }
];
const opcoesDeBorda = [{
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
const opcoesAlinhamentoTexto = [{
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
const opcoesEstiloTexto = [{
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

export { fontes, opcoesDeBorda, opcoesAlinhamentoTexto, opcoesEstiloTexto, sideChars, alignText, weightText };