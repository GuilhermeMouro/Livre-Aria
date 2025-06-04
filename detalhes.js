document.addEventListener("DOMContentLoaded", function() {
    mostrarDetalhes();
});

async function mostrarDetalhes() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    const urlObra = "https://openlibrary.org/works/" + id + ".json";
    const resposta = await fetch(urlObra);
    const livro = await resposta.json();

    let titulo = "Sem título";
    if (livro.title) {
        titulo = livro.title;
    }

    let descricao = "Sem descrição";
    if (livro.description) {
        if (typeof livro.description === "string") {
            descricao = livro.description;
        } else if (livro.description.value) {
            descricao = livro.description.value;
        }
    }

    let nomes = "Autor desconhecido";
    if (livro.authors && livro.authors.length > 0) {
        nomes = "";
        for (let i = 0; i < livro.authors.length; i++) {
            const autor = livro.authors[i];
            const respostaAutor = await fetch("https://openlibrary.org" + autor.author.key + ".json");
            const dadosAutor = await respostaAutor.json();

            if (nomes !== "") {
                nomes += ", ";
            }
            nomes += dadosAutor.name;
        }
    }

    let capa = null;
    if (livro.covers && livro.covers.length > 0) {
        capa = livro.covers[0];
    }

    let link = "https://openlibrary.org/works/" + id;
    if (livro.links && livro.links.length > 0) {
        link = livro.links[0].url;
    } else {
        const respostaEdicoes = await fetch("https://openlibrary.org/works/" + id + "/editions.json");
        const edicoes = await respostaEdicoes.json();
        if (edicoes.entries && edicoes.entries.length > 0) {
            const edicao = edicoes.entries[0];
            link = "https://openlibrary.org" + edicao.key + "/preview";
        }
    }

    const sitio = document.getElementById("detalhesLivro");
    let html = "";

    if (capa) {
        html += '<img src="https://covers.openlibrary.org/b/id/' + capa + '-L.jpg" alt="Capa de ' + titulo + '">';
    }

    html += '<div class="info">';
    html += '<h2>' + titulo + '</h2>';
    html += '<p><strong>Autor:</strong> ' + nomes + '</p>';
    html += '<p><strong>Descrição:</strong> ' + descricao + '</p>';
    html += '<div class="botao-ler">';
    html += '<a href="' + link + '" target="_blank">📖 Ler</a>';
    html += '</div>';
    html += '</div>';

    sitio.innerHTML = html;
}
