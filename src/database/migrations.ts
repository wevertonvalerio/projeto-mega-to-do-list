import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

export async function initialize() {
  await sequelize.sync({ alter: true });
  console.log("Banco inicializado");
}