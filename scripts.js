const ramaisPorPagina = 13; // Número de ramais por página
let paginaAtual = 1; // Página inicial
let senhaAutenticada = localStorage.getItem('senhaAutenticada'); // Variável para armazenar o estado de autenticação
let maquinasVisiveis = false; // Variável para armazenar o estado de visibilidade das máquinas

// Função para carregar os ramais da página atual
function carregarRamais(lista = ramaisFiltrados) {
    const listaElement = document.querySelector('#lista-ramais tbody');
    listaElement.innerHTML = '';

    const inicio = (paginaAtual - 1) * ramaisPorPagina;
    const fim = inicio + ramaisPorPagina;
    const ramaisPagina = lista.slice(inicio, fim);

    ramaisPagina.forEach((ramal) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ramal.nome}</td>
            <td>${ramal.ramal}</td>
            <td>${ramal.setor}</td>
            <td class="maquina" data-maquina="${ramal.maquina}">${maquinasVisiveis ? ramal.maquina : '*'.repeat(ramal.maquina.length)}</td>
        `;
        listaElement.appendChild(row);
    });
    renderizarPaginacao(lista.length);
}

// Função para criar botões de navegação de páginas
function renderizarPaginacao(totalRamais) {
    const paginacaoContainer = document.getElementById('paginacao');
    paginacaoContainer.innerHTML = '';

    const totalPaginas = Math.ceil(totalRamais / ramaisPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
        const botaoPagina = document.createElement('button');
        botaoPagina.textContent = i;
        botaoPagina.classList.add('pagina-botao');
        if (i === paginaAtual) botaoPagina.classList.add('pagina-ativa');

        botaoPagina.addEventListener('click', () => {
            paginaAtual = i;
            carregarRamais();
        });

        paginacaoContainer.appendChild(botaoPagina);
    }
}

// Função para filtrar os ramais com base no termo de pesquisa
function filtrarRamais() {
    const termo = removerAcentos(document.getElementById('search-input').value.toLowerCase());
    ramaisFiltrados = listaRamais.filter((ramal) => {
        const nome = removerAcentos(ramal.nome.toLowerCase());
        const ramalNumero = removerAcentos(ramal.ramal.toLowerCase());
        const setor = removerAcentos(ramal.setor.toLowerCase());
        const maquina = removerAcentos(ramal.maquina.toLowerCase());
        return nome.includes(termo) || ramalNumero.includes(termo) || setor.includes(termo) || maquina.includes(termo);
    });
    paginaAtual = 1; // Resetar para a primeira página após filtrar
    carregarRamais();
}

// Função para remover acentos (ajuda na pesquisa)
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener("DOMContentLoaded", function () {
    // Carrega os ramais a partir do arquivo JSON
    fetch("https://gruposmi.github.io/database/database.json")
      .then(response => response.json())
      .then(data => {
        // Substitui a listaRamais hard-coded pelos dados carregados do JSON
        listaRamais = data;
        ramaisFiltrados = [...listaRamais];
        carregarRamais();
      })
      .catch(error => console.error("Erro ao carregar os ramais:", error));
    
    // Outras inicializações, como definir a data da última atualização
    const dataUltimaAtualizacao = "21/02/2025";
    const ultimaAtualizacaoElement = document.getElementById("ultima-atualizacao");
    ultimaAtualizacaoElement.textContent = `Atualizado em ${dataUltimaAtualizacao}`;
  
    // Evento para o clique na logo que recarrega a página
    document.getElementById('logo-img').addEventListener('click', function() {
      location.reload();
    });

    // Evento para o clique no ícone de olho que alterna a visibilidade das máquinas
    document.querySelector('.fa-eye').addEventListener('click', function() {
        if (senhaAutenticada !== 'true') {
            window.location.href = "login.html";
        } else {
            maquinasVisiveis = !maquinasVisiveis;
        }
        document.querySelectorAll('.maquina').forEach(element => {
            if (maquinasVisiveis) {
                element.textContent = element.getAttribute('data-maquina');
            } else {
                element.textContent = '*'.repeat(element.getAttribute('data-maquina').length);
            }
        });
    });
});
