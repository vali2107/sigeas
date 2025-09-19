const informacoesTurma = localStorage.getItem('turmaAberta');
const turma = JSON.parse(informacoesTurma);

// // abre o form de adicionar
// async function abrirAdd() {
//     document.getElementById("inserir_aluno_form").style.display = "flex";
//     document.getElementById("abrir_add").style.display = "none"
// }

// // fecha o form de adicionar
// async function fecharAdd() {
//     document.getElementById("inserir_aluno_form").style.display = "none";
//     document.getElementById("abrir_add").style.display = "block"
// }


// lista os alunos e adiciona cards no front
async function listarAlunos() {
    const response = await fetch(`http://localhost:3006/alunos/${turma.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        let html = document.getElementById('alunos_tudo')
        html.innerHTML = '';
        for (const aluno of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            card.innerHTML += `
                <p class="nome">${aluno.nome}</p>
                <div class="acoes">
                    <button id="abrir_notas" onclick="abrirNotas()">Notas</button>
                </div>
            `;

            html.appendChild(card);
        }
        listarAlunos()
    } else {
        alert(results.message)
    }
}

listarAlunos()