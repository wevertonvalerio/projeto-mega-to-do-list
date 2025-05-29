import { Router } from "express"; // Permite criar um conjunto separado de rotas (como um "mini-servidor").
import { TaskController } from "../controllers/task-controller"; 
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router(); // Cria um novo "roteador" (conjunto de rotas). Isso organiza melhor as rotas da aplicação.

/*
  Define as rotas disponíveis para tarefas.

  Cada rota usa o middleware de autenticação:
  - Isso significa que o usuário precisa estar logado/autenticado para acessar qualquer rota abaixo.
*/

router.post("/tasks", authMiddleware, TaskController.createTask); // Rota para criar uma nova tarefa (POST = envio de dados)
router.get("/tasks", authMiddleware, TaskController.getAllTasks); // Rota para buscar todas as tarefas do usuário
router.put("/tasks/:id", authMiddleware, TaskController.updateTask); // Rota para atualizar uma tarefa específica, identificada pelo seu `id`
router.delete("/tasks/:id", authMiddleware, TaskController.deleteTask); // Rota para deletar uma tarefa específica, também pelo `id`
router.delete("/tasks", authMiddleware, TaskController.deleteCompletedTasks); // Rota para deletar todas as tarefas que já estão marcadas como concluídas

export default router; // Exporta o roteador para que ele possa ser usado em outro arquivo (como o app.ts principal)