// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_turma_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_turma_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere a turma no banco
async function inserirTurma(event) {
    event.preventDefault()

    const nome = document.getElementById("nome").value

    const data = {nome}

    const response = await fetch(`http://localhost:3006/turmas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarTurmas()
    } else {
        alert(results.message)
    }
}



// lista as turmas e adiciona cards no front
async function listarTurmas() {
    const response = await fetch('http://localhost:3006/turmas', {
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

// edita turma
async function editarTurma(id) {
    const nome = prompt("Novo nome: ")

    const data = {nome}

    const response = await fetch(`http://localhost:3006/turma/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarTurmas()
    } else {
        alert(results.message)
    }
}

// deleta a turma
async function deletarTurma(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/turma/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarTurmas();
        } else {
            alert(results.message)
        }
    }
}

listarTurmas()