import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

export async function initialize() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Banco de dados inicializado.");
  } catch (error) {
    console.error("Erro na sincronização do banco:", error);
  }
}