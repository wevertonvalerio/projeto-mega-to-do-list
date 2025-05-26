import { Response } from "express";
import { 
    criarTasks,
    listarTasksPorUsuario,
    atualizarTasks,
    deletarTaskPorId
 } from "../models/task-model";
import { AuthRequest } from "../middlewares/auth-middleware";

export const criarTask = async (req: AuthRequest, res: Response) => {

    try {
        
        const usuarioId = req.user?.id;
        const { titulo, descricao, data, prioridade } = req.body;

        if (!usuarioId) {
            res.status(401).send(
                {
                    error: "Usuario não autenticado!!!"
                }
            )
            return;
        }

        const novaTask = await criarTasks({
                titulo,
                descricao,
                data,
                prioridade,
                usuario_id: usuarioId
        });

        res.status(201).send(
            {
                message: "Task criada com sucesso!!!",
                task: novaTask
            }
        )

    } catch (error) {
        res.status(500).send(
            {
                error: "Erro ao criar Tarefa!!!"
            }
        )
        console.log(error)
    }

};

export const listarTask = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).send(
            { 
                error: "Usuário não autenticado!!!" 
            }
        );
    }

    const tasks = await listarTasksPorUsuario(usuarioId);

    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(
        { 
            error: "Erro ao listar tarefas!!!",
        }
    );
  }
};

export const atualizarTask = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;
    const dadosAtualizados = req.body;

    if (!usuarioId) {
      res.status(401).send(
            { 
                error: "Usuário não autenticado!!!" 
            }
        );
    }

    const tarefaAtualizada = await atualizarTasks(Number(id), usuarioId, dadosAtualizados);

    if (!tarefaAtualizada) {
        res.status(404).send(
            { 
                error: "Task não encontrada ou não pertence ao usuário!!!" 
            }
        );
    }

    res.send(
        {
            tarefaAtualizada
        }
    );

  } catch (error) {

    res.status(500).send(
        { 
            error: "Erro ao atualizar task!!!" 
        }
    );
  }
};

export const deletarTask = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user?.id;
    const { id } = req.params;

    if (!usuarioId) {
      res.status(401).send(
            { 
                error: "Usuário não autenticado!!!" 
            }
        );
    }

    const tarefaDeletada = await deletarTaskPorId(Number(id), usuarioId);

    if (!tarefaDeletada) {
        res.status(404).send(
            { 
                error: "Task não encontrada ou não pertence ao usuário!!!" 
            }
        );
    }

    res.send(
        { 
            mensagem: "Task deletada com sucesso!!!" 
        }
    );

  } catch (error) {

    res.status(500).send(
        { 
            error: "Erro ao deletar task!!!" 
        }
    );
  }

};