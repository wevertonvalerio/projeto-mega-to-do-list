import { Router } from "express";
import { TaskController } from "../controllers/task-controller";
import { autenticarToken } from "../middlewares/auth-middleware";
import { validarRequisicao } from "../middlewares/validation-middleware";
import { body, param } from "express-validator";

const router = Router();

// Criar tarefa - validar campos básicos antes de chamar o controller
router.post(
  "/tasks",
  autenticarToken,
  [
    body("title").notEmpty().withMessage("O título da tarefa é obrigatório"),
    body("priority").notEmpty().withMessage("A prioridade da tarefa é obrigatória"),
    body("title").isString(),
    body("description").optional().isString(),
    body("dateTime").optional().isDate(),
    validarRequisicao
  ],
  TaskController.createTask
);

// Buscar todas as tarefas - só precisa do token
router.get("/tasks", autenticarToken, TaskController.getAllTasks);

// Atualizar tarefa - validar id e dados da tarefa
router.put(
  "/tasks/:id",
  autenticarToken,
  [
    param("id").isInt().withMessage("ID da tarefa inválido"),
    body("title").optional().notEmpty().withMessage("O título não pode ser vazio"),
    body("priority").optional().notEmpty().withMessage("A prioridade não pode ser vazia"),
    body("title").isString(),
    body("description").optional().isString(),
    body("dateTime").optional().isDate(),
    body("taskCompleted").optional().isBoolean(),
    validarRequisicao
  ],
  TaskController.updateTask
);

// Deletar tarefa pelo id - validar id
router.delete(
  "/tasks/:id",
  autenticarToken,
  [
    param("id").isInt().withMessage("ID da tarefa inválido"),
    validarRequisicao
  ],
  TaskController.deleteTask
);

// Deletar todas as tarefas concluídas - só token
router.delete("/tasks", autenticarToken, TaskController.deleteCompletedTasks);

export default router;