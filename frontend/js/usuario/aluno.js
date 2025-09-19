const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);

async function listarTurma() {
    const response = await fetch(`http://localhost:3006/turmaAluno/${usuario.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        let html = document.getElementById('informacoes_aluno')
        html.innerHTML = '';
        for (const aluno of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            console.log(aluno)
            card.innerHTML += `
                <h1 class="titulo">${aluno.nome} - </h1>
                <h1 class="titulo">${aluno.turma_nome}</h1>
            `;

            html.appendChild(card);
        }
    } else {
        alert(results.message)
    }
}

listarTurma()