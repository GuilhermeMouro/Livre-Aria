document.addEventListener("DOMContentLoaded", function() {
    const botao = document.querySelector("button");
    if (botao) {
        botao.addEventListener("click", procurarLivros);
    }
});

async function procurarLivros() {
    const input = document.getElementById("search");
    const procurar = input.value;

    const url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(procurar) + "&has_fulltext=true&public_scan=true";

    const resposta = await fetch(url);
    const dados = await resposta.json();

    const sitio = document.getElementById("resultados");
    sitio.innerHTML = "";

    const livros = dados.docs;
    let i = 0;

    while (i < livros.length && i < 10) {
        const livro = livros[i];

        let titulo = livro.title;
        let autor = "Autor desconhecido";
        if (livro.author_name && livro.author_name.length > 0) {
            autor = livro.author_name[0];
        }

        let capa = null;
        if (livro.cover_i) {
            capa = livro.cover_i;
        }

        let chave = livro.key;
        let partes = chave.split("/");
        let id = partes[partes.length - 1];

        const div = document.createElement("div");

        let html = "";
        html += '<a href="detalhes.html?id=' + id + '" style="text-decoration: none; color: inherit;">';
        html += '<h3>' + titulo + '</h3>';
        html += '<p><strong>Autor:</strong> ' + autor + '</p>';
        if (capa) {
            html += '<img src="https://covers.openlibrary.org/b/id/' + capa + '-M.jpg" alt="Capa de ' + titulo + '">';
        }
        html += '</a>';
        html += '<hr>';

        div.innerHTML = html;
        sitio.appendChild(div);

        i++;
    }
}
