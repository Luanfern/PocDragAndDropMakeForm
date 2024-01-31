function getImages() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var url = "./../getExternalInfos.php"; 
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var parametros = "ACAO=1";

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Solicitação POST das Imagens bem-sucedida");
                    resolve(JSON.parse(xhr.responseText));

                } else {
                    console.error("Erro na solicitação POST das Imagens");
                    reject(new Error('Erro de rede ao tentar fazer a requisição.'));
                }
            }
        };

        xhr.send(parametros);
    });
}

function getColumns() {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var url = "./../getExternalInfos.php"; 
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var parametros = "ACAO=2";

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Solicitação POST das Colunas bem-sucedida");
                    resolve(JSON.parse(xhr.responseText));

                } else {
                    console.error("Erro na solicitação POST das Colunas");
                    reject(new Error('Erro de rede ao tentar fazer a requisição.'));
                }
            }
        };

        xhr.send(parametros);
    });
}