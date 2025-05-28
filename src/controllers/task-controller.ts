import { Request, Response } from "express";
import { TaskService } from "../services/task-service";

export class TaskController {
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const { title, description, priority, dateTime } = req.body;
      if (!title || !priority) {
        res.status(400).json({ error: "Campos obrigatórios: title e priority" });
        return;
      }

      const validPriorities = ["baixa", "média", "alta"];
      if (!validPriorities.includes(priority)) {
        res.status(400).json({ error: "Prioridade inválida" });
        return;
      }

      const task = await TaskService.createTask({ userId, title, description, priority, dateTime });
      res.status(201).json(task);
    } catch {
      res.status(500).json({ error: "Erro ao criar tarefa" });
    }
  }

  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const { prioridade, data, ordem, titulo, limit, offset } = req.query;

      const limitNum = limit ? Math.min(Number(limit), 50) : 20;
      const offsetNum = offset ? Number(offset) : 0;

      const tasks = await TaskService.getAllTasksByUser(userId, {
        prioridade: prioridade?.toString(),
        data: data?.toString(),
        ordem: ordem?.toString() as "titulo" | "descricao",
        titulo: titulo?.toString(),
        limit: limitNum,
        offset: offsetNum,
      });

      res.json(tasks);
    } catch {
      res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const taskId = Number(req.params.id);
      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const task = await TaskService.updateTask(userId, taskId, req.body);
      if (!task) {
        res.status(404).json({ error: "Tarefa não encontrada" });
        return;
      }

      res.json(task);
    } catch {
      res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const taskId = Number(req.params.id);
      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const success = await TaskService.deleteTask(userId, taskId);
      if (!success) {
        res.status(404).json({ error: "Tarefa não encontrada" });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Erro ao deletar tarefa" });
    }
  }

  static async deleteCompletedTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const deletedCount = await TaskService.deleteCompletedTasks(userId);
      res.json({ message: `${deletedCount} tarefas concluídas removidas` });
    } catch {
      res.status(500).json({ error: "Erro ao remover tarefas concluídas" });
    }
  }
}