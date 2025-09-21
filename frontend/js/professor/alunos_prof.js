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
                    <button id="abrir_notas" onclick="abrirNotas(${aluno.id}, '${aluno.nome}')">Notas</button>
                </div>
            `;

            html.appendChild(card);
        }
    } else {
        alert(results.message)
    }
}


async function abrirNotas(id_aluno, nome) {
    const response = await fetch(`http://localhost:3006/nota/${id_aluno}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        console.log(productData)

        const trimestre1 = productData.find(nota => nota.trimestre === 1);
        let tri1_nota1 = null
        let tri1_nota2 = null
        let tri1_media = null

        if (trimestre1) {
            tri1_nota1 = trimestre1.nota_1
            tri1_nota2 = trimestre1.nota_2
            if (tri1_nota1 && tri1_nota2) {
                tri1_media = (Number(tri1_nota1) + Number(tri1_nota2)) / 2
            }
        }

        console.log(tri1_nota1, tri1_nota2, tri1_media)

        const trimestre2 = productData.find(nota => nota.trimestre === 2);
        let tri2_nota1 = null
        let tri2_nota2 = null
        let tri2_media = null

        if (trimestre2) {
            tri2_nota1 = trimestre2.nota_1
            tri2_nota2 = trimestre2.nota_2
            if (tri2_nota1 && tri2_nota2) {
                tri2_media = (Number(tri2_nota1) + Number(tri2_nota2)) / 2
            }
        }

        console.log(tri2_nota1, tri2_nota2, tri2_media)

        const trimestre3 = productData.find(nota => nota.trimestre === 3);
        let tri3_nota1 = null
        let tri3_nota2 = null
        let tri3_media = null

        if (trimestre3) {
            tri3_nota1 = trimestre3.nota_1
            tri3_nota2 = trimestre3.nota_2
            if (tri3_nota1 && tri3_nota2) {
                tri3_media = (Number(tri3_nota1) + Number(tri3_nota2)) / 2
            }
        }

        console.log(tri3_nota1, tri3_nota2, tri3_media)


        let html = document.getElementById('notas')
        html.style.display = "flex";
        html.innerHTML = '';
        
        html.innerHTML = `
            <div class="cabecalho">
                <div class="nome_nota">${nome}</div>
                <div><p>Nota 1</p></div>
                <div><p>Nota 2</p></div>
                <div><p>Média</p></div>
            </div>
            <div class="tri1">
                <div><p>Trimestre 1</p></div>
                <div class="tri1_nota1">${verificarNullNota(id_aluno, nome, tri1_nota1, 1, 'nota_1')}</div>
                <div class="tri1_nota2">${verificarNullNota(id_aluno, nome, tri1_nota2, 1, 'nota_2')}</div>
                <div class="tri1_media">${verificarNullMedia(tri1_media)}</div>
            </div>
            <div class="tri2">
                <div><p>Trimestre 2</p></div>
                <div class="tri2_nota1">${verificarNullNota(id_aluno, nome, tri2_nota1, 2, 'nota_1')}</div>
                <div class="tri2_nota2">${verificarNullNota(id_aluno, nome, tri2_nota2, 2, 'nota_2')}</div>
                <div class="tri2_media">${verificarNullMedia(tri2_media)}</div>
            </div>
            <div class="tri3">
                <div><p>Trimestre 3</p></div>
                <div class="tri3_nota1">${verificarNullNota(id_aluno, nome, tri3_nota1, 3, 'nota_1')}</div>
                <div class="tri3_nota2">${verificarNullNota(id_aluno, nome, tri3_nota2, 3, 'nota_2')}</div>
                <div class="tri3_media">${verificarNullMedia(tri3_media)}</div>
            </div>
        `
    } else {
        alert(results.message)
    }
}

function verificarNullNota(id_aluno, nome, variavel, trimestre, nota) {
    if(variavel) {
        return `
            <p>${variavel}</p>
            <i class="fa-solid fa-pen-to-square" onclick="editarNota(${id_aluno}, '${nome}', ${trimestre}, '${nota}')"></i>
        `
    } else {
        return `
            <button id="adicionarNota" onclick="adicionarNota(${id_aluno}, '${nome}', ${trimestre}, '${nota}')">Adicionar</button>
        `
    }
}
function verificarNullMedia(variavel) {
    if(variavel) {
        return `<p>${variavel}</p>`
    } else {
        return ''
    }
}


async function adicionarNota(id_aluno, nome, trimestre, campo) {
    const valor = prompt("Digite a nota:");

    const data = {campo, valor, id_aluno, trimestre}

    const response = await fetch(`http://localhost:3006/nota`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        abrirNotas(id_aluno, nome)
    } else {
        alert(results.message)
    }
}

async function editarNota(id_aluno, nome, trimestre, campo) {
    const valor = prompt("Nova nota: ")

    const data = {campo, valor, id_aluno, trimestre}

    const response = await fetch(`http://localhost:3006/nota`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        abrirNotas(id_aluno, nome)
    } else {
        alert(results.message)
    }
}

function abrirPresenca() {
    window.location.href = "presenca_prof.html"
}

listarAlunos()