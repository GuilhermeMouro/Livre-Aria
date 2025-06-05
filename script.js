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
        const a = document.createElement("a");
        a.href = "detalhes.html?id=" + id;
        a.style.textDecoration = "none";
        a.style.color = "inherit";

        const h3 = document.createElement("h3");
        h3.textContent = titulo;

        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = "Autor: ";
        p.appendChild(strong);
        p.appendChild(document.createTextNode(autor));

        a.appendChild(h3);
        a.appendChild(p);

        if (capa) {
            const img = document.createElement("img");
            img.src = "https://covers.openlibrary.org/b/id/" + capa + "-M.jpg";
            img.alt = "Capa de " + titulo;
            a.appendChild(img);
        }

        div.appendChild(a);
        div.appendChild(document.createElement("hr"));
        sitio.appendChild(div);

        i++;
    }
}
