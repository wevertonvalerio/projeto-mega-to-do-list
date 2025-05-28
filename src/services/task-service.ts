import { Op, Transaction } from "sequelize";
import { Task } from "../models/task-model";
import { sequelize } from "../database/migrations";

export class TaskService {
  static async createTask(data: {
    userId: number;
    title: string;
    description?: string;
    priority: "baixa" | "média" | "alta";
    dateTime?: Date;
  }) {
    return await sequelize.transaction(async (t: Transaction) => {
      const task = await Task.create(
        {
          ...data,
          taskCompleted: false,
          createdAt: new Date(),
        },
        { transaction: t }
      );
      return task;
    });
  }

  static async getAllTasksByUser(
    userId: number,
    filters: {
      prioridade?: string;
      data?: string;
      ordem?: "titulo" | "descricao";
      titulo?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    if (!userId) throw new Error("UserId obrigatório");

    const where: any = { userId };

    if (filters.prioridade) where.priority = filters.prioridade;

    if (filters.data) {
      const date = new Date(filters.data);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      where.dateTime = {
        [Op.gte]: date,
        [Op.lt]: nextDay,
      };
    }

    if (filters.titulo) {
      // Uso cuidadoso do Op.iLike e limitando resultados para evitar sobrecarga
      where.title = {
        [Op.iLike]: `%${filters.titulo}%`,
      };
    }

    const order: any[] = [];
    if (filters.ordem === "titulo") order.push(["title", "ASC"]);
    else if (filters.ordem === "descricao") order.push(["description", "ASC"]);
    else {
      order.push(["priority", "DESC"]);
      order.push(["dateTime", "ASC"]);
      order.push(["taskCompleted", "ASC"]);
    }

    // Evita findAll sem filtros — sempre filtra userId
    return await Task.findAll({
      where,
      order,
      limit: filters.limit ?? 20, // default 20 resultados por página
      offset: filters.offset ?? 0,
    });
  }

  static async updateTask(userId: number, taskId: number, updates: any) {
    return await sequelize.transaction(async (t) => {
      const task = await Task.findOne({ where: { id: taskId, userId }, transaction: t });
      if (!task) return null;
      return await task.update(updates, { transaction: t });
    });
  }

  static async deleteTask(userId: number, taskId: number) {
    return await sequelize.transaction(async (t) => {
      const deleted = await Task.destroy({ where: { id: taskId, userId }, transaction: t });
      return deleted > 0;
    });
  }

  static async deleteCompletedTasks(userId: number): Promise<number> {
    return await sequelize.transaction(async (t) => {
      const deletedCount = await Task.destroy({ where: { userId, taskCompleted: true }, transaction: t });
      return deletedCount;
    });
  }
}