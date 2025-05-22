import { Request, Response } from "express";
import {
    criarUsuario,
    loginUsuario
} from "../services/userService";

export const cadastrarUsuario = async (req: Request, res: Response) => {
    try {

        const { nome, senha } = req.body;
        const usuario = await criarUsuario(nome, senha);
        res.status(201).send(
            {
                message: "Usuario criado com sucesso!!!",
                usuario
            }
        );

    } catch (error) {
        
        res.status(500).send(
            {
                error: error.message
            }
        );

    }
};

export const logarUsuario = async (req: Request, res: Response) => {

  try {

    const { nome, senha } = req.body;
    const { token } = await loginUsuario(nome, senha);

    res.status(200).send(
        { 
            message: "Login realizado com sucesso!!!", 
            token 
        });

  } catch (error: any) {
    res.status(401).json(
        { 
            error: error.message 
        }
    );
  }
};