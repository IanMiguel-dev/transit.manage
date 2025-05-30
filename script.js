// Verifica se está logado
if (window.location.pathname.includes('index.html')) {
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.href = 'login.html';
    }
}

// LOGIN
if (window.location.pathname.includes('login.html')) {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        if (usuario === 'admin' && senha === '1234') {
            localStorage.setItem('usuarioLogado', true);
            window.location.href = 'index.html';
        } else {
            alert('Usuário ou senha incorretos!');
        }
    });
}

// LOGOUT
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
}

// AGENDAMENTOS
const agendamentoForm = document.getElementById('agendamentoForm');
const agendamentosDiv = document.getElementById('agendamentos');
const searchInput = document.getElementById('searchInput');

let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

function salvarAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function listarAgendamentos() {
    agendamentosDiv.innerHTML = '';

    // Ordenar por data
    agendamentos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

    const filtro = searchInput.value.toLowerCase();

    const table = document.createElement('table');
    const header = `<tr>
        <th>Data/Hora</th>
        <th>Paciente</th>
        <th>Embarque</th>
        <th>Desembarque</th>
        <th>Motorista</th>
        <th>Carro</th>
        <th>Observações</th>
        <th>Ações</th>
    </tr>`;
    table.innerHTML = header;

    agendamentos.forEach((item, index) => {
        if (
            item.paciente.toLowerCase().includes(filtro) ||
            item.embarque.toLowerCase().includes(filtro) ||
            item.desembarque.toLowerCase().includes(filtro) ||
            item.motorista.toLowerCase().includes(filtro)
        ) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(item.dataHora).toLocaleString()}</td>
                <td>${item.paciente}</td>
                <td>${item.embarque}</td>
                <td>${item.desembarque}</td>
                <td>${item.motorista}</td>
                <td>${item.carro}</td>
                <td>${item.observacoes}</td>
                <td>
                    <button onclick="editarAgendamento(${index})">Editar</button>
                    <button onclick="excluirAgendamento(${index})">Excluir</button>
                </td>
            `;
            table.appendChild(row);
        }
    });

    agendamentosDiv.appendChild(table);
}

if (agendamentoForm) {
    agendamentoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoAgendamento = {
            dataHora: document.getElementById('dataHora').value,
            paciente: document.getElementById('paciente').value,
            embarque: document.getElementById('embarque').value,
            desembarque: document.getElementById('desembarque').value,
            motorista: document.getElementById('motorista').value,
            carro: document.getElementById('carro').value,
            observacoes: document.getElementById('observacoes').value
        };
        agendamentos.push(novoAgendamento);
        salvarAgendamentos();
        listarAgendamentos();
        agendamentoForm.reset();
    });
}

function excluirAgendamento(index) {
    if (confirm('Deseja excluir este agendamento?')) {
        agendamentos.splice(index, 1);
        salvarAgendamentos();
        listarAgendamentos();
    }
}

function editarAgendamento(index) {
    const item = agendamentos[index];

    document.getElementById('dataHora').value = item.dataHora;
    document.getElementById('paciente').value = item.paciente;
    document.getElementById('embarque').value = item.embarque;
    document.getElementById('desembarque').value = item.desembarque;
    document.getElementById('motorista').value = item.motorista;
    document.getElementById('carro').value = item.carro;
    document.getElementById('observacoes').value = item.observacoes;

    excluirAgendamento(index);
}

if (searchInput) {
    searchInput.addEventListener('input', listarAgendamentos);
}

// Inicializar
if (agendamentosDiv) {
    listarAgendamentos();
}
