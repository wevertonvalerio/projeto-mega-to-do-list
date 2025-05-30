import { sequelize } from "../database/migrations"; // Instância do Sequelize conectada ao banco de dados
import { Task } from "../models/task-model";
import { Op, Transaction } from "sequelize"; // 'Op' é usado para operadores avançados (como comparação de datas); 'Transaction' representa uma transação do banco

export class TaskService {
  
  /**
   * Cria uma nova tarefa no banco de dados, dentro de uma transação.
   * @param data - Dados necessários para criar a tarefa.
   * @returns A tarefa criada.
   */
  static async createTask(data: {
    userId: number;
    title: string;
    description?: string;
    priority: "baixa" | "media" | "alta";
    dateTime?: Date;
  }) {
    // Inicia uma transação (evita salvar dados pela metade em caso de erro)
    return await sequelize.transaction(async (t: Transaction) => {
      // Cria a tarefa no banco
      const task = await Task.create(
        {
          ...data, // Espalha os dados recebidos
          taskCompleted: false, // Define como não concluída ao criar
          createdAt: new Date(), // Define a data atual como data de criação
        },
        { transaction: t } // Usa a transação para garantir segurança
      );
      return task;
    });
  }

  /**
   * Retorna todas as tarefas de um usuário, com filtros opcionais.
   * @param userId - ID do usuário dono das tarefas.
   * @param filters - Filtros opcionais como prioridade, data, título, etc.
   * @returns Lista de tarefas filtradas.
   */
  static async getAllTasksByUser(
    userId: number,
    filters: {
      prioridade?: string;
      data?: string;
      ordem?: "titulo" | "descricao";
      titulo?: string;
      limit?: number;
      offset?: number;
    } = {} // valor padrão: objeto vazio
  ) {
    if (!userId) throw new Error("UserId obrigatório");

    const where: any = { userId }; // Começa com filtro pelo usuário

    // Filtra por prioridade, se fornecida
    if (filters.prioridade) where.priority = filters.prioridade;

    // Filtra por data (busca todas as tarefas do mesmo dia)
    if (filters.data) {
      const date = new Date(filters.data);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1); // Soma 1 dia

      where.dateTime = {
        [Op.gte]: date,      // Maior ou igual à data inicial
        [Op.lt]: nextDay,    // Menor que o próximo dia (fim do dia)
      };
    }

    // Filtra por título (busca parcial, sem diferenciar maiúsculas e minúsculas)
    if (filters.titulo) {
      where.title = {
        [Op.iLike]: `%${filters.titulo}%`, // "%texto%" busca qualquer lugar do título
      };
    }

    // Define a ordenação dos resultados
    const order: any[] = [];
    if (filters.ordem === "titulo") order.push(["title", "ASC"]);
    else if (filters.ordem === "descricao") order.push(["description", "ASC"]);
    else {
      // Ordem padrão: prioridade, data e se está concluída
      order.push(["priority", "DESC"]);
      order.push(["dateTime", "ASC"]);
      order.push(["taskCompleted", "ASC"]);
    }

    // Retorna as tarefas com os filtros aplicados
    return await Task.findAll({
      where,
      order,
      limit: filters.limit ?? 20,  // Padrão: 20 por página
      offset: filters.offset ?? 0, // Padrão: começa do início
    });
  }

  /**
   * Atualiza uma tarefa específica de um usuário.
   * @param userId - ID do dono da tarefa.
   * @param taskId - ID da tarefa a ser atualizada.
   * @param updates - Dados que serão atualizados.
   * @returns A tarefa atualizada ou null se não encontrada.
   */
  static async updateTask(userId: number, taskId: number, updates: any) {
    return await sequelize.transaction(async (t) => {
      // Busca a tarefa específica do usuário
      const task = await Task.findOne({ where: { id: taskId, userId }, transaction: t });
      if (!task) return null; // Se não encontrou, retorna null

      // Atualiza os dados da tarefa
      return await task.update(updates, { transaction: t });
    });
  }

  /**
   * Deleta uma tarefa de um usuário.
   * @param userId - ID do usuário.
   * @param taskId - ID da tarefa.
   * @returns true se deletou, false se não encontrou.
   */
  static async deleteTask(userId: number, taskId: number) {
    /*
     * Inicia uma transação com o banco de dados (sequelize.transaction).
     * Transações garantem que, se der erro no meio do caminho, nada seja salvo.
     * A variável t representa essa transação.
     */
    return await sequelize.transaction(async (t) => {
      
      // O where diz: "só delete a tarefa com id = taskId e que pertence ao userId".
      // Isso impede que um usuário apague tarefas de outro.
      const deleted = await Task.destroy({ where: { id: taskId, userId }, transaction: t });

      // A função destroy() retorna quantas linhas foram apagadas.
      // Se foi > 0, significa que uma tarefa foi realmente deletada.
      // Se foi 0, significa que não encontrou nenhuma tarefa com esse taskId e userId juntos.
      return deleted > 0;
    });
  }

  /**
   * Remove todas as tarefas concluídas de um usuário.
   * @param userId - ID do usuário.
   * @returns Quantidade de tarefas removidas.
   */
  static async deleteCompletedTasks(userId: number): Promise<number> {
    return await sequelize.transaction(async (t) => {
      const deletedCount = await Task.destroy({ where: { userId, taskCompleted: true }, transaction: t });
      return deletedCount;
    });
  }
}