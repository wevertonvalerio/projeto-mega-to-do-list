import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/migrations";

export interface TaskAttributes {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priority: "baixa" | "média" | "alta";
  dateTime?: Date;
  createdAt?: Date;
  taskCompleted: boolean;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, "id" | "description" | "dateTime" | "createdAt"> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description?: string;
  public priority!: "baixa" | "média" | "alta";
  public dateTime?: Date;
  public createdAt?: Date;
  public taskCompleted!: boolean;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    priority: {
      type: DataTypes.ENUM("baixa", "média", "alta"),
      allowNull: false,
    },
    dateTime: DataTypes.DATE,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    taskCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: false,

    indexes: [
      { fields: ["userId"] },
      { fields: ["priority"] },
      { fields: ["title"] },
      { fields: ["dateTime"] },
      {
        unique: true,
        fields: ["id", "userId"], // garante unicidade combinada (id + usuário)
      },
    ],
  }
);