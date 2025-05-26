import { pool } from "../../config/db";
import { Task } from "../interfaces/task-interface";

export const criarTasks = async (task: Task) => {

    const { titulo, descricao, data, prioridade, usuario_id } = task;
    
    const result = await pool.query(
        `INSERT INTO tasks (
            titulo,
            descricao, 
            data, 
            prioridade, 
            usuario_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [titulo, descricao, data, prioridade, usuario_id]
    );

  return result.rows[0];
};

export const listarTasksPorUsuario = async (usuario_id: number) => {

    const result = await pool.query(
        `SELECT * FROM tasks WHERE usuario_id = $1 ORDER BY data DESC`,
        [usuario_id]
    )

  return result.rows;
};

export const atualizarTasks = async (
    id: number,
    usuario_id: number,
    camposAtualizados: Partial<{ titulo: string; descricao: string; data: string; prioridade: string }>
) => {
    const keys = Object.keys(camposAtualizados);
    const values = Object.values(camposAtualizados);

    if (keys.length === 0) return null;

    const result = await pool.query(
      `UPTADE tasks SET $1
      WHERE id = $2 AND usuario_id = $3 RETURNING *`,
      [values, keys.length + 1, keys.length + 2]
    )

    return result.rows[0];
};

export const deletarTaskPorId = async (id: number, usuario_id: number) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND usuario_id = $2 RETURNING *",
    [id, usuario_id]
  );
  return result.rows[0];
};