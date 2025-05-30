import { Request, Response } from "express";
import { TaskService } from "../services/task-service";
import { getAuthenticatedUserId } from "../utils/auth-utils";
import { Task } from "../models/task-model";

// Responsável por lidar com as requisições HTTP relacionadas às tarefas
export class TaskController {

  /*
   * async : Indica que a função usa operações assíncronas, como chamadas de banco de dados ou APIs.
   *         Permite usar await dentro da função, o que pausa até a resposta chegar.
   *
   * req   : Representa a requisição HTTP recebida do cliente (vem com dados do usuário, corpo da requisição etc.).
   * res   : Representa a resposta que será enviada de volta ao cliente.
   *         Se usar res.json(...), isso não conta como "retorno da função", e sim como resposta HTTP.
   * 
   * Promise : Objeto que representa o resultado de uma operação assíncrona. É como dizer: “Prometo que vou te dar um resultado… mais tarde”.
   *           Uma Promise pode estar em três estados:
   *                pending   : Aguardando o resultado da operação (inicial).
   *                fulfilled : A operação deu certo → entregou o valor.
   *                rejected  : A operação falhou → retornou um erro.
   */
  static async createTask(req: Request, res: Response): Promise<void> {
    try {

      // Verifica se o usuario esta autenticado.
      const userId: number | null = getAuthenticatedUserId(req, res);
      if (!userId) return;

      // Usa o método para validar e extrair dados da tarefa
      const taskData: { title: string; description?: string | undefined; priority: "baixa" | "media" | "alta"; dateTime?: Date | undefined; } | null = TaskController.validateTaskData(req, res);
      if (!taskData) return; // Se der erro, já respondeu o cliente

      // Chama o serviço para criar a tarefa
      const task: Task = await TaskService.createTask({ userId, ...taskData });

      // Retorna a tarefa criada com status 201 (criado)
      res.status(203).json(task);
    } catch {
      // Em caso de erro interno, retorna status 500
      res.status(503).json({ error: "Erro ao criar tarefa" });
    }
  }

  /**
   * Método para listar todas as tarefas do usuário, com filtro
   * @returns Json das tarefas encontradas
   */
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {

      // Verifica se o usuario esta autenticado.
      const userId: number | null = getAuthenticatedUserId(req, res);
      if (!userId) return;

      // Extrai os filtros e paginação da query string da URL
      const { prioridade, data, ordem, titulo, limit, offset } = req.query;

      // Converte os parâmetros de paginação para número com valores padrão
      const limitNum: number = limit ? Math.min(Number(limit), 50) : 20; // Limita a 50 resultados no máximo
      const offsetNum: number = offset ? Number(offset) : 0; // Navegar entre páginas de resultados.

      // Chama o serviço para buscar as tarefas com os filtros e paginação
      const tasks: Task[] = await TaskService.getAllTasksByUser(userId, {
        prioridade: prioridade?.toString(),
        data: data?.toString(),
        titulo: titulo?.toString(),
        limit: limitNum,
        offset: offsetNum,
      });

      // Retorna as tarefas encontradas
      res.json(tasks);
    } catch {
      res.status(504).json({ error: "Erro ao buscar tarefas" });
    }
  }

  /**
   * Método para atualizar uma tarefa existente
   * @returns Json da tarefa atualizada
   */
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {

      // Verifica se o usuario esta autenticado.
      const userId = getAuthenticatedUserId(req, res);
      if (!userId) return;

      // Converte o ID da tarefa (string) para número
      const taskId = Number(req.params.id);

      // Buscar dados da tarefa existente no banco
      const existingTask = await Task.findOne({ where: { id: taskId, userId } });
      if (!existingTask) {
        res.status(404).json({ error: "Tarefa não encontrada" });
        return;
      }

      // Usa o método para validar e extrair dados da tarefa
      const taskData = TaskController.validateTaskData(req, res, existingTask);
      if (!taskData) return; // Se der erro, já respondeu o cliente

      // Chama o serviço para atualizar a tarefa com os novos dados
      const task = await TaskService.updateTask(userId, taskId, taskData);

      // Se a tarefa não for encontrada
      if (!task) {
        res.status(407).json({ error: "Tarefa não encontrada" });
        return;
      }

      // Retorna a tarefa atualizada com status 206 (editado)
      res.status(206).json(task);
    } catch {
      res.status(505).json({ error: "Erro ao atualizar tarefa" });
    }
  }

  /**
   * Método para excluir uma tarefa pelo ID
   * @returns Status 204 indicando que foi deletada com sucesso
   */
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {

      // Verifica se o usuario esta autenticado.
      const userId = getAuthenticatedUserId(req, res);
      if (!userId) return;

      // Converte o ID da tarefa (string) para número
      const taskId = Number(req.params.id);

      // Chama o serviço para deletar a tarefa
      const success = await TaskService.deleteTask(userId, taskId);

      // Se a tarefa não for encontrada
      if (!success) {
        res.status(408).json({ error: "Tarefa não encontrada" });
        return;
      }

      // Retorna status 204 (sem conteúdo) indicando que foi deletada com sucesso
      res.status(205).send();
    } catch {
      res.status(506).json({ error: "Erro ao deletar tarefa" });
    }
  }

  /**
   * Método para excluir todas as tarefas marcadas como concluídas
   * @returns Quantidade de tarefas deletadas
   */
  static async deleteCompletedTasks(req: Request, res: Response): Promise<void> {
    try {

      // Verifica se o usuario esta autenticado.
      const userId = getAuthenticatedUserId(req, res);
      if (!userId) return;

      // Chama o serviço para deletar todas as tarefas concluídas
      const deletedCount = await TaskService.deleteCompletedTasks(userId);

      // Retorna a quantidade de tarefas deletadas
      res.json({ message: `${deletedCount} tarefas concluídas removidas` });
    } catch {
      res.status(507).json({ error: "Erro ao remover tarefas concluídas" });
    }
  }

 private static validateTaskData(
    req: Request,
    res: Response,
    dadosExistentes?: {
      title: string;
      description?: string;
      priority: "baixa" | "media" | "alta";
      dateTime?: Date;
      taskCompleted?: boolean;
    }
  ): {
    title: string;
    description?: string;
    priority: "baixa" | "media" | "alta";
    dateTime?: Date;
    taskCompleted?: boolean;
  } | null {
    const { title, description, priority, dateTime, taskCompleted } = req.body;
    const validPriorities = ["baixa", "media", "alta"];

    // Preenche os dados ausentes com os existentes
    const finalTitle = title ?? dadosExistentes?.title;
    const finalPriority = priority ?? dadosExistentes?.priority;

    if (!finalTitle || !finalPriority) {
      res.status(409).json({ error: "Campos obrigatórios: title e priority" });
      return null;
    }

    if (!validPriorities.includes(finalPriority)) {
      res.status(409).json({ error: "Prioridade inválida" });
      return null;
    }

    return {
      title: finalTitle,
      description: description ?? dadosExistentes?.description,
      priority: finalPriority,
      dateTime: dateTime ? new Date(dateTime) : dadosExistentes?.dateTime,
      taskCompleted: taskCompleted ?? dadosExistentes?.taskCompleted,
    };
  }
}