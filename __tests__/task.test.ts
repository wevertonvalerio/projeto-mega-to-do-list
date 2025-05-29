import request from "supertest"; // Simular requisições HTTP no ambiente de testes
import express from "express"; // Configurar a aplicação e as rotas
import { TaskController } from "../src/controllers/task-controller"; // Gerenciar as rotas e regras de negócio das tarefas
import { authMiddleware } from "../src/middlewares/auth-middleware"; // Simular um login de usuário
import { initialize } from "../src/database/migrations"; // Inicialização do banco de dados SQLite em memória
import { Task } from "../src/models/task-model"; // ajuste o caminho conforme seu projeto

const app = express(); // Cria a instância da aplicação Express
app.use(express.json()); // Configura a aplicação para aceitar JSON no corpo das requisições
app.use(authMiddleware); // Aplica o middleware de autenticação em todas as rotas

// Define as rotas da aplicação com os métodos correspondentes do controlador
app.post("/tasks", TaskController.createTask); // Criar nova tarefa
app.get("/tasks", TaskController.getAllTasks); // Buscar todas as tarefas
app.put("/tasks/:id", TaskController.updateTask); // Editar tarefa específica
app.delete("/tasks/:id", TaskController.deleteTask); // Excluir tarefa específica
app.delete("/tasks/completed", TaskController.deleteCompletedTasks); // Excluir todas as tarefas concluídas

// Objeto que armazena os resultados dos testes por categoria (para exibir depois)
const categoria: Record<string, string> = {};

// ID do usuário simulado (usado pelo middleware authMiddleware)
const userId = 1;

// ========================= FUNÇÕES DE TESTE ===============================

// Testa a criação de 5 tarefas válidas
async function testeAdicionarTarefas() {
  let passed = true;

  // Define um array com 5 tarefas diferentes
  const tarefas = [
    { userId, title: "Tarefa 1", priority: "alta", dateTime: "2100-06-01T10:00:00" },
    { userId, title: "Tarefa 2", priority: "media", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 3", priority: "baixa", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 4", priority: "alta", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 5", priority: "media", dateTime: "2100-06-01T12:00:00" },
  ];

  // Envia cada tarefa para a rota POST /tasks
  for (const t of tarefas) {
    const res = await request(app).post("/tasks").send(t);

    // Verifica se a resposta tem status 201 e se retornou um id
    if (res.status !== 201 || !res.body.id) passed = false;
  }

  // 🔍 Consulta e imprime as tarefas salvas no banco
  // const todasTarefas = await Task.findAll();
  // console.log("Tarefas no banco:", todasTarefas.map(t => t.toJSON()));

  // Armazena o resultado do teste
  categoria.adicionar = passed ? "ok" : "falhou";
  expect(passed).toBe(true);
}

// Testa a edição de uma tarefa
async function testeEditarTarefa() {

  // Cria uma nova tarefa para ser editada
  const criar = await request(app).post("/tasks").send({
    userId,
    title: "Tarefa original",
    priority: "baixa",
    dateTime: "2100-06-10T10:00:00"
  });

  const id = criar.body.id;

  // Envia uma requisição PUT para alterar o título e a prioridade
  const editar = await request(app).put(`/tasks/${id}`).send({
    title: "Tarefa editada",
    priority: "alta"
  });

  // Verifica se os dados foram realmente atualizados
  const passou = editar.body.title === "Tarefa editada" && editar.body.priority === "alta";
  categoria.editar = passou ? "ok" : "falhou";
  expect(passou).toBe(true);
}

// Testa a exclusão de uma tarefa específica
async function testeExcluirTarefa() {
  // Define um array com 5 tarefas diferentes
  const tarefas = [
    { userId, title: "Tarefa 1", priority: "alta", dateTime: "2100-06-01T10:00:00" },
    { userId, title: "Tarefa 2", priority: "media", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 3", priority: "baixa", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 4", priority: "alta", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 5", priority: "media", dateTime: "2100-06-01T12:00:00" },
  ];

  // Envia cada tarefa para a rota POST /tasks
  for (const t of tarefas) {
    const res = await request(app).post("/tasks").send(t);
  }

  // Exclui a tarefa criada ID = 2
  const deletar = await request(app).delete(`/tasks/${2}`);

  // Verifica se a tarefa foi removida
  const listar = await request(app).get("/tasks");
  const aindaExiste = listar.body.some((t: any) => t.id === 2);

  categoria.excluir = deletar.status === 204 && !aindaExiste ? "ok" : "falhou";
  expect(deletar.status).toBe(204);
  expect(aindaExiste).toBe(false);
}

// Testa a exclusão em massa de tarefas concluídas
async function testeExclusaoMassiva() {
  // Define um array com 5 tarefas diferentes
  const tarefas = [
    { userId, title: "Tarefa 1", priority: "alta", dateTime: "2100-06-01T10:00:00", completed: true },
    { userId, title: "Tarefa 2", priority: "media", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 3", priority: "baixa", dateTime: "2100-06-01T12:00:00", completed: true },
    { userId, title: "Tarefa 4", priority: "alta", dateTime: "2100-06-01T12:00:00" },
    { userId, title: "Tarefa 5", priority: "media", dateTime: "2100-06-01T12:00:00", completed: true },
  ];

  // Envia cada tarefa para a rota POST /tasks
  for (const t of tarefas) {
    const res = await request(app).post("/tasks").send(t);
  }
  
  // Remove todas as tarefas concluídas
  const deletar = await request(app).delete("/tasks/completed");

  // Verifica se todas as tarefas com completed: true foram removidas
  const listar = await request(app).get("/tasks");
  const aindaTem = listar.body.some((t: any) => t.completed === true);

  categoria.massiva = deletar.status === 200 && !aindaTem ? "ok" : "falhou";
  expect(aindaTem).toBe(false);
}

// Testa listagem com filtro de prioridade e ordenação por título
async function testeListagemFiltrada() {
  // Cria 10 tarefas com prioridades alternadas
  for (let i = 1; i <= 10; i++) {
    await request(app).post("/tasks").send({
      title: `Filtro ${i}`,
      priority: i % 2 === 0 ? "alta" : "baixa",
      dateTime: `2100-06-${i.toString().padStart(2, '0')}T10:00:00`
    });
  }

  // Faz uma requisição para listar tarefas com prioridade alta e ordenadas por título
  const res = await request(app).get("/tasks").query({ prioridade: "alta", ordem: "titulo" });

  // 🔍 Exibe a lista retornada no terminal
  console.log("Tarefas com prioridade alta:", res.body);

  // Verifica se todas as tarefas listadas têm prioridade alta
  const ok = res.status === 200 && res.body.length > 0 && res.body.every((t: any) => t.priority === "alta");
  categoria.listagem = ok ? "ok" : "falhou";
  expect(ok).toBe(true);
}

// =========================== DESCRIÇÃO DOS TESTES ==========================

describe("TaskController", () => {
  // Executa antes de todos os testes: inicializa o banco de dados em memória
  beforeAll(async () => {
    await initialize();
  });

  // Define os testes que serão executados
  it("Teste de adicionar 5 tarefas válidas", testeAdicionarTarefas);
  it("Teste de edição de tarefa", testeEditarTarefa);
  it("Teste de exclusão de tarefa", testeExcluirTarefa);
  it("Teste de exclusão em massa", testeExclusaoMassiva);
  it("Teste de listagem com ordenação e filtro", testeListagemFiltrada);

  // Executa após todos os testes: imprime os resultados por categoria
  afterAll(() => {
    console.log("Resultado final por categoria:");
    console.log(categoria);
  });
});