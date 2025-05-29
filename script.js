// Executa após o DOM carregar
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("detalhes.html")) {
        carregarDetalhesLivro();
    } else {
        // Página index.html
        const botaoPesquisar = document.querySelector("button");
        if (botaoPesquisar) {
            botaoPesquisar.addEventListener("click", buscarLivros);
        }
    }
});

// Função para buscar livros na página index.html
async function buscarLivros() {
    const query = document.getElementById('search').value;
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&has_fulltext=true&public_scan=true`;

    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById('resultados');
    container.innerHTML = "";

    data.docs.slice(0, 10).forEach(livro => {
        const titulo = livro.title;
        const autor = livro.author_name?.[0] || "Autor desconhecido";
        const capaId = livro.cover_i;
        const chave = livro.key; // ex: "/works/OL12345W"
        const id = chave.split('/').pop(); // Extrai "OL12345W"

        const div = document.createElement("div");
        div.innerHTML = `
            <a href="detalhes.html?id=${id}" style="text-decoration: none; color: inherit;">
                <h3>${titulo}</h3>
                <p><strong>Autor:</strong> ${autor}</p>
                ${capaId ? `<img src="https://covers.openlibrary.org/b/id/${capaId}-M.jpg" alt="Capa de ${titulo}">` : ''}
            </a>
            <hr>
        `;
        container.appendChild(div);
    });
}

// Função para carregar detalhes do livro na página detalhes.html
async function carregarDetalhesLivro() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("detalhesLivro").innerHTML = "<p>ID do livro não encontrado.</p>";
        return;
    }

    const url = `https://openlibrary.org/works/${id}.json`;

    try {
        const response = await fetch(url);
        const livro = await response.json();

        const titulo = livro.title || "Título não disponível";
        const descricao = livro.description?.value || livro.description || "Descrição não disponível";
        const autores = livro.authors || [];

        let autoresNomes = "Autor desconhecido";
        if (autores.length > 0) {
            const promises = autores.map(async (a) => {
                const autorResp = await fetch(`https://openlibrary.org${a.author.key}.json`);
                const autorData = await autorResp.json();
                return autorData.name;
            });
            autoresNomes = (await Promise.all(promises)).join(", ");
        }

        const capaId = livro.covers?.[0];

        const container = document.getElementById("detalhesLivro");
        container.innerHTML = `
            ${capaId ? `<img src="https://covers.openlibrary.org/b/id/${capaId}-L.jpg" alt="Capa de ${titulo}">` : ''}
            <div class="info">
                <h2>${titulo}</h2>
                <p><strong>Autor:</strong> ${autoresNomes}</p>
                <p><strong>Descrição:</strong> ${descricao}</p>
                <div class="botao-ler">
                    <a href="#" target="_blank">Ler</a>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById("detalhesLivro").innerHTML = "<p>Erro ao carregar os detalhes do livro.</p>";
        console.error(error);
    }
}
