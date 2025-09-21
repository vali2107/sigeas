const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario); 
const API = 'http://localhost:3006';

function ymdToBr(ymd) {
  if (!ymd) return '';
  const onlyDate = String(ymd).split('T')[0];
  const [y, m, d] = onlyDate.split('-');
  return `${d}/${m}/${y}`;
}

async function listarTurma() {
  const response = await fetch(`${API}/turmaAluno/${usuario.id}`, {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) {
    const txt = await response.text();
    alert(`Erro ${response.status} ao carregar dados do aluno: ${txt}`);
    return;
  }

  const results = await response.json();

  if (results.success) {
    const productData = results.data;
    const html = document.getElementById('informacoes_aluno');
    html.innerHTML = '';

    for (const aluno of productData) {
      const card = document.createElement('div');
      card.classList.add('item');

      card.innerHTML = `
        <h1 class="titulo topo">${aluno.nome} - ${aluno.turma_nome}</h1>
        <div id="historico_${aluno.id}" class="historico"></div>
      `;
      html.appendChild(card);

      await listarHistoricoAluno(aluno.id, aluno.id_turma);
    }
  } else {
    alert(results.message);
  }
}

async function listarHistoricoAluno(idAluno, idTurma) {
  const url = `${API}/presencaAluno/${idAluno}?turmaId=${encodeURIComponent(idTurma)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  });

  const historicoDiv = document.getElementById(`historico_${idAluno}`);

  if (!response.ok) {
    const txt = await response.text();
    historicoDiv.innerHTML = `<p style="color:red;">Erro ${response.status}: ${txt}</p>`;
    return;
  }

  const results = await response.json();
  if (!results.success) {
    historicoDiv.innerHTML = `<p style="color:red;">${results.message || 'Erro ao carregar histórico'}</p>`;
    return;
  }

  const historico = results.data || [];
  if (historico.length === 0) {
    historicoDiv.innerHTML = `<p>Sem registros de presença para exibir.</p>`;
    return;
  }

  const linhas = historico.map(l => {
    const presente = Number(l.presenca) === 1;
    const tag = presente
      ? `<span class="tag presente">Presente</span>`
      : `<span class="tag falta">Falta</span>`;
    return `
      <tr>
        <td>${ymdToBr(l.data)}</td>
        <td>${tag}</td>
      </tr>
    `;
  }).join('');

  historicoDiv.innerHTML = `
    <h2>Presenças</h2>
    <table class="tabela-presencas">
      <thead>
        <tr><th>Data</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>
  `;
}

listarTurma();
