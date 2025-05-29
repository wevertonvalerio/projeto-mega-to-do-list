import { Sequelize } from "sequelize"; // Facilita a comunicação entre o código JavaScript/TypeScript e o banco de dados.
import { pool } from "../../config/db";

// Cria uma instância do Sequelize, configurando para usar o banco de dados SQLite.
export const sequelize = new Sequelize({

  dialect: "sqlite", // Define o tipo de banco de dados. No caso, "sqlite", que é um banco leve baseado em arquivo.
  storage: "./database.sqlite", // Define o caminho do arquivo onde os dados do banco ficarão salvos
  logging: false, // Desativa os logs no terminal (nao mostra comandos SQL durante a execução para fins de teste)
});

/*
  Função responsável por inicializar o banco de dados.
  Ela sincroniza os modelos (tabelas) definidos no código com o banco de dados físico (arquivo .sqlite).

  O `alter: true` faz com que o Sequelize atualize automaticamente o banco quando houver mudanças nos modelos.
*/
export async function initialize() {
  const isTestEnv = process.env.NODE_ENV === 'test';
  await sequelize.sync({ force: isTestEnv, alter: !isTestEnv });
  console.log("Banco inicializado");

const criarTabelas = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT  UNIQUE NOT NULL,
        senha TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT,
        data DATE NOT NULL,
        prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta')) NOT NULL,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  catch(error) {
    console.error(error);
  } 
};