const informacoesTurma = localStorage.getItem('turmaAberta');
const turma = JSON.parse(informacoesTurma);

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_aluno_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_aluno_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere aluno no banco
async function inserirAluno(event) {
    event.preventDefault()

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    const data = {nome, email, senha}

    const response = await fetch(`http://localhost:3006/alunos/${turma.id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarAlunos()
    } else {
        alert(results.message)
    }
}

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
                <p class="email">${aluno.email}</p>
                <p class="senha">${aluno.senha}</p>
                <div class="acoes">
                    <i class="fa-solid fa-pen-to-square" onclick="editarAluno(${aluno.id}, '${aluno.nome}', '${aluno.email}', '${aluno.senha}')"></i>
                    <i class="fa-solid fa-trash" onclick="deletarAlunos(${aluno.id})"></i>
                </div>
            `;

            html.appendChild(card);
        }
        listarAlunos()
    } else {
        alert(results.message)
    }
}

// edita o aluno
async function editarAluno(id) {
    const nome = prompt("Novo nome: ")
    const email = prompt("Novo email: ")
    const senha = prompt("Novo senha: ")

    const data = {nome, email, senha}

    const response = await fetch(`http://localhost:3006/alunos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarAlunos()
    } else {
        alert(results.message)
    }
}

// deleta a aula
async function deletarAluno(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/alunos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarAlunos();
        } else {
            alert(results.message)
        }
    }
}

listarAlunos()