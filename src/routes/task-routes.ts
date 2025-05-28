import { Router } from "express";
import { TaskController } from "../controllers/task-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

// Todas as rotas usam o middleware de autenticação
router.post("/tasks", authMiddleware, TaskController.createTask);
router.get("/tasks", authMiddleware, TaskController.getAllTasks);
router.put("/tasks/:id", authMiddleware, TaskController.updateTask);
router.delete("/tasks/:id", authMiddleware, TaskController.deleteTask);

// Nova rota para excluir todas as tarefas concluídas
router.delete("/tasks", authMiddleware, TaskController.deleteCompletedTasks);

export default router;