import express from "express"; // facilita a criação de servidores HTTP com Node.js
import { TaskController } from "./controllers/task-controller";
import { authMiddleware } from "./middlewares/auth-middleware"; // verifica se o usuário está autenticado antes de acessar as rotas
import { initialize } from "./database/migrations"; // Importa a função que inicializa o banco de dados, criando as tabelas necessárias

const app = express(); // Cria a aplicação Express (nosso servidor)
app.use(express.json()); // Permite que o servidor entenda requisições com corpo em JSON
app.use(authMiddleware); // Usa o middleware de autenticação para proteger todas as rotas

/*
  Define as rotas da aplicação e associa cada uma a um método do TaskController.
  O TaskController cuida da lógica de negócio (como lidar com tarefas).
*/
app.post("/tasks", TaskController.createTask); // Rota para criar uma nova tarefa (POST = enviar dados)
app.get("/tasks", TaskController.getAllTasks); // Rota para buscar todas as tarefas do usuário autenticado
app.put("/tasks/:id", TaskController.updateTask); // Rota para atualizar uma tarefa específica (usando o ID dela)
app.delete("/tasks/:id", TaskController.deleteTask); // Rota para deletar uma tarefa específica (também usando o ID dela)
app.delete("/tasks/completed", TaskController.deleteCompletedTasks); // Rota para deletar todas as tarefas que já foram concluídas

initialize(); // Inicializa o banco de dados, criando as tabelas se ainda não existirem

// Faz o servidor "escutar" a porta 3000. Isso significa que ele estará disponível em http://localhost:3000
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

export default app; // Exporta o app para que ele possa ser usado em outros arquivos (por exemplo, nos testes)