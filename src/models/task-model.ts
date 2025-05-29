// Importa utilitários do Sequelize:
// - DataTypes: para definir os tipos dos campos da tabela
// - Model: classe base que representa uma tabela no banco
// - Optional: utilitário do TypeScript para tornar alguns atributos opcionais
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/migrations"; // Importa a conexão com o banco de dados

/*
  Define a interface que representa os atributos de uma tarefa (Task).
  Isso é útil para o TypeScript saber quais campos uma tarefa possui.
*/
export interface TaskAttributes {
  id: number;                           // Identificador único da tarefa
  userId: number;                       // ID do usuário dono da tarefa
  title: string;                        // Título da tarefa
  description?: string;                 // Descrição (opcional)
  priority: "baixa" | "media" | "alta"; // Prioridade da tarefa
  dateTime?: Date;                      // Data e hora limite da tarefa (opcional)
  createdAt: Date;                      // Data de criação (preenchida automaticamente)
  taskCompleted: boolean;               // Indica se a tarefa foi concluída
}

/*
  Define quais atributos são opcionais na hora de criar uma nova tarefa.
*/
interface TaskCreationAttributes extends Optional<TaskAttributes, "id" | "description" | "dateTime"> {}

/*
  Define a classe Task, que representa a tabela de tarefas.
  Ela estende a classe Model do Sequelize e implementa a interface TaskAttributes.
*/
export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description?: string;
  public priority!: "baixa" | "media" | "alta";
  public dateTime?: Date;
  public createdAt!: Date;
  public taskCompleted!: boolean;
}

/*
  Inicializa o modelo Task, definindo os campos da tabela e suas configurações.
  Cada campo é configurado com seu tipo, se é obrigatório, valor padrão etc.
*/
Task.init(
  {
    // Campo ID (chave primária, auto incremento)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, // obrigatório
    },

    // ID do usuário dono da tarefa
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Título da tarefa
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Descrição da tarefa (texto mais longo, opcional)
    description: DataTypes.TEXT,

    // Prioridade da tarefa (baixa, media ou alta)
    priority: {
      type: DataTypes.ENUM("baixa", "media", "alta"),
      allowNull: false,
    },

    // Data e hora programada da tarefa (opcional)
    dateTime: DataTypes.DATE,

    // Data de criação (preenchida automaticamente com a data atual)
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },

    // Indica se a tarefa foi concluída
    taskCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // por padrão, a tarefa ainda não está concluída
    },
  },
  {
    sequelize, // Conexão com o banco
    modelName: "Task", // Nome do modelo no Sequelize
    tableName: "tasks", // Nome real da tabela no banco
    timestamps: false, // Desativa a criação automática de campos `createdAt` e `updatedAt`

    // Índices no banco para melhorar a performance em buscas
    indexes: [
      { fields: ["userId"] },     // índice para facilitar buscas por usuário
      { fields: ["priority"] },   // índice para buscas por prioridade
      { fields: ["title"] },      // índice para buscas por título
      { fields: ["dateTime"] },   // índice para ordenar ou buscar por data

      {
        unique: true,             // índice único: impede que dois registros com o mesmo id + userId existam
        fields: ["id", "userId"],
      },
    ],
  }
);