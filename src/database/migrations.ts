import { pool } from "../../config/db";

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