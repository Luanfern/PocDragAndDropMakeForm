import { PdfEditor } from './../construct-pdf-editor/js/construct-pdf-editor.js';

function onSave(jsonToSave) {
    console.log(jsonToSave);
    var form = document.createElement('form');
    form.method = 'post';
    form.action = './../generatorPDFfromJSON.php'; // Substitua pela URL desejada
    form.target = '_blank'; // Abre a resposta em uma nova aba/janela


    // Cria um campo de entrada para o JSON
    var jsonInput = document.createElement('input');
    jsonInput.type = 'hidden';
    jsonInput.name = 'jsonPdfScaffold';
    jsonInput.value = jsonToSave;
    form.appendChild(jsonInput);

    // Adiciona o formulário à página e o envia
    document.body.appendChild(form);
    form.submit();
};

function gj() {
    return new Promise((resolve, reject) => {
        let obj = '';
        resolve(obj);
    });
};

function getImages() {
    return new Promise((resolve, reject) => {
        let obj = [
            {
                "src": "https:\/\/img.freepik.com\/fotos-premium\/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg?w=2000",
                "url": "https:\/\/img.freepik.com\/fotos-premium\/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg"
            },
            {
                "src": "https:\/\/img.freepik.com\/fotos-premium\/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg?w=2000",
                "url": "https:\/\/img.freepik.com\/fotos-premium\/o-ceu-da-paisagem-do-arco-iris-refletiu-a-imagem-de-fundo-da-natureza-da-agua-ai-gerou-a-arte_856480-1354.jpg"
            }
        ];
        resolve(obj);
    });
}

function getColumns() {
    return new Promise((resolve, reject) => {
        let obj = [
            {
                "key": "1",
                "value": "ID_PRELIMINAR",
                "type":"data",
                "multiValues": "N",
            },
            {
                "key": "2",
                "value": "SEGURADORA_PRELIMINAR",
                "type":"data",
                "multiValues": "N"
            },
            {
                "key": "3",
                "value": "SEGURADO_PRELIMINAR",
                "type":"data",
                "multiValues": "N"
            },
            {
                "key": "4",
                "value": "DATA_PRELIMINAR",
                "type":"data",
                "multiValues": "N"
            },
            {
                "key": "5",
                "value": "ILOCAL_PRELIMINARD_PRELIMINAR",
                "type":"data",
                "multiValues": "N"
            },
            {
                "key": "8",
                "value": "FOTOS_GROUP_PRELIMINAR",
                "type":"group",
                "multiValues": "S",
                "fields":[
                    {
                        "key": "6",
                        "value": "FOTOS_PRELIMINAR",
                        "type":"image",
                        "multiValues": "S"
                    },
                    {
                        "key": "7",
                        "value": "FOTOS_DESC_PRELIMINAR",
                        "type":"data",
                        "multiValues": "S"
                    }
                ]
            },
        ];
        resolve(obj);
    });
}

let config = {};
let pdfEditor = new PdfEditor(config, 'NomeDoArquivo', onSave, gj, getImages, getColumns, '../construct-pdf-editor');

//PARAMETROS
//Colocar os dados: campos das preliminares, relatórios, url e listagem de imagens e etc...
//Colocar o template existente.
pdfEditor.start();