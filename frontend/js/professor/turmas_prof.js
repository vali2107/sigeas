const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);

// lista as turmas e adiciona cards no front
async function listarTurmas() {
const response = await fetch(`http://localhost:3006/turmas/${usuario.id}`, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
})

const results = await response.json();

if (results.success) {
    let productData = results.data
    let html = document.getElementById('turmas_tudo')
    html.innerHTML = '';
    for (const turma of productData) {
        let card = document.createElement('div')
        card.classList.add('item')
        card.innerHTML += `
            <p class="titulo">${turma.id}.</p>
            <p class="titulo">${turma.nome}</p>
            <div class="acoes">
                <button class="abrir_turma_botao" onclick="abrirTurma(${turma.id}, '${turma.nome}')">Ver</button>
                <i class="fa-solid fa-pen-to-square" onclick="editarTurma(${turma.id})"></i>
                <i class="fa-solid fa-trash" onclick="deletarTurma(${turma.id})"></i>
            </div>
        `;

        html.appendChild(card);
    }
} else {
    alert(results.message)
}
}

listarTurmas()