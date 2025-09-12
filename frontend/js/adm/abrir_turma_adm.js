async function abrirTurma(id, nome) {
    let dados = {id, nome}
    localStorage.setItem('turmaAberta', JSON.stringify(dados))
    window.location.href = "turma_adm.html"
}

let html = document.getElementById('main_turma')
if (html) {
    const dados = JSON.parse(localStorage.getItem('turmaAberta'))

    const {id, nome} = dados

    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>${nome}</h1>
            <button id="abrir_add" onclick="abrirAdd()">Adicionar aluno</button>
        </div>
        <div id="alunos_tudo"></div>
        <form id="inserir_aluno_form">
            <input type="text" id="nome" placeholder="Nome">
            <input type="text" id="email" placeholder="E-Mail">
            <input type="text" id="senha" placeholder="Senha">
            <button id="inserir_turma_botao" onclick="inserirAluno(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
    `
}