// abre o form de adicionar
async function abrirAddP() {
    document.getElementById("inserir_professor_form").style.display = "flex";
    document.getElementById("abrir_addP").style.display = "none"
}

// fecha o form de adicionar
async function fecharAddP() {
    document.getElementById("inserir_professor_form").style.display = "none";
    document.getElementById("abrir_addP").style.display = "block"
}

// insere aluno no banco
async function inserirProfessores(event) {
    event.preventDefault()

    const nome = document.getElementById("nomeP").value
    const email = document.getElementById("emailP").value
    const senha = document.getElementById("senhaP").value
    const turmas = document.getElementById("turmas").value

    const data = {nome, email, senha, turma}

    const response = await fetch(`http://localhost:3006/professores`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarProfessores()
    } else {
        alert(results.message)
    }
}

// lista as professores e adiciona cards no front
async function listarProfessores() {
    const response = await fetch('http://localhost:3006/professores', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        let html = document.getElementById('professores')
        html.innerHTML = '';
        for (const professor of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            console.log(professor.id_turma)
            card.innerHTML += `
                <p class="titulo">${professor.id}.</p>
                <p class="titulo">${professor.nome}</p>
                <p class="titulo">${professor.email}</p>
                <p class="titulo">${professor.senha}</p>
                <p class="titulo">${professor.id_turma}</p>
                <div class="acoes">
                    <i class="fa-solid fa-pen-to-square" onclick="editarProfessores(${professor.id})"></i>
                    <i class="fa-solid fa-trash" onclick="deletarProfessores
                    
                    o(${professor.id})"></i>
                </div>
            `;

            html.appendChild(card);
        }
    } else {
        alert(results.message)
    }
}

// edita professor
async function editarProfessores(id) {
    const nome = prompt("Novo nome: ")

    const data = {nome}

    const response = await fetch(`http://localhost:3006/professores/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarProfessores()
    } else {
        alert(results.message)
    }
}

// deleta a aula
async function deletarProfessores(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/professores/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarProfessores();
        } else {
            alert(results.message)
        }
    }
}

listarProfessores()