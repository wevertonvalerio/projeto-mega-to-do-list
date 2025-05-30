import { Sequelize } from "sequelize";
import fs from 'fs';

// Cria a instância do Sequelize com SQLite
export const sequelize = new Sequelize({
  dialect: "sqlite",               // Usa SQLite como banco de dados
  storage: "./database.sqlite",    // Caminho do arquivo onde os dados serão salvos
  logging: false,                  // Desativa logs SQL no terminal
});

/**
 * Inicializa o banco de dados, sincronizando os modelos com o arquivo .sqlite.
 * - Em ambiente de teste (NODE_ENV = "test"), o banco é reiniciado com `force: true`.
 * - Fora do ambiente de teste, ele apenas aplica alterações com `alter: true`.
 */
export async function initialize() {
  const isTestEnv = process.env.NODE_ENV === "test";

  // Apaga o arquivo do banco, se existir
  const dbFile = './database.sqlite';
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('Arquivo do banco deletado para reinicialização.');
  }

  try {
    await sequelize.sync({
      force: isTestEnv,
      alter: !isTestEnv,
    });
    console.log("Banco de dados inicializado.");
  } catch (error) {
    console.error("Erro na sincronização do banco:", error);
  }
}