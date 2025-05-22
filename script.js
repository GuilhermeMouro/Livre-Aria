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

        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${titulo}</h3>
            <p><strong>Autor:</strong> ${autor}</p>
            ${capaId ? `<img src="https://covers.openlibrary.org/b/id/${capaId}-M.jpg" alt="Capa de ${titulo}">` : ''}
            <hr>
        `;
        container.appendChild(div);
    });
}
