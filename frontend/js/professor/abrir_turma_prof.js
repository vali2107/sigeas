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
        <div id="notas">
            <div class="cabecalho">
                <div></div>
                <div><p>Nota 1</p></div>
                <div><p>Nota 2</p></div>
                <div><p>Média</p></div>
            </div>
            <div class="tri1">
                <div><p>Trimestre 1</p></div>
                <div class="tri1_nota1"></div>
                <div class="tri1_nota2"></div>
                <div class="tri1_media"></div>
            </div>
            <div class="tri2">
                <div><p>Trimestre 2</p></div>
                <div class="tri2_nota1"></div>
                <div class="tri2_nota2"></div>
                <div class="tri2_media"></div>
            </div>
            <div class="tri3">
                <div><p>Trimestre 3</p></div>
                <div class="tri3_nota1"></div>
                <div class="tri3_nota2"></div>
                <div class="tri3_media"></div>
            </div>
        </div>
        <div id="historico_chamada">
            <h2>Histórico de Chamada</h2>
            <div id="historico_tudo></div>
        </div>
    `
}

