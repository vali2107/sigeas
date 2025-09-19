async function abrirTurma(id, nome) {
    let dados = {id, nome}
    localStorage.setItem('turmaAberta', JSON.stringify(dados))
    window.location.href = "turma_prof.html"
}

let html = document.getElementById('main_turma')
if (html) {
    const dados = JSON.parse(localStorage.getItem('turmaAberta'))

    const {id, nome} = dados

    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>${nome}</h1>
            <button id="abrir_presenca" onclick="abrirPresenca()">Lançar Presença</button>
        </div>
        <div id="alunos_tudo"></div>
    `
}