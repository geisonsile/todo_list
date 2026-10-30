const inputTarefa = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const CHAVE_STORAGE = 'lista-tarefas'; // Chave usada no localStorage

let tarefas = [];

// Gera um identificador único por tarefa,
// evitando conflito ao excluir tarefas com o mesmo texto.
const gerarId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Serializa o estado e grava no localStorage.
const salvarTarefas = () => {
    try {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas, null, 2));
    } catch (erro) {
        console.error('Não foi possível salvar as tarefas:', erro);
    }
};

// Lê e desserializa o estado salvo.
const carregarTarefas = () => {
    const json = localStorage.getItem(CHAVE_STORAGE);
    if (!json) return [];

    try {
        const dados = JSON.parse(json);
        if (!Array.isArray(dados)) return [];

        return dados
            .filter((item) => item && typeof item.texto === 'string' && item.texto.trim())
            .map((item) => ({
                id: item.id ?? gerarId(),
                texto: item.texto,
            }));
    } catch (erro) {
        console.warn('Dados inválidos no localStorage. Iniciando lista vazia.', erro);
        return [];
    }
};

/**
 * Cria o elemento <li> de uma tarefa já existente no estado.
 * Separado de "adicionarTarefa" para ser reutilizado na renderização inicial.
 */
const criarElementoTarefa = (tarefa) => {
    const li = document.createElement('li');

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarefa.texto;

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.classList.add('btn-excluir');

    btnExcluir.addEventListener('click', () => {
        tarefas = tarefas.filter((t) => t.id !== tarefa.id); // Remove do estado pelo id
        salvarTarefas();
        li.remove();
    });

    li.appendChild(spanTexto);
    li.appendChild(btnExcluir);

    return li;
};

const renderizarTarefas = () => {
    listaTarefas.innerHTML = '';
    tarefas.forEach((tarefa) => {
        listaTarefas.appendChild(criarElementoTarefa(tarefa));
    });
};

const adicionarTarefa = () => {
    const texto = inputTarefa.value.trim();

    if (!texto) return;

    const novaTarefa = { id: gerarId(), texto };
    tarefas.push(novaTarefa);

    listaTarefas.appendChild(criarElementoTarefa(novaTarefa));

    salvarTarefas();

    inputTarefa.value = '';
    inputTarefa.focus();
};

// Inicialização: lê o localStorage e monta a lista na tela
tarefas = carregarTarefas();
renderizarTarefas();

btnAdicionar.addEventListener('click', adicionarTarefa);

inputTarefa.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        adicionarTarefa();
    }
});
