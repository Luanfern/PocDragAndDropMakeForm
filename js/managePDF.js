function savePDFJSON(json) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var url = "./../managePDF.php"; 
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Solicitação POST das Colunas bem-sucedida");
                resolve(xhr.responseText);

            } else {
                console.error("Erro na solicitação POST das Colunas");
                reject(new Error('Erro de rede ao tentar fazer a requisição.'));
            }
        }
    };
    xhr.send(json);
  });
}

function getPDFJSON(json) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var url = "./../managePDF.php"; 
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Solicitação POST das Colunas bem-sucedida");
                resolve(xhr.responseText);

            } else {
                console.error("Erro na solicitação POST das Colunas");
                reject(new Error('Erro de rede ao tentar fazer a requisição.'));
            }
        }
    };
    xhr.send(json);
  });
}
