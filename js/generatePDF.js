function generatePDFCodePHP(json) {

    console.log(json);
      // Cria um formulário dinamicamente
  var form = document.createElement('form');
  form.method = 'post';
  form.action = './../generatorPDFfromJSON.php'; // Substitua pela URL desejada
  form.target = '_blank'; // Abre a resposta em uma nova aba/janela


  // Cria um campo de entrada para o JSON
  var jsonInput = document.createElement('input');
  jsonInput.type = 'hidden';
  jsonInput.name = 'jsonPdfScaffold';
  jsonInput.value = json;
  form.appendChild(jsonInput);

  // Adiciona o formulário à página e o envia
  document.body.appendChild(form);
  form.submit();
}