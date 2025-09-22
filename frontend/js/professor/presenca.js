const API = 'http://localhost:3006';

// util: Date -> "AAAA-MM-DD"
function formatDateToYMD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

async function getTurmaById(id) {
  const r = await fetch(API + '/turma/' + id);
  const j = await r.json();
  if (!j.success) throw new Error(j.message || 'Erro ao carregar turma');
  return j.data;
}

async function loadPresencas(turmaId, dataYMD) {
  const url = API + '/presenca?turmaId=' + encodeURIComponent(turmaId) +
              '&data=' + encodeURIComponent(dataYMD);
  const r = await fetch(url);
  const j = await r.json();
  if (!j.success) throw new Error(j.message || 'Erro ao carregar presenças');
  return j.data; // [{id_aluno, nome, email, presenca, tem_registro?}]
}

async function setPresenca({ id_aluno, id_turma, id_professor, data, presenca }) {
  const r = await fetch(API + '/presenca/set', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_aluno, id_turma, id_professor, data, presenca })
  });
  const j = await r.json();
  if (!j.success) throw new Error(j.message || 'Erro ao salvar presença');
  return j.data;
}

function renderHeader(turmaNome) {
  return (
    '<div id="topo_presenca" style="display:flex; gap:12px; align-items:center; justify-content:space-between;">' +
      '<h1 style="margin:0;">' + turmaNome + '</h1>' +
      '<div style="display:flex; gap:8px; align-items:center;">' +
        '<label for="data_chamada">Data:</label>' +
        '<input type="date" id="data_chamada" />' +
      '</div>' +
    '</div>' +
    '<hr/>'
  );
}

function renderListaAlunos(alunos, id_turma, dataYMD, id_professor) {
  if (!alunos || alunos.length === 0) {
    return '<p>Nenhum aluno nessa turma.</p>';
  }

  const linhas = alunos.map(function(a) {
    const presente = Number(a.presenca) === 1;
    const texto = presente ? 'Presente' : 'Falta';
    const classe = presente ? 'btn-presente' : 'btn-falta';
    const temRegistro = Number(a.tem_registro || 0) === 1;

    return (
      '<div class="linha-aluno" style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;">' +
        '<div>' +
          '<strong>' + a.nome + '</strong><br/>' +
          '<small>' + (a.email || '') + '</small>' +
        '</div>' +
        '<button ' +
          'class="' + classe + '" ' +
          'data-id-aluno="' + a.id_aluno + '" ' +
          'data-id-turma="' + id_turma + '" ' +
          'data-id-prof="' + id_professor + '" ' +
          'data-data="' + dataYMD + '" ' +
          'data-presenca="' + (presente ? 1 : 0) + '" ' +
          'data-has="' + (temRegistro ? 1 : 0) + '" ' +
          'style="padding:6px 12px; border-radius:8px; border:1px solid #ccc; cursor:pointer;">' +
          texto +
        '</button>' +
      '</div>'
    );
  }).join('');

  return '<div id="lista_alunos">' + linhas + '</div>';
}

function aplicarEstilosBasicos() {
  const style = document.createElement('style');
  style.textContent =
    '.btn-falta { background:#fff; }' +
    '.btn-presente { background:#e7ffe7; }' +
    '.btn-presente:hover, .btn-falta:hover { filter: brightness(0.98); }';
  document.head.appendChild(style);
}

async function initPresencaPage() {
  aplicarEstilosBasicos();

  const infoDiv = document.getElementById('informacoes_turma');
  if (!infoDiv) return;

  const turmaAbertaStr = localStorage.getItem('turmaAberta');
  if (!turmaAbertaStr) {
    infoDiv.innerHTML = '<p>Não há turma selecionada.</p>';
    return;
  }

  const turmaAberta = JSON.parse(turmaAbertaStr);
  const id_turma = turmaAberta.id;
  let turmaNome = turmaAberta.nome;

  try {
    const turma = await getTurmaById(id_turma);
    turmaNome = turma.nome;
  } catch (e) {
    // mantém nome do cache
  }

  infoDiv.innerHTML = renderHeader(turmaNome);

  const inputData = document.getElementById('data_chamada');
  inputData.value = formatDateToYMD(new Date());

  const id_professor = Number(localStorage.getItem('usuarioId')) || null;

  async function carregarDiaSelecionado() {
    const dataYMD = inputData.value;
    if (!dataYMD) return;

    // opcional: gerar registros "falta=0" para quem não tiver ainda
    try {
      await fetch(API + '/presenca/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_turma: id_turma,
          id_professor: id_professor,
          data: dataYMD
        })
      });
    } catch (e) {
      // se a rota não existir, ignora
    }

    try {
      const alunos = await loadPresencas(id_turma, dataYMD);
      const htmlLista = renderListaAlunos(alunos, id_turma, dataYMD, id_professor);

      let container = document.getElementById('container_lista');
      if (!container) {
        container = document.createElement('div');
        container.id = 'container_lista';
        infoDiv.appendChild(container);
      }
      container.innerHTML = htmlLista;

      // clique dos botões (inclui "primeiro clique em Falta" para criar o 0)
      container.querySelectorAll('button[data-id-aluno]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
          const atual = Number(btn.getAttribute('data-presenca')) === 1;   // 1=presente, 0=falta
          const temRegistro = Number(btn.getAttribute('data-has')) === 1;  // já existe linha no banco?

          // primeiro clique em Falta: grava 0 e não muda UI
          if (!temRegistro && !atual) {
            try {
              await setPresenca({
                id_aluno: Number(btn.getAttribute('data-id-aluno')),
                id_turma: Number(btn.getAttribute('data-id-turma')),
                id_professor: Number(btn.getAttribute('data-id-prof')) || null,
                data: btn.getAttribute('data-data'),
                presenca: 0
              });
              btn.setAttribute('data-has', '1');
            } catch (e) {
              alert('Erro ao salvar falta: ' + (e.message || ''));
            }
            return; // não faz toggle
          }

          // toggle normal
          const novoValor = !atual;

          // otimista: atualiza UI
          btn.textContent = novoValor ? 'Presente' : 'Falta';
          btn.classList.toggle('btn-presente', novoValor);
          btn.classList.toggle('btn-falta', !novoValor);
          btn.setAttribute('data-presenca', novoValor ? '1' : '0');

          try {
            await setPresenca({
              id_aluno: Number(btn.getAttribute('data-id-aluno')),
              id_turma: Number(btn.getAttribute('data-id-turma')),
              id_professor: Number(btn.getAttribute('data-id-prof')) || null,
              data: btn.getAttribute('data-data'),
              presenca: novoValor
            });
            btn.setAttribute('data-has', '1');
          } catch (e) {
            // reverte se falhar
            const revert = !novoValor;
            btn.textContent = revert ? 'Presente' : 'Falta';
            btn.classList.toggle('btn-presente', revert);
            btn.classList.toggle('btn-falta', !revert);
            btn.setAttribute('data-presenca', revert ? '1' : '0');
            alert('Erro ao salvar presença: ' + (e.message || ''));
          }
        });
      });

    } catch (e) {
      let container = document.getElementById('container_lista');
      if (!container) {
        container = document.createElement('div');
        container.id = 'container_lista';
        infoDiv.appendChild(container);
      }
      container.innerHTML = '<p style="color:red;">' + (e.message || 'Erro ao carregar presenças') + '</p>';
    }
  }

  await carregarDiaSelecionado();
  inputData.addEventListener('change', carregarDiaSelecionado);
}

document.addEventListener('DOMContentLoaded', initPresencaPage);