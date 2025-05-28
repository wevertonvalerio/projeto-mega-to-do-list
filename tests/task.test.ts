import request from "supertest";
import express from "express";
import { TaskController } from "../src/controllers/task-controller";
import { authMiddleware } from "../src/middlewares/auth-middleware";
import { initialize } from "../src/database/migrations";

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.post("/tasks", TaskController.createTask);
app.get("/tasks", TaskController.getAllTasks);
app.put("/tasks/:id", TaskController.updateTask);
app.delete("/tasks/:id", TaskController.deleteTask);
app.delete("/tasks/completed", TaskController.deleteCompletedTasks);

beforeAll(async () => {
  await initialize();
});

describe("TaskController", () => {
  const categoria: Record<string, string> = {};

  it("Teste de adicionar 5 tarefas válidas", async () => {
    let passed = true;

    const tarefas = [
      { title: "Tarefa 1", priority: "alta", dateTime: "2100-06-01T10:00:00" },
      { title: "Tarefa 2", priority: "média", dateTime: "2100-06-01T12:00:00" },
      { title: "Tarefa 3", priority: "baixa", dateTime: "2100-06-02T14:00:00" },
      { title: "Tarefa 4", priority: "média", dateTime: "2100-06-03T16:00:00" },
      { title: "Tarefa 5", priority: "alta", dateTime: "2100-06-04T18:00:00" },
    ];

    for (const t of tarefas) {
      const res = await request(app).post("/tasks").send(t);
      if (res.status !== 201 || !res.body.id) passed = false;
    }

    categoria.adicionar = passed ? "ok" : "falhou";
    expect(passed).toBe(true);
  });

  it("Teste de edição de tarefa", async () => {
    const criar = await request(app).post("/tasks").send({
      title: "Tarefa original",
      priority: "baixa",
      dateTime: "2100-06-10T10:00:00"
    });

    const id = criar.body.id;
    const editar = await request(app).put(`/tasks/${id}`).send({
      title: "Tarefa editada",
      priority: "alta"
    });

    const passou = editar.body.title === "Tarefa editada" && editar.body.priority === "alta";
    categoria.editar = passou ? "ok" : "falhou";
    expect(passou).toBe(true);
  });

  it("Teste de exclusão de tarefa", async () => {
    const criar = await request(app).post("/tasks").send({
      title: "Tarefa para excluir",
      priority: "média",
      dateTime: "2100-06-10T10:00:00"
    });
    const id = criar.body.id;

    const deletar = await request(app).delete(`/tasks/${id}`);
    const listar = await request(app).get("/tasks");
    const aindaExiste = listar.body.some((t: any) => t.id === id);

    categoria.excluir = deletar.status === 204 && !aindaExiste ? "ok" : "falhou";
    expect(deletar.status).toBe(204);
    expect(aindaExiste).toBe(false);
  });

  it("Teste de exclusão em massa", async () => {
    // Criar 5 tarefas
    for (let i = 0; i < 5; i++) {
      await request(app).post("/tasks").send({
        title: `Massiva ${i + 1}`,
        priority: "baixa",
        dateTime: "2100-06-10T10:00:00",
        completed: true
      });
    }

    const deletar = await request(app).delete("/tasks/completed");
    const listar = await request(app).get("/tasks");
    const aindaTem = listar.body.some((t: any) => t.title.startsWith("Massiva"));

    categoria.massiva = deletar.status === 200 && !aindaTem ? "ok" : "falhou";
    expect(aindaTem).toBe(false);
  });

  it("Teste de listagem com ordenação e filtro", async () => {
    for (let i = 1; i <= 10; i++) {
      await request(app).post("/tasks").send({
        title: `Filtro ${i}`,
        priority: i % 2 === 0 ? "alta" : "baixa",
        dateTime: `2100-06-${i.toString().padStart(2, '0')}T10:00:00`
      });
    }

    const res = await request(app).get("/tasks").query({ prioridade: "alta", ordem: "titulo" });
    const ok = res.status === 200 && res.body.length > 0 && res.body.every((t: any) => t.priority === "alta");
    categoria.listagem = ok ? "ok" : "falhou";
    expect(ok).toBe(true);
  });

  afterAll(() => {
    console.log("Resultado final por categoria:");
    console.log(categoria);
  });
});